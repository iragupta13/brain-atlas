#!/usr/bin/env python3
"""
Generate AI-powered descriptions for brain regions using Claude API.
This script creates detailed educational descriptions for each region.

Usage:
    export ANTHROPIC_API_KEY="your-key-here"
    python tools/generate_descriptions.py

Note: This is expensive to run for all regions. Consider running in batches.
"""

import json
import os
from pathlib import Path
import time

try:
    import anthropic
except ImportError:
    print("Please install anthropic: pip install anthropic")
    exit(1)


PROMPT_TEMPLATE = """You are a neuroscience educator creating content for an interactive 3D brain atlas for students and curious adults.

Generate a detailed but accessible description for the brain region: {region_name}

The description should include:
1. **summary**: A single sentence (15-25 words) describing the region's main role
2. **function**: 2-3 sentences explaining what this region does in detail
3. **location**: 1-2 sentences describing where in the brain this is located
4. **connections**: A list of 3-5 other brain region names (from the AAL3 atlas) that this region strongly connects to
5. **clinical**: 1-2 sentences about what happens when this region is damaged or dysfunctions
6. **funFact**: One interesting or surprising fact about this region (optional but encouraged)

Guidelines:
- Use plain language, avoiding excessive jargon
- Be accurate - this is for education
- Be engaging - include interesting details
- For the connections field, use AAL3 naming convention (e.g., "Hippocampus_L", "Amygdala_R")

Return ONLY valid JSON in this exact format:
{{
  "summary": "...",
  "function": "...",
  "location": "...",
  "connections": ["Region1", "Region2", "Region3"],
  "clinical": "...",
  "funFact": "..."
}}"""


def load_regions():
    """Load regions from regions.json"""
    root = Path(__file__).resolve().parents[1]
    regions_path = root / "src" / "data" / "regions.json"

    with open(regions_path) as f:
        return json.load(f)


def generate_description(client, region_name: str, region_data: dict) -> dict:
    """Generate description for a single region using Claude API."""

    display_name = region_data.get("displayName", region_name)
    group = region_data.get("group", "Unknown")
    hemisphere = region_data.get("hemisphere", "unknown")

    context = f"{display_name} (group: {group}, hemisphere: {hemisphere})"

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": PROMPT_TEMPLATE.format(region_name=context)}
        ]
    )

    # Extract JSON from response
    response_text = message.content[0].text.strip()

    # Handle potential markdown code blocks
    if response_text.startswith("```"):
        lines = response_text.split("\n")
        response_text = "\n".join(lines[1:-1])

    return json.loads(response_text)


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    regions = load_regions()

    root = Path(__file__).resolve().parents[1]
    output_path = root / "src" / "data" / "descriptions.json"

    # Load existing descriptions if any
    existing = {}
    if output_path.exists():
        with open(output_path) as f:
            existing = json.load(f)
        print(f"Loaded {len(existing)} existing descriptions")

    # Generate descriptions for regions without them
    total = len(regions)
    generated = 0

    for i, (name, data) in enumerate(regions.items()):
        if name in existing:
            print(f"[{i+1}/{total}] Skipping {name} (already exists)")
            continue

        print(f"[{i+1}/{total}] Generating description for {name}...")

        try:
            description = generate_description(client, name, data)
            existing[name] = description
            generated += 1

            # Save after each generation to preserve progress
            with open(output_path, 'w') as f:
                json.dump(existing, f, indent=2)

            # Rate limiting
            time.sleep(0.5)

        except Exception as e:
            print(f"  Error: {e}")
            continue

    print(f"\nDone! Generated {generated} new descriptions.")
    print(f"Total descriptions: {len(existing)}/{total}")


if __name__ == "__main__":
    main()
