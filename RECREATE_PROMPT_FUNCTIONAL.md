# Brain Atlas - Functional Recreation Prompt

Build an **Interactive 3D Brain Atlas** web application that allows users to explore a 3D brain model with anatomical regions. The app features hierarchical detail levels, semantic search, and region information panels.

---

## Layout Structure

### Three-Panel Layout
1. **Left Sidebar (fixed width)**: Contains all controls and navigation
2. **Main Canvas (flexible)**: 3D brain model viewer
3. **Right Panel (fixed width, conditional)**: Region info panel - only appears when a region is selected

### Left Sidebar Contents (top to bottom):
1. **Header**: App title with subtitle describing it as a brain explorer
2. **Search Input**: Search bar that supports both region name search and natural language questions
3. **Search Results**: Appears below search when query is entered
4. **View Controls Box**: Single unified box containing:
   - **Camera** controls: 6 preset view buttons (Left, Right, Front, Back, Top, Bottom)
   - **Internal View** controls: 3 buttons (Full Brain, Left Interior, Right Interior)
   - **Detail Level** control: Slider or segmented control with 3 levels (Overview, Lobes, Detailed)
   - **Reset** button at the bottom
5. **Color Legend**: Shows brain region groups with colored indicators (clickable to filter/highlight)
6. **Region Browser**: Expandable/collapsible tree of all regions grouped by anatomical category

---

## 3D Brain Model

### Core Requirements
- Display a 3D brain model with individually selectable anatomical regions
- Each region should be a separate selectable element
- Model should be centered and appropriately scaled

### Camera & Controls
- Orbit controls allowing rotation and zoom
- 6 preset camera positions:
  - Left side view
  - Right side view
  - Front view
  - Back view
  - Top view
  - Bottom view
- Smooth animated transitions between camera positions
- Prevent camera from flipping upside down

### Lighting
- Professional lighting setup that clearly shows brain structure
- Regions should be visually distinguishable
- Selected/hovered regions should be clearly highlighted

### Region Organization
Regions are organized into anatomical groups:
- Frontal Lobe
- Parietal Lobe
- Temporal Lobe
- Occipital Lobe
- Cingulate Cortex
- Insula
- Medial Temporal
- Basal Ganglia
- Thalamus
- Brainstem
- Cerebellum

Each group should have a distinct visual appearance to differentiate it from others.

### Interaction States
- **Normal**: Default appearance based on region's group
- **Hover**: Visual feedback when mouse is over a region
- **Selected**: Clear highlight showing the region is selected
- **Dimmed**: Reduced visibility when filtering by group via the legend

---

## Detail Level System (3 Levels)

### Level 0: Overview (5 Super-Regions)
Groups the anatomical categories into 5 major brain divisions:
- **Frontal Cortex**: Frontal Lobe, Cingulate Cortex, Insula
- **Posterior Cortex**: Parietal Lobe, Occipital Lobe
- **Temporal Cortex**: Temporal Lobe, Medial Temporal
- **Subcortical**: Basal Ganglia, Thalamus, Brainstem
- **Cerebellum**: Cerebellum

Clicking at Level 0 selects all regions in that super-region together.

### Level 1: Lobes (11 Groups)
The standard anatomical groupings. Clicking selects all regions in that lobe/group.

### Level 2: Detailed (Individual Regions)
Each click selects a single brain region.

### Level Switching Behavior
- When changing detail levels, current selection remaps to the equivalent at the new level
- Example: If an individual hippocampus region is selected at Level 2, switching to Level 1 selects the entire Medial Temporal group
- If selection can't be remapped, it clears

### Detail Level Labels
- Level 0: "Overview" - major brain divisions
- Level 1: "Lobes" - anatomical groups
- Level 2: "Detailed" - individual regions

---

## Internal View (Hemisphere Split)

Three modes:
1. **Full**: Shows entire brain (default)
2. **Left Interior**: Hides right hemisphere to reveal deep structures
3. **Right Interior**: Hides left hemisphere to reveal deep structures

When a hemisphere is hidden:
- Regions from that hemisphere become invisible
- Clicks pass through hidden regions to select visible ones
- Midline/bilateral structures remain visible

---

## Search System

### Two Search Modes:

#### 1. Basic Region Search
- Matches region names (partial/fuzzy matching)
- Results show as clickable items with count
- Clicking a result selects that region at the detailed level

#### 2. Semantic/Functional Search
Triggered when query appears to be asking about brain function (contains question words, question marks, or function-related terms).

