import { useBrainStore } from '../../stores/useBrainStore';
import { formatRegionName } from '../../utils/formatRegionName';
import { getNodeDisplayName, getRegionCount } from '../../utils/hierarchy';
import regionsData from '../../data/regions.json';
import descriptionsData from '../../data/descriptions.json';
import hierarchyDescriptions from '../../data/hierarchyDescriptions.json';
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

type HierarchyDescription = {
  summary: string;
  function: string;
  location: string;
  clinical: string;
  childGroups?: string[];
  keyRegions?: string[];
};

const level0Descriptions = hierarchyDescriptions.level0 as Record<string, HierarchyDescription>;
const level1Descriptions = hierarchyDescriptions.level1 as Record<string, HierarchyDescription>;

export function RegionPanel() {
  const { selection, selectNode, clearSelection } = useBrainStore();

  if (!selection) {
    return (
      <div className={styles.empty}>
        <p>Click on a brain region to learn about it</p>
        <p className={styles.hint}>Or use the search above to find specific regions</p>
      </div>
    );
  }

  const { nodeId, level } = selection;
  const regionCount = getRegionCount(nodeId, level);
  const displayName = getNodeDisplayName(nodeId, level);

  // Get appropriate description based on level
  const getDescription = () => {
    if (level === 0) return level0Descriptions[nodeId];
    if (level === 1) return level1Descriptions[nodeId];
    // Level 2 (Detailed): use individual region descriptions
    return descriptions[nodeId];
  };

  const description = getDescription();

  // Get tags for the selection
  const getTags = () => {
    if (level === 2) {
      // Level 2 (Detailed): individual region
      const region = regions[nodeId];
      if (region) {
        return [
          { label: region.group.replace(/_/g, ' '), type: 'group' },
          { label: region.hemisphere, type: 'hemisphere' },
        ];
      }
    } else if (level === 1) {
      return [
        { label: 'Lobe/Group', type: 'level' },
        { label: `${regionCount} regions`, type: 'count' },
      ];
    } else if (level === 0) {
      return [
        { label: 'Super-Region', type: 'level' },
        { label: `${regionCount} regions`, type: 'count' },
      ];
    }
    return [];
  };

  const tags = getTags();

  // Render function for level 0-2 descriptions (hierarchy)
  const renderHierarchyDescription = (desc: HierarchyDescription) => (
    <div className={styles.content}>
      <Section title="Summary">
        {desc.summary}
      </Section>

      <Section title="Function">
        {desc.function}
      </Section>

      {desc.location && (
        <Section title="Location">
          {desc.location}
        </Section>
      )}

      <Section title="Clinical Significance">
        {desc.clinical}
      </Section>

      {desc.childGroups && desc.childGroups.length > 0 && (
        <Section title="Subdivisions">
          <div className={styles.connectionsList}>
            {desc.childGroups.map((child) => (
              <span key={child} className={styles.connectionChip}>
                {child}
              </span>
            ))}
          </div>
        </Section>
      )}

      {desc.keyRegions && desc.keyRegions.length > 0 && (
        <Section title="Key Regions">
          <div className={styles.connectionsList}>
            {desc.keyRegions.map((region) => (
              <button
                key={region}
                className={styles.connectionChip}
                onClick={() => selectNode(region, 2)}
              >
                {formatRegionName(region)}
              </button>
            ))}
          </div>
        </Section>
      )}
    </div>
  );

  // Render function for level 3 descriptions (individual regions)
  const renderRegionDescription = () => {
    const regionDesc = descriptions[nodeId];
    if (!regionDesc) {
      return (
        <div className={styles.noDescription}>
          <p>Detailed description not yet available for this region.</p>
          <p className={styles.hint}>
            This is the <strong>{formatRegionName(nodeId)}</strong> region.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.content}>
        <Section title="Summary">
          {regionDesc.summary}
        </Section>

        <Section title="Function">
          {regionDesc.function}
        </Section>

        <Section title="Location">
          {regionDesc.location}
        </Section>

        <Section title="Clinical Significance">
          {regionDesc.clinical}
        </Section>

        {regionDesc.funFact && (
          <Section title="Fun Fact">
            {regionDesc.funFact}
          </Section>
        )}

        {regionDesc.connections && regionDesc.connections.length > 0 && (
          <Section title="Key Connections">
            <div className={styles.connectionsList}>
              {regionDesc.connections.map((conn) => (
                <button
                  key={conn}
                  className={styles.connectionChip}
                  onClick={() => selectNode(conn, 2)}
                >
                  {formatRegionName(conn)}
                </button>
              ))}
            </div>
          </Section>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Region Info</h2>
        <button
          className={styles.closeButton}
          onClick={() => clearSelection()}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className={styles.regionHeader}>
        <h3 className={styles.title}>
          {level === 2 ? formatRegionName(nodeId) : displayName}
        </h3>
      </div>

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag.label}</span>
          ))}
        </div>
      )}

      {level === 2 ? (
        renderRegionDescription()
      ) : description ? (
        renderHierarchyDescription(description as HierarchyDescription)
      ) : (
        <div className={styles.noDescription}>
          <p>Description not available for this group.</p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
}
