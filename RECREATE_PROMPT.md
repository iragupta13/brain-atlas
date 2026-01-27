# Brain Atlas - Complete Recreation Prompt

Build an **Interactive 3D Brain Atlas** web application that allows users to explore a 3D brain model with ~170 anatomical regions. The app features hierarchical detail levels, semantic search, region information panels, and cinematic visual design.

---

## Layout Structure

### Three-Column Layout
1. **Left Sidebar (320px fixed)**: Contains all controls and navigation
2. **Main Canvas (flexible)**: 3D brain model viewer
3. **Right Panel (400px, conditional)**: Region info panel - only appears when a region is selected

### Left Sidebar Contents (top to bottom):
1. **Header**: "Brain Atlas" title with subtitle "Interactive 3D neuroanatomy explorer"
2. **Search Input**: Search bar with placeholder "Search regions or ask a question... (try 'memory' or 'motor control')"
3. **Search Results**: Appears below search when query is entered
4. **View Controls Box**: Single unified box containing:
   - Section title: "View"
   - **Camera** label with 6 preset buttons in a row: Left (←), Right (→), Front (◎), Back (○), Top (↑), Bottom (↓)
   - **Internal View** label with 3 buttons: Full, Left Interior, Right Interior
   - **Detail Level** label with slider (0-2) and 3 clickable labels: Overview, Lobes, Detailed
   - Description text below slider showing current level info
   - **Reset All** button at the very bottom of the box
5. **Color Legend**: Shows brain region groups with colored swatches (clickable to highlight that group)
6. **Region Browser**: Expandable/collapsible tree of all regions grouped by lobe

---

## 3D Brain Model

### Model Requirements
- Use a GLB/GLTF brain model with ~170 individual mesh regions
- Each mesh is named (e.g., "Precentral_L", "Hippocampus_R")
- Model is centered and scaled appropriately

### Camera & Controls
- Orbit controls with damping enabled
- 6 preset camera positions with smooth animated transitions:
  - lateral-left: View from left side
  - lateral-right: View from right side
  - anterior: View from front
  - posterior: View from back
  - superior: View from top
  - inferior: View from bottom
- Constrained polar angle to prevent camera flipping
- Panning disabled, only rotate and zoom

