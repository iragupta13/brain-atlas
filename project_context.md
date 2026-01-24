Brain Atlas – Interactive 3D Brain Learning App
Overview

Brain Atlas is a web-based interactive neuroscience learning tool that visualizes human brain structures in 3D and allows users to explore anatomical regions and their functions. The project is designed both as a learning platform for neuroscience and as a beginner-friendly, end-to-end exercise in modern web development, 3D graphics, and AI-assisted content generation.

The long-term goal is to provide:

A rotatable, clickable 3D brain

Fine-grained anatomical regions (lobes → subregions → nuclei)

AI-generated functional descriptions for each structure

Future quiz/testing modes to reinforce learning

Core Features (Current State)
1. Interactive 3D Brain Visualization

Rendered in the browser using React + Three.js (@react-three/fiber, @react-three/drei)

Fully rotatable and zoomable brain model

Clickable regions highlight on selection

Selected region name displayed in the UI

2. High-Resolution Anatomical Parcellation

Based on AAL3 (Automated Anatomical Labeling v3) atlas

~166 labeled brain regions including:

Cortical lobes and subregions

Subcortical structures

Cerebellar subdivisions

Brainstem and nuclei

Atlas originally provided as volumetric NIfTI data and converted into 3D meshes

3. Custom Atlas → GLB Conversion Pipeline

A custom Python toolchain converts scientific neuroimaging data into a web-ready 3D model:

Pipeline:

Input: AAL3 NIfTI (.nii/.nii.gz) + XML label metadata

Voxel → Mesh: Marching cubes per label (using nibabel, scikit-image)

Mesh Cleaning:

Remove degenerate faces and unreferenced vertices

Merge duplicate vertices

Keep only the largest connected component per region

Drop microscopic/noise meshes by surface-area threshold

Smoothing & Simplification:

Gentle Laplacian smoothing

Face-count limits to reduce artifacts

Export:

Combined multi-mesh GLB (brain_atlas.glb)

Region metadata JSON (labels.json)

Output location:

public/models/brain_atlas.glb
tools/atlas_data/labels.json

Frontend Architecture
Tech Stack

Vite + React + TypeScript

Three.js via @react-three/fiber

OrbitControls for camera interaction

Key UX Fixes Implemented

Model auto-centered using bounding box calculation

OrbitControls target aligned to brain center (natural rotation)

Pan disabled, polar angle clamped (prevents flipping)

Camera defaults tuned for anatomical inspection

Floating mesh artifacts eliminated via export-side cleanup

AI Integration (Planned / In Progress)

Functional descriptions for each brain region will be generated dynamically by an AI model, rather than hardcoded or copied from external sources

The atlas provides structure names + hierarchy; AI provides:

Behavioral relevance

Cognitive and clinical associations

Plain-language explanations

Future integration via OpenAI API (or equivalent), cached per region

Educational Intent

This project intentionally spans:

Neuroscience (human brain anatomy & function)

Scientific data processing (neuroimaging → meshes)

3D graphics (mesh cleanup, camera control, interaction)

Modern web development (React, TypeScript, Vite)

AI-assisted knowledge generation

It is designed to be:

Expandable (quizzes, annotations, comparisons)

Open-ended (new atlases, multiple resolutions)

Beginner-friendly but technically rigorous

Current Status

✅ AAL3 atlas converted and rendered successfully

✅ 3D interaction stable and intuitive

✅ Region selection and highlighting working

🔜 AI-generated functional descriptions

🔜 Structured learning modes (testing, guided exploration)

File Structure (Key Parts)
brain-atlas/
├─ public/
│  └─ models/
│     └─ brain_atlas.glb
├─ src/
│  ├─ BrainScene.tsx
│  ├─ Layout.tsx
│  ├─ App.tsx
│  └─ main.tsx
├─ tools/
│  ├─ make_atlas_glb.py
│  ├─ convert_aal_xml.py
│  └─ atlas_data/
│     └─ labels.json

Summary

Brain Atlas is a custom-built, AI-augmented, interactive 3D human brain atlas that bridges neuroscience education and modern web/graphics development. It transforms research-grade anatomical data into an intuitive exploratory tool, with AI poised to handle interpretation and explanation rather than static descriptions.