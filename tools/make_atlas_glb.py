import json
from pathlib import Path

import numpy as np
import nibabel as nib
from skimage.measure import marching_cubes
import trimesh


def load_label_volume(nifti_path: Path):
    img = nib.load(str(nifti_path))
    data = img.get_fdata().astype(np.int32)
    zooms = img.header.get_zooms()[:3]  # voxel size (x,y,z)
    return data, zooms



def load_labels_table(labels_json: Path) -> dict:
    """
    Expected format example:
    {
      "1": {"name": "Frontal_L", "parent": "Lobe_Frontal"},
      "2": {"name": "Frontal_R", "parent": "Lobe_Frontal"},
      ...
    }
    """
    return json.loads(labels_json.read_text())


def mesh_for_label(volume: np.ndarray, label_id: int, spacing=(1.0, 1.0, 1.0)):
    mask = (volume == label_id).astype(np.uint8)
    if mask.sum() < 50:
        return None

    # marching cubes expects a 3D scalar field; we use the mask
    verts, faces, _, _ = marching_cubes(mask, level=0.5, spacing=spacing)

    m = trimesh.Trimesh(vertices=verts, faces=faces, process=False)
    # Smooth the blocky voxel surface
    try:
        trimesh.smoothing.filter_laplacian(m, lamb=0.4, iterations=10)
    except Exception:
        pass

    # --- Remove tiny disconnected "islands" (floating fragments) ---
    try:
        parts = m.split(only_watertight=False)
        if len(parts) > 1:
            # keep the biggest piece by surface area
            parts = sorted(parts, key=lambda p: p.area, reverse=True)
            m = parts[0]
    except Exception:
        pass

    # Remove skinny / spiky artifacts by a light remesh-ish cleanup
    try:
        m.remove_degenerate_faces()
        m.remove_unreferenced_vertices()
        m.merge_vertices()
    except Exception:
        pass

    # A little more smoothing (gentle) to knock down spikes
    try:
        trimesh.smoothing.filter_laplacian(m, lamb=0.35, iterations=8)
    except Exception:
        pass


    # Drop extremely tiny regions that are basically noise
    if m.area < 50:
        return None


    # clean (method names vary across trimesh versions)
    try:
        m.merge_vertices()
    except Exception:
        pass

    try:
        m.remove_degenerate_faces()
    except Exception:
        pass

    try:
        m.remove_unreferenced_vertices()
    except Exception:
        pass

    try:
        m.process(validate=True)
    except Exception:
        pass


    # simplify aggressively for web (adjust later)
    target_faces = max(5000, min(len(m.faces), 40000))
    try:
        m = m.simplify_quadratic_decimation(target_faces)
    except Exception:
        pass

    # FINAL cleanup: after smoothing/decimation, shards can re-appear.
    try:
        parts = m.split(only_watertight=False)
        if len(parts) > 1:
            parts = sorted(parts, key=lambda p: p.area, reverse=True)
            main = parts[0]
            # If second piece is tiny relative to main, discard it by keeping only main
            m = main
    except Exception:
        pass

    # Safety: drop microscopic junk
    try:
        if m.area < 200:
            return None
    except Exception:
        pass


    return m


def main():
    root = Path(__file__).resolve().parents[1]
    data_dir = root / "tools" / "atlas_data"
    out_dir = root / "public" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)

    nifti_path = data_dir / "labels.nii.gz"
    labels_path = data_dir / "labels.json"

    if not nifti_path.exists():
        raise FileNotFoundError(f"Missing {nifti_path}")
    if not labels_path.exists():
        raise FileNotFoundError(f"Missing {labels_path}")

    volume, zooms = load_label_volume(nifti_path)
    labels = load_labels_table(labels_path)

    scene = trimesh.Scene()

    for k, meta in labels.items():
        label_id = int(k)
        name = meta.get("name", f"Region_{label_id}")

        m = mesh_for_label(volume, label_id, spacing=zooms)
        if m is None:
            continue

        # give each mesh a name (crucial for clicking in the app)
        m.metadata["name"] = name
        m.visual = trimesh.visual.ColorVisuals(mesh=m, vertex_colors=[180, 180, 180, 255])

        scene.add_geometry(m, node_name=name, geom_name=name)

        print(f"Meshed {label_id}: {name} (faces={len(m.faces)})")

    glb_path = out_dir / "brain_atlas.glb"
    export = scene.export(file_type="glb")
    glb_path.write_bytes(export)

    print(f"\nWrote: {glb_path}")


if __name__ == "__main__":
    main()
