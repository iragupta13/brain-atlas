import { AppLayout } from './components/layout';
import { BrainCanvas } from './components/brain';
import { SearchInput, SearchResults } from './components/search';
import { RegionPanel } from './components/region-info';
import { ViewControls, RegionBrowser, ColorLegend } from './components/ui';
import { useBrainStore } from './stores/useBrainStore';
import './index.css';

export default function App() {
  const selection = useBrainStore((s) => s.selection);

  return (
    <AppLayout
      sidebar={
        <>
          {/* Header */}
          <div className="sidebar-header">
            <h1>Brain Atlas</h1>
            <p>Interactive 3D neuroanatomy explorer</p>
          </div>

          {/* Search */}
          <SearchInput />
          <SearchResults />

          {/* View Controls (Camera, Internal View, Detail Level, Reset) */}
          <ViewControls />

          {/* Color Legend */}
          <ColorLegend />

          {/* Region Browser */}
          <RegionBrowser />
        </>
      }
      rightPanel={selection ? <RegionPanel /> : null}
    >
      {/* 3D Canvas */}
      <div className="canvas-container">
        <BrainCanvas />
      </div>
    </AppLayout>
  );
}