### Lighting Setup (Cinematic)
- Ambient light (soft, slightly blue-gray)
- Key light: Upper front right, brightest, white
- Fill light: Lower left, softer, slightly purple-tinted
- Bottom fill: Illuminates underside of brain
- Rim light: Subtle glow from behind, blue-tinted
- Hemisphere light for balanced ambient fill
- Deep void background color (#030508) with distance fog

### Region Coloring
Each brain region belongs to one of 11 anatomical groups, each with a distinct soft color:
- Frontal Lobe: #89b4d4 (soft blue)
- Parietal Lobe: #8cc084 (soft green)
- Temporal Lobe: #d4a574 (soft orange/tan)
- Occipital Lobe: #a88bc4 (soft purple)
- Cingulate Cortex: #d4868c (soft rose)
- Insula: #7cb4a8 (soft sage)
- Medial Temporal: #d4b08c (soft peach)
- Basal Ganglia: #c4a864 (soft gold)
- Thalamus: #c4a484 (soft tan)
- Brainstem: #a4a0c4 (soft lavender)
- Cerebellum: #74b4ac (soft teal)

### Interaction States
- **Normal**: Region's group color
- **Hover**: Cyan highlight (#00c4d4), cursor becomes pointer
- **Selected**: Bright cyan (#00f0ff)
- **Dimmed**: 15% opacity when another group is highlighted via the legend

---

## Detail Level System (3 Levels)

### Level 0: Overview (5 Super-Regions)
Groups the 11 lobes into 5 major brain divisions:
- **Frontal Cortex**: Contains Frontal Lobe, Cingulate Cortex, Insula
- **Posterior Cortex**: Contains Parietal Lobe, Occipital Lobe
- **Temporal Cortex**: Contains Temporal Lobe, Medial Temporal
- **Subcortical**: Contains Basal Ganglia, Thalamus, Brainstem
- **Cerebellum**: Contains Cerebellum

Super-region colors at Level 0:
- Frontal Cortex: #89b4d4
- Posterior Cortex: #a88bc4
- Temporal Cortex: #d4a574
- Subcortical: #c4a864
- Cerebellum: #74b4ac

When clicking at Level 0, all regions in the super-region highlight together.

### Level 1: Lobes (11 Groups)
The standard anatomical groupings listed above. Clicking highlights all regions in that lobe.

### Level 2: Detailed (170 Individual Regions)
Each click selects a single brain region mesh.

### Level Switching Behavior
- When changing detail levels, current selection is remapped to the equivalent at the new level
- Example: If "Hippocampus_L" is selected at Level 2, switching to Level 1 automatically selects "Medial_Temporal" group
- If selection can't be remapped, it's cleared

### Detail Level Labels
- Level 0: "Overview" - "5 major brain divisions"
- Level 1: "Lobes" - "11 anatomical groups"
- Level 2: "Detailed" - "170 individual regions"

---

## Internal View (Hemisphere Split)

Three modes:
1. **Full**: Shows entire brain (default)
2. **Left Interior**: Hides right hemisphere meshes to reveal deep structures on the left
3. **Right Interior**: Hides left hemisphere meshes to reveal deep structures on the right

When a hemisphere is hidden:
- Meshes from that hemisphere become completely invisible
- Clicks pass through hidden meshes to select visible ones behind them
- Bilateral structures (midline) remain visible

Hemisphere is determined by mesh name suffix (_L = left, _R = right) or region metadata.

---

## Search System

### Two Search Modes:

#### 1. Basic Region Search
- Matches region names fuzzy/partial (e.g., "hippo" finds "Hippocampus_L" and "Hippocampus_R")
- Results show as a list of clickable buttons with region count
- Clicking a result selects that region at Detail Level 2

#### 2. Semantic/Functional Search
Triggered when query contains:
- Question words (what, which, where, how, why)
- Question mark (?)
- Function-related keywords (memory, vision, motor, emotion, etc.)

Semantic search shows **function cards** with:
- Function name (e.g., "Memory Formation")
- Explanation paragraph
- **Primary Regions** section with clickable region buttons
- **Secondary Regions** section with clickable region buttons (styled differently)

### Brain Functions Database (20 functions):

1. **Motor Control**
   - Keywords: movement, motor, muscle, walking, running, motion, voluntary, coordination
   - Primary: Precentral_L/R, Supp_Motor_Area_L/R
   - Secondary: Paracentral_Lobule, Putamen, Cerebellum_4_5

2. **Visual Processing**
   - Keywords: vision, visual, sight, see, eyes, look, image, perception
   - Primary: Calcarine_L/R, Cuneus_L/R
   - Secondary: Occipital_Sup/Mid/Inf, Lingual, Thal_LGN

3. **Auditory Processing**
   - Keywords: hearing, auditory, sound, listen, audio, ear, music, speech
   - Primary: Heschl_L/R, Temporal_Sup_L/R
   - Secondary: Thal_MGN, Temporal_Mid

4. **Memory Formation**
   - Keywords: memory, remember, memorize, recall, learning, learn, forget, hippocampus
   - Primary: Hippocampus_L/R
   - Secondary: ParaHippocampal, Temporal_Mid, Thal_AV

5. **Emotion Processing**
   - Keywords: emotion, emotional, feeling, fear, anxiety, happy, sad, mood, stress
   - Primary: Amygdala_L/R, Insula_L/R
   - Secondary: ACC_sub, ACC_pre, OFCmed

6. **Language Production (Broca's Area)**
   - Keywords: broca, speech, speaking, talk, articulation, grammar, verbal
   - Primary: Frontal_Inf_Oper_L, Frontal_Inf_Tri_L
   - Secondary: Rolandic_Oper, Supp_Motor_Area_L

7. **Language Comprehension (Wernicke's Area)**
   - Keywords: wernicke, comprehension, understand, language, semantic, meaning, read, words
   - Primary: Temporal_Sup_L/R, Angular_L/R
   - Secondary: Temporal_Mid, SupraMarginal

8. **Decision Making**
   - Keywords: decision, decide, executive, planning, judgment, choice, choose, prefrontal, think
   - Primary: Frontal_Sup_2_L/R, Frontal_Mid_2_L/R
   - Secondary: Frontal_Sup_Medial, ACC_sup, OFClat

9. **Balance & Coordination**
   - Keywords: balance, coordination, equilibrium, posture, vestibular, stability, gait
   - Primary: Vermis_1_2, Vermis_3, Vermis_4_5, Vermis_6
   - Secondary: Cerebellum_3, Cerebellum_4_5, Cerebellum_6

10. **Somatosensory Processing**
    - Keywords: touch, sensory, sensation, feel, pain, temperature, pressure, skin, tactile
    - Primary: Postcentral_L/R
    - Secondary: Parietal_Sup, Parietal_Inf, Thal_VPL

11. **Reward & Motivation**
    - Keywords: reward, pleasure, motivation, dopamine, addiction, craving, desire, satisfaction
    - Primary: N_Acc_L/R, VTA_L/R
    - Secondary: OFCmed, ACC_pre, Caudate

12. **Attention**
    - Keywords: attention, focus, concentrate, alert, vigilance, awareness
    - Primary: Parietal_Sup_L/R, Frontal_Mid_2_L/R
    - Secondary: ACC_sup, Frontal_Sup_2, Thal_PuA

13. **Spatial Awareness**
    - Keywords: spatial, space, navigation, navigate, location, direction, position, map, orient
    - Primary: Parietal_Sup_L/R, Precuneus_L/R
    - Secondary: Parietal_Inf, ParaHippocampal, Hippocampus

14. **Face Recognition**
    - Keywords: face, faces, facial, recognition, recognize, identity, expression
    - Primary: Fusiform_L/R
    - Secondary: Temporal_Inf, Amygdala, Occipital_Inf

15. **Olfaction (Smell)**
    - Keywords: smell, olfactory, odor, scent, nose, aroma
    - Primary: Olfactory_L/R
    - Secondary: Amygdala, ParaHippocampal, OFCpost

16. **Self-Awareness**
    - Keywords: self, awareness, conscious, consciousness, introspection, reflection, identity
    - Primary: Frontal_Sup_Medial_L/R, Precuneus_L/R
    - Secondary: Cingulate_Post, Angular, Insula

17. **Sleep & Arousal**
    - Keywords: sleep, wake, awake, arousal, drowsy, tired, alert, circadian, rest
    - Primary: Thal_IL_L/R, LC_L/R
    - Secondary: Raphe_D, Raphe_M, Thal_Re

18. **Movement Regulation (Basal Ganglia)**
    - Keywords: parkinson, tremor, dyskinesia, basal, ganglia, rigidity, bradykinesia
    - Primary: Putamen_L/R, Caudate_L/R, Pallidum_L/R
    - Secondary: SN_pc, SN_pr, Thal_VA, Thal_VL

19. **Social Cognition**
    - Keywords: social, empathy, theory of mind, mentalizing, perspective, compassion
    - Primary: Temporal_Pole_Sup_L/R, Frontal_Sup_Medial_L/R
    - Secondary: Temporal_Pole_Mid, Angular, ACC_pre

20. **Working Memory**
    - Keywords: working memory, short-term, temporary, hold, manipulate, buffer
    - Primary: Frontal_Mid_2_L/R, Parietal_Inf_L/R
    - Secondary: Frontal_Sup_2, Parietal_Sup, Thal_MDl

---

## Region Info Panel (Right Panel)

Appears when a region/group is selected. Has a header with "Region Info" title and close button (×).

### For Level 0 & 1 (Groups):
- Group name as title
- Tags showing: level type (Super-Region or Lobe/Group), region count (e.g., "42 regions")
- **Summary** section
- **Function** section
- **Location** section
- **Clinical Significance** section
- **Subdivisions** section (for Level 0, shows child groups as chips)
- **Key Regions** section (clickable buttons that navigate to those regions at Level 2)

### For Level 2 (Individual Regions):
- Region name as formatted title (e.g., "Hippocampus (Left)" instead of "Hippocampus_L")
- Tags showing: group name (e.g., "Medial Temporal"), hemisphere (left/right/bilateral)
- **Summary** section
- **Function** section
- **Location** section
- **Clinical Significance** section
- **Fun Fact** section (optional, not all regions have this)
- **Key Connections** section (clickable buttons to related regions)

Clicking a region button in Key Regions or Key Connections selects that region.

---

## Color Legend

Shows region groups in a 2-column grid with:
- Colored square swatch (10x10px, rounded corners)
- Group name

**Behavior:**
- At Level 0: Shows 5 super-regions with title "Super-Regions"
- At Level 1+: Shows 11 lobe groups with title "Brain Regions"
- Hint text: "Click to highlight group"
- Clicking a legend item highlights that group (all other regions dim to 15% opacity)
- Clicking the same item again deselects (returns to normal)
- Non-active items appear slightly dimmed when one is selected

---

## Region Browser

Expandable tree view at the bottom of the sidebar:
- Title: "Browse by Region"
- Groups listed with expand/collapse arrow (▶/▼)
- Shows region count per group in parentheses
- Individual regions listed alphabetically within expanded groups
- Clicking a region selects it at Level 2
- Selected region button is visually highlighted

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

## Visual Design System

### Color Palette
```
/* Deep dark palette */
--bg-void: #030508
--bg-deep: #080b10
--bg-surface: #0d1117
--bg-elevated: #151b24
--bg-card: #1a222d

/* Bioluminescent accents */
--glow-cyan: #00f0ff
--glow-cyan-dim: #00c4d4
--glow-cyan-muted: rgba(0, 240, 255, 0.15)
--glow-purple: #a855f7
--glow-purple-muted: rgba(168, 85, 247, 0.1)

/* Text hierarchy */
--text-primary: #f0f6fc
--text-secondary: #8b949e
--text-tertiary: #6e7681
--text-muted: #484f58

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.06)
--border-default: rgba(255, 255, 255, 0.1)
--border-glow: rgba(0, 240, 255, 0.3)
```

### Typography
- Primary font: 'Outfit' (Google Fonts) - used for body text, buttons, labels
- Display font: 'Syne' (Google Fonts) - used for main title and section headers
- Weights: 300-700 for Outfit, 400-800 for Syne

### UI Elements
- Rounded corners: 6px for small elements, 10-12px for cards/panels
- Subtle borders with low opacity whites
- Glassmorphism effects: backdrop-filter blur (20px) on sidebar and right panel
- Gradient backgrounds on containers (subtle, dark to darker)
- Cyan glow effects on active/selected states (box-shadow with glow-cyan)
- Smooth transitions using cubic-bezier(0.16, 1, 0.3, 1) easing

### Background Effects
- Subtle radial gradient overlays (cyan at 20% 40%, purple at 80% 60%, very low opacity ~3-4%)
- Noise texture overlay using SVG filter (fractalNoise, ~1.5% opacity)
- Thin custom scrollbars (6px, dark track, subtle thumb that glows cyan on hover)

### Panel Styling
- Sidebar and right panel have subtle inner glow lines along their borders
- Right panel animates in from the right when appearing
- Cards have subtle gradient backgrounds

---

## Key Behaviors Summary

1. **Click on brain region** → Selects it based on current detail level (highlights all meshes in that node)
2. **Click same region again** → Deselects (toggle behavior)
3. **Hover over region** → Shows hover highlight on all meshes in that node at current level, cursor becomes pointer
4. **Change detail level** → Remaps current selection to equivalent at new level, colors update
5. **Click legend item** → Dims all other groups to 15% opacity, click again to clear
6. **Type in search** → Debounced (~150ms), shows region matches or semantic function cards
7. **Click search result** → Selects region at Level 2
8. **Select internal view** → Immediately hides opposite hemisphere meshes
9. **Click camera preset** → Smoothly animates camera to that position
10. **Click Reset All** → Returns camera to default (lateral-left), resets hemisphere to Full, clears selection, clears search

---

## Region Data Structure

Each of the ~170 regions has:
- **id**: Numeric identifier
- **meshName**: Name matching the 3D model mesh (e.g., "Hippocampus_L")
- **displayName**: Formatted name (e.g., "Hippocampus (Left)")
- **hemisphere**: "left", "right", or "bilateral"
- **group**: One of the 11 lobe groups
- **centroid**: [x, y, z] coordinates in model space

For detailed descriptions (Level 2), regions have:
- **summary**: 1-2 sentence overview
- **function**: What the region does
- **location**: Where it is in the brain
- **clinical**: What happens when damaged
- **connections**: Array of related region mesh names
- **funFact**: Optional interesting fact

For group descriptions (Level 0 and 1):
- **summary**, **function**, **location**, **clinical** (same as above)
- **childGroups**: For Level 0, list of Level 1 groups contained
- **keyRegions**: Array of important region mesh names in this group

---

This prompt provides all the specifications needed to recreate the Brain Atlas application with identical functionality and appearance. The implementation approach, architecture, and specific technologies are left to be determined independently.
