import { useMemo, useState, useCallback } from "react";
import { Layout } from "./Layout";
import { BrainScene } from "./BrainScene";
import { formatRegionName } from "./formatRegionName";
import { searchRegions } from "./searchRegions";

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [meshNames, setMeshNames] = useState<string[]>([]);

  // increments to trigger a reset inside BrainScene
  const [resetKey, setResetKey] = useState(0);

  // Compute highlighted regions from search
  const highlightedNames = useMemo(() => {
    const matches = searchRegions(searchQuery, meshNames);
    return new Set(matches);
  }, [searchQuery, meshNames]);

  // Stable callback for mesh names
  const handleMeshNames = useCallback((names: string[]) => {
    setMeshNames(names);
  }, []);

  return (
    <Layout
      sidebar={
        <>
          <h2>Brain Structures</h2>
          <p style={{ fontSize: 14 }}>Click a structure to learn what it does.</p>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #333",
              background: "#111",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {searchQuery.trim() && (
            <div
              style={{
                marginTop: 8,
                maxHeight: 200,
                overflowY: "auto",
                fontSize: 13,
              }}
            >
              {highlightedNames.size === 0 ? (
                <div style={{ opacity: 0.5, padding: "8px 0" }}>No matches</div>
              ) : (
                Array.from(highlightedNames).map((name) => (
                  <div
                    key={name}
                    onClick={() => setSelected(name)}
                    style={{
                      padding: "6px 8px",
                      cursor: "pointer",
                      borderRadius: 6,
                      background: selected === name ? "#333" : "transparent",
                    }}
                  >
                    {formatRegionName(name)}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() => { setResetKey((k) => k + 1); setSelected(null); setSearchQuery(""); }}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #333",
              background: "#111",   // dark bg
              color: "#fff",        // white text (explicit)
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset view
          </button>

          <div style={{ marginTop: 16, fontSize: 14 }}>
            <div style={{ opacity: 0.8 }}>Selected:</div>
            <div style={{ marginTop: 6, fontWeight: 700 }}>
              {selected ? formatRegionName(selected) : "Nothing yet"}
            </div>
          </div>
        </>
      }
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 1100,
            height: 700,
            border: "1px solid #333",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <BrainScene
            selectedName={selected}
            highlightedNames={highlightedNames}
            onPick={(info) => setSelected(info.name)}
            resetKey={resetKey}
            onMeshNames={handleMeshNames}
          />
        </div>
      </div>
    </Layout>
  );
}
