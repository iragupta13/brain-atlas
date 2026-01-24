import json
import xml.etree.ElementTree as ET
from pathlib import Path


def main():
    root_dir = Path(__file__).resolve().parents[1]
    data_dir = root_dir / "tools" / "atlas_data"

    xml_path = data_dir / "labels.xml"
    out_path = data_dir / "labels.json"

    if not xml_path.exists():
        raise FileNotFoundError(f"Missing {xml_path}")

    tree = ET.parse(xml_path)
    root = tree.getroot()

    labels = {}

    # AAL XML structure: <label><index>...</index><name>...</name></label>
    for label in root.iter("label"):
        idx = label.findtext("index")
        name = label.findtext("name")

        if idx is None or name is None:
            continue

        labels[idx] = {
            "name": name,
            "parent": infer_parent(name),
        }

    out_path.write_text(json.dumps(labels, indent=2))
    print(f"Wrote {out_path} ({len(labels)} regions)")


def infer_parent(name: str) -> str:
    """
    Simple heuristic grouping.
    We'll improve this later, but this gives us lobes + systems immediately.
    """
    n = name.lower()

    if any(k in n for k in ["frontal"]):
        return "Frontal_Lobe"
    if any(k in n for k in ["parietal"]):
        return "Parietal_Lobe"
    if any(k in n for k in ["temporal"]):
        return "Temporal_Lobe"
    if any(k in n for k in ["occipital"]):
        return "Occipital_Lobe"
    if any(k in n for k in ["cingulate"]):
        return "Cingulate_Cortex"
    if any(k in n for k in ["hippocamp", "amygdala"]):
        return "Medial_Temporal"
    if any(k in n for k in ["thalam"]):
        return "Thalamus"
    if any(k in n for k in ["caudate", "putamen", "pallidum"]):
        return "Basal_Ganglia"
    if any(k in n for k in ["brainstem", "pons", "medulla", "midbrain"]):
        return "Brainstem"
    if any(k in n for k in ["cerebell"]):
        return "Cerebellum"

    return "Other"


if __name__ == "__main__":
    main()
