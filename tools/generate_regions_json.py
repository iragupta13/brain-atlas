#!/usr/bin/env python3
"""
Generate regions.json with enhanced metadata including centroids.
This reads the NIfTI labels file and computes centroid coordinates for each region.
"""

import json
import re
from pathlib import Path
import numpy as np
import nibabel as nib


def determine_hemisphere(name: str) -> str:
    """Determine hemisphere from region name suffix."""
    if name.endswith('_L'):
        return 'left'
    elif name.endswith('_R'):
        return 'right'
    else:
        return 'bilateral'


def determine_group(parent: str, name: str) -> str:
    """Map parent category to display group."""
    parent_map = {
        'Frontal_Lobe': 'Frontal_Lobe',
        'Parietal_Lobe': 'Parietal_Lobe',
        'Temporal_Lobe': 'Temporal_Lobe',
        'Occipital_Lobe': 'Occipital_Lobe',
        'Cingulate_Cortex': 'Cingulate_Cortex',
        'Basal_Ganglia': 'Basal_Ganglia',
        'Medial_Temporal': 'Medial_Temporal',
        'Cerebellum': 'Cerebellum',
    }

    # Check parent first
    if parent in parent_map:
        return parent_map[parent]

    # Check name patterns
    if name.startswith('Thal_'):
        return 'Thalamus'
    if name.startswith('Cerebellum_') or name.startswith('Vermis_'):
        return 'Cerebellum'
    if any(x in name for x in ['VTA', 'SN_', 'Red_N', 'LC_', 'Raphe']):
        return 'Brainstem'

    return 'Other'


def format_display_name(name: str) -> str:
    """Convert internal name to human-readable display name."""
    # Handle hemisphere suffix
    hemisphere_suffix = ''
    if name.endswith('_L'):
        name = name[:-2]
        hemisphere_suffix = ' (Left)'
    elif name.endswith('_R'):
        name = name[:-2]
        hemisphere_suffix = ' (Right)'

    # Replace underscores with spaces
    name = name.replace('_', ' ')

    # Handle common abbreviations
    abbreviations = {
        'Sup': 'Superior',
        'Inf': 'Inferior',
        'Mid': 'Middle',
        'Med': 'Medial',
        'Lat': 'Lateral',
        'Ant': 'Anterior',
        'Post': 'Posterior',
        'Oper': 'Opercular',
        'Tri': 'Triangular',
        'Orb': 'Orbital',
        'Acc': 'Accumbens',
        'Thal': 'Thalamus',
        'OFC': 'Orbitofrontal Cortex',
        'ACC': 'Anterior Cingulate',
        'N Acc': 'Nucleus Accumbens',
        'SN pc': 'Substantia Nigra pars compacta',
        'SN pr': 'Substantia Nigra pars reticulata',
        'Red N': 'Red Nucleus',
        'VTA': 'Ventral Tegmental Area',
        'LC': 'Locus Coeruleus',
        'LGN': 'Lateral Geniculate Nucleus',
        'MGN': 'Medial Geniculate Nucleus',
        'AV': 'Anteroventral',
        'LP': 'Lateral Posterior',
        'VA': 'Ventroanterior',
        'VL': 'Ventrolateral',
        'VPL': 'Ventral Posterolateral',
        'IL': 'Intralaminar',
        'Re': 'Reuniens',
        'MDm': 'Mediodorsal medial',
        'MDl': 'Mediodorsal lateral',
        'PuI': 'Pulvinar Inferior',
        'PuM': 'Pulvinar Medial',
        'PuA': 'Pulvinar Anterior',
        'PuL': 'Pulvinar Lateral',
    }

    for abbr, full in abbreviations.items():
        # Match word boundaries
        name = re.sub(rf'\b{abbr}\b', full, name)

    return name + hemisphere_suffix


def compute_centroid(volume: np.ndarray, label_id: int, affine: np.ndarray) -> tuple:
    """
    Compute the centroid of a labeled region in world coordinates.
    Returns (x, y, z) tuple rounded to 1 decimal place.
    """
    # Find all voxels with this label
    coords = np.array(np.where(volume == label_id)).T  # Nx3 array of voxel coordinates

    if len(coords) == 0:
        return None

    # Compute mean voxel coordinate
    centroid_voxel = coords.mean(axis=0)

    # Convert to world coordinates using affine
    centroid_world = nib.affines.apply_affine(affine, centroid_voxel)

    # Round to 1 decimal place
    return tuple(round(x, 1) for x in centroid_world)


def main():
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "tools" / "atlas_data"
    out_dir = root / "src" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    nifti_path = data_dir / "labels.nii.gz"
    labels_path = data_dir / "labels.json"

    if not nifti_path.exists():
        raise FileNotFoundError(f"Missing {nifti_path}")
    if not labels_path.exists():
        raise FileNotFoundError(f"Missing {labels_path}")

    # Load NIfTI
    img = nib.load(str(nifti_path))
    volume = img.get_fdata().astype(np.int32)
    affine = img.affine

    # Load labels
    with open(labels_path) as f:
        labels = json.load(f)

    regions = {}

    for k, meta in labels.items():
        label_id = int(k)
        name = meta.get("name", f"Region_{label_id}")
        parent = meta.get("parent", "Other")

        # Compute centroid
        centroid = compute_centroid(volume, label_id, affine)
        if centroid is None:
            print(f"Warning: No voxels found for {name} (label {label_id})")
            continue

        regions[name] = {
            "id": label_id,
            "displayName": format_display_name(name),
            "hemisphere": determine_hemisphere(name),
            "group": determine_group(parent, name),
            "centroid": list(centroid)
        }

        print(f"Processed {name}: centroid={centroid}")

    # Write output
    out_path = out_dir / "regions.json"
    with open(out_path, 'w') as f:
        json.dump(regions, f, indent=2)

    print(f"\nWrote {len(regions)} regions to {out_path}")


if __name__ == "__main__":
    main()