Shows **function cards** with:
- Function name
- Explanation of what brain areas are involved
- **Primary Regions**: Most important regions for this function (clickable)
- **Secondary Regions**: Supporting regions (clickable, styled differently)

### Brain Functions to Support:

1. **Motor Control** - voluntary movement, coordination
2. **Visual Processing** - sight, image perception
3. **Auditory Processing** - hearing, sound processing
4. **Memory Formation** - learning, recall, episodic memory
5. **Emotion Processing** - feelings, fear, mood regulation
6. **Language Production** - speech, articulation (Broca's area)
7. **Language Comprehension** - understanding speech/text (Wernicke's area)
8. **Decision Making** - executive function, planning, judgment
9. **Balance & Coordination** - posture, equilibrium
10. **Somatosensory Processing** - touch, pain, temperature
11. **Reward & Motivation** - pleasure, dopamine, addiction
12. **Attention** - focus, concentration, alertness
13. **Spatial Awareness** - navigation, spatial relationships
14. **Face Recognition** - identifying faces and expressions
15. **Olfaction** - smell processing
16. **Self-Awareness** - consciousness, introspection
17. **Sleep & Arousal** - sleep-wake cycles, alertness
18. **Movement Regulation** - basal ganglia function, Parkinson's-related
19. **Social Cognition** - empathy, theory of mind
20. **Working Memory** - short-term information holding

Each function should map to relevant primary and secondary brain regions.

---

## Region Info Panel (Right Panel)

Appears when a region/group is selected. Has a header with title and close button.

### For Groups (Level 0 & 1):
- Group name as title
- Metadata tags (level type, region count)
- **Summary** section
- **Function** section
- **Location** section
- **Clinical Significance** section
- **Subdivisions** (for Level 0, shows child groups)
- **Key Regions** (clickable, navigate to individual regions)

### For Individual Regions (Level 2):
- Region name as title (formatted nicely)
- Metadata tags (group name, hemisphere)
- **Summary** section
- **Function** section
- **Location** section
- **Clinical Significance** section
- **Fun Fact** (optional)
- **Key Connections** (clickable links to related regions)

Clicking region buttons navigates to that region.

---

## Color Legend

Shows region groups in a grid with:
- Visual color indicator
- Group name

**Behavior:**
- At Level 0: Shows 5 super-regions
- At Level 1+: Shows 11 anatomical groups
- Clicking an item highlights that group (dims all others)
- Clicking again deselects
- Title changes based on current level

---

## Region Browser

Expandable tree view:
- Groups listed with expand/collapse controls
- Shows region count per group
- Individual regions listed alphabetically within groups
- Clicking a region selects it at detailed level
- Selected region is visually indicated

Group order:
1. Frontal Lobe
2. Parietal Lobe
3. Temporal Lobe
4. Occipital Lobe
5. Medial Temporal
6. Cingulate Cortex
7. Basal Ganglia
8. Thalamus
9. Cerebellum
10. Brainstem

---

## Key Behaviors Summary

1. **Click on brain region** → Selects based on current detail level
2. **Click same region again** → Deselects (toggle)
3. **Hover over region** → Shows hover state
4. **Change detail level** → Remaps selection to new level
5. **Click legend item** → Highlights that group, dims others
6. **Type in search** → Shows region matches or function cards
7. **Click search result** → Selects that region
8. **Select internal view** → Hides opposite hemisphere
9. **Click camera preset** → Animates camera to position
10. **Click Reset** → Returns to default view, clears selection and search

---

## Region Data Requirements

Each region needs:
- Unique identifier
- Display name (human-readable)
- Hemisphere (left, right, or bilateral)
- Group assignment (one of 11 anatomical groups)
- Position in 3D space

For detailed descriptions, regions need:
- Summary text
- Function description
- Location description
- Clinical significance
- Related/connected regions
- Optional fun fact

For group descriptions (Level 0 and 1):
- Summary, function, location, clinical significance
- Child groups (for Level 0)
- Key regions in the group

---

## Design Considerations

- Dark theme appropriate for medical/scientific visualization
- Clear visual hierarchy for text and controls
- Smooth animations and transitions
- Responsive hover and selection states
- Professional, clean aesthetic
- Good contrast for accessibility
- Intuitive iconography for controls

---

This prompt describes the functional requirements for the Brain Atlas application. Visual design, technology choices, and implementation details should be determined independently based on best practices.
