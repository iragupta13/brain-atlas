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
          <div className="sidebar-header">
            <h1>Explore the universe <em>inside your head.</em></h1>
            <p>Navigate the structures, systems, and signals that make you human.</p>
          </div>

          <SearchInput />
          <SearchResults />

          <ViewControls />
          <ColorLegend />
          <RegionBrowser />
        </>
      }
      rightPanel={selection ? <RegionPanel /> : null}
      rightPanelKey={selection ? `${selection.level}:${selection.nodeId}` : null}
    >
      <div className="canvas-container">
        <BrainCanvas />
        <div className="canvas-instructions">Drag to rotate <i /> Scroll to zoom <i /> Select a region</div>
        <div className="brain-stats" aria-label="Brain atlas statistics">
          <span><strong>86B</strong> neurons</span>
          <span><strong>170</strong> mapped regions</span>
          <span><strong>100T</strong> connections</span>
        </div>
      </div>
    </AppLayout>
  );
}
