import { useState } from "react";
import { Layout } from "./Layout";
import { BrainScene } from "./BrainScene";

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);

  // NEW: increments to trigger a reset inside BrainScene
  const [resetKey, setResetKey] = useState(0);

  return (
    <Layout
      sidebar={
        <>
          <h2>Brain Structures</h2>
          <p style={{ fontSize: 14 }}>Click a structure to learn what it does.</p>

          {/* NEW: Reset button (force visible text) */}
          <button
            onClick={() => { setResetKey((k) => k + 1); setSelected(null); }}
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
              {selected ?? "Nothing yet"}
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
            onPick={(info) => setSelected(info.name)}
            resetKey={resetKey} // NEW
          />
        </div>
      </div>
    </Layout>
  );
}
