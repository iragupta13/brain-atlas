import type { ReactNode } from "react";

type LayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export function Layout({ sidebar, children }: LayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #ddd",
          padding: 16,
          overflow: "auto",
        }}
      >
        {sidebar}
      </aside>

      <main
        style={{
          padding: 24,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
        }}
      >
        {children}
      </main>
    </div>
  );
}
