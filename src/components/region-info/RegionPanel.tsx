import { useBrainStore } from '../../stores/useBrainStore';
import { formatRegionName } from '../../utils/formatRegionName';
import regionsData from '../../data/regions.json';
import descriptionsData from '../../data/descriptions.json';
import styles from './RegionPanel.module.css';

const regions = regionsData as Record<string, { group: string; hemisphere: string }>;
const descriptions = descriptionsData as Record<string, {
  summary: string;
  function: string;
  location: string;
  connections: string[];
  clinical: string;
  funFact?: string;
}>;

export function RegionPanel() {
  const { selectedRegion, setSelectedRegion } = useBrainStore();

  if (!selectedRegion) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🧠</div>
        <p>Click on a brain region to learn about it</p>
        <p className={styles.hint}>Or use the search above to find specific regions</p>
      </div>
    );
  }

  const region = regions[selectedRegion];
  const description = descriptions[selectedRegion];

  return (
    <div className={styles.container}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Region Info</h2>
        <button
          className={styles.closeButton}
          onClick={() => setSelectedRegion(null)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className={styles.regionHeader}>
        <h3 className={styles.title}>{formatRegionName(selectedRegion)}</h3>
      </div>

      {region && (
        <div className={styles.tags}>
          <span className={styles.tag}>{region.group.replace(/_/g, ' ')}</span>
          <span className={styles.tag}>{region.hemisphere}</span>
        </div>
      )}

      {description ? (
        <div className={styles.content}>
          <Section title="Summary" icon="📋">
            {description.summary}
          </Section>

          <Section title="Function" icon="⚡">
            {description.function}
          </Section>

          <Section title="Location" icon="📍">
            {description.location}
          </Section>

          <Section title="Clinical Significance" icon="🏥">
            {description.clinical}
          </Section>

          {description.funFact && (
            <Section title="Fun Fact" icon="💡">
              {description.funFact}
            </Section>
          )}

          {description.connections && description.connections.length > 0 && (
            <Section title="Key Connections" icon="🔗">
              <div className={styles.connectionsList}>
                {description.connections.map((conn) => (
                  <button
                    key={conn}
                    className={styles.connectionChip}
                    onClick={() => setSelectedRegion(conn)}
                  >
                    {formatRegionName(conn)}
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>
      ) : (
        <div className={styles.noDescription}>
          <p>Detailed description not yet available for this region.</p>
          <p className={styles.hint}>
            This is the <strong>{formatRegionName(selectedRegion)}</strong> region.
          </p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>{icon}</span>
        {title}
      </h4>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
}
