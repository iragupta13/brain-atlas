# Brain Atlas

An interactive 3D neuroanatomy explorer for learning how brain regions relate to structure and function.

**[Open the live demo](https://iragupta13.github.io/brain-atlas/)**

## What it does

- Renders an explorable 3D brain with lobe and anatomical-group views
- Switches between camera angles, hemispheres, and levels of detail
- Searches by region or function, including questions such as “memory” and “motor control”
- Connects functional explanations to primary and secondary brain regions
- Highlights individual regions and larger anatomical groups for faster orientation

## Tech stack

- React 19 and TypeScript
- Three.js with React Three Fiber and Drei
- Zustand for application state
- Vite for development and production builds
- MATLAB and Python utilities for atlas-data preparation
- GitHub Actions and GitHub Pages for deployment

## Run locally

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Project status

Active prototype. The core 3D exploration, region browsing, and functional search flows are working. Dataset expansion, accessibility improvements, and mobile refinement remain in progress.

## Why I built it

Static atlases make it difficult to connect anatomical names with spatial relationships and real functions. Brain Atlas turns that material into an interface that can be explored, searched, and understood interactively.
