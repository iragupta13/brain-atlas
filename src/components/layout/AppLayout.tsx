import { useState, useEffect, type ReactNode } from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  sidebar: ReactNode;
  rightPanel?: ReactNode | null;
  children: ReactNode;
}

export function AppLayout({ sidebar, rightPanel, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Close panels when clicking backdrop
  const handleBackdropClick = () => {
    setSidebarOpen(false);
    setRightPanelOpen(false);
  };

  // Close panels on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setRightPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Close sidebar when right panel opens and vice versa (on mobile)
  useEffect(() => {
    if (sidebarOpen) setRightPanelOpen(false);
  }, [sidebarOpen]);

  useEffect(() => {
    if (rightPanelOpen) setSidebarOpen(false);
  }, [rightPanelOpen]);

  // Auto-open right panel on mobile when region is selected
  useEffect(() => {
    if (rightPanel) {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      if (isMobile) {
        setRightPanelOpen(true);
      }
    }
  }, [rightPanel]);

  const isAnyPanelOpen = sidebarOpen || rightPanelOpen;

  return (
    <div className={`${styles.container} ${rightPanel ? styles.withRightPanel : ''}`}>
      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Mobile info button (only show when there's a right panel) */}
      {rightPanel && (
        <button
          className={styles.mobileInfoButton}
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          aria-label="Toggle region info"
        >
          {rightPanelOpen ? '✕' : 'ℹ'}
        </button>
      )}

      {/* Backdrop for mobile */}
      <div
        className={`${styles.backdrop} ${isAnyPanelOpen ? styles.visible : ''}`}
        onClick={handleBackdropClick}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <button
          className={styles.panelCloseButton}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        {sidebar}
      </aside>

      <main className={styles.main}>
        {children}
      </main>

      {rightPanel && (
        <aside className={`${styles.rightPanel} ${rightPanelOpen ? styles.open : ''}`}>
          <button
            className={styles.panelCloseButton}
            onClick={() => setRightPanelOpen(false)}
            aria-label="Close panel"
          >
            ✕
          </button>
          {rightPanel}
        </aside>
      )}
    </div>
  );
}
