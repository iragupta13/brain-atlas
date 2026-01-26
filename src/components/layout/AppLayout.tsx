import type { ReactNode } from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  sidebar: ReactNode;
  rightPanel?: ReactNode | null;
  children: ReactNode;
}

export function AppLayout({ sidebar, rightPanel, children }: AppLayoutProps) {
  return (
    <div className={`${styles.container} ${rightPanel ? styles.withRightPanel : ''}`}>
      <aside className={styles.sidebar}>
        {sidebar}
      </aside>
      <main className={styles.main}>
        {children}
      </main>
      {rightPanel && (
        <aside className={styles.rightPanel}>
          {rightPanel}
        </aside>
      )}
    </div>
  );
}
