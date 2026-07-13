import { AppLayout } from './components/layout';
import { BrainCanvas } from './components/brain';
import { SearchInput, SearchResults } from './components/search';
import { RegionPanel } from './components/region-info';
import { ViewControls, RegionBrowser, ColorLegend } from './components/ui';
import { useBrainStore } from './stores/useBrainStore';
import './index.css';

export default function App() {
  const selection = useBrainStore((s) => s.selection);
  const detailLevel = useBrainStore((s) => s.detailLevel);
  const setDetailLevel = useBrainStore((s) => s.setDetailLevel);
  const resetView = useBrainStore((s) => s.resetView);

  return (
    <AppLayout
      header={
        <header className="cosmic-header">
          <button className="nexus-brand" onClick={resetView} aria-label="Reset brain atlas view">
            <span className="nexus-mark" aria-hidden="true"><i /><b /></span>
            <span><strong>NEXUS</strong><small>/ HUMAN BRAIN ATLAS</small></span>
          </button>

          <nav className="atlas-levels" aria-label="Atlas detail level">
            {([
              [0, 'Overview'],
              [1, 'Lobes'],
              [2, 'Detailed'],
            ] as const).map(([level, label]) => (
              <button
                key={level}
                className={detailLevel === level ? 'active' : ''}
                onClick={() => setDetailLevel(level)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="model-status"><i /><span>Live model</span><small>170 regions</small></div>
        </header>
      }
      sidebar={
        <>
          <div className="sidebar-header">
            <span className="sidebar-eyebrow">Interactive neural map · 01</span>
            <h1>Explore the universe <em>inside your head.</em></h1>
            <p>Navigate the structures, systems, and signals that make you human.</p>
          </div>

          <SearchInput />
          <SearchResults />

          <div className="cosmic-note">
            <span>NEURAL COSMOS</span>
            <p>Neural networks and cosmic filaments can look strikingly alike. Explore the pattern—then learn where the science differs.</p>
          </div>

          <ViewControls />
          <ColorLegend />
          <RegionBrowser />
        </>
      }
      rightPanel={selection ? <RegionPanel /> : null}
      rightPanelKey={selection ? `${selection.level}:${selection.nodeId}` : null}
    >
      <div className="canvas-container">
        <div className="canvas-kicker"><i /> HUMAN NEURAL CARTOGRAPHY</div>
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
