import { useState, useEffect, type ReactNode } from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  header?: ReactNode;
  sidebar: ReactNode;
  rightPanel?: ReactNode | null;
  rightPanelKey?: null | string;
  children: ReactNode;
}

// Breakpoint where right panel becomes overlay
const RIGHT_PANEL_OVERLAY_BREAKPOINT = 1024;
// Breakpoint where left sidebar becomes overlay
const SIDEBAR_OVERLAY_BREAKPOINT = 700;

export function AppLayout({ header, sidebar, rightPanel, rightPanelKey = null, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dismissedRightPanelKey, setDismissedRightPanelKey] = useState<null | string>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSidebarOverlay = windowWidth <= SIDEBAR_OVERLAY_BREAKPOINT;
  const isRightPanelOverlay = windowWidth <= RIGHT_PANEL_OVERLAY_BREAKPOINT;
  const hasRightPanel = Boolean(rightPanel);
  const rightPanelDismissed = rightPanelKey !== null && dismissedRightPanelKey === rightPanelKey;
  const rightPanelOpen = hasRightPanel && (!isRightPanelOverlay || (!rightPanelDismissed && !sidebarOpen));

  // Close panels when clicking backdrop
  const handleBackdropClick = () => {
    setSidebarOpen(false);
    if (rightPanelKey !== null) {
      setDismissedRightPanelKey(rightPanelKey);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleRightPanel = () => {
    if (!hasRightPanel || rightPanelKey === null) return;
    setDismissedRightPanelKey((prev) => (prev === rightPanelKey ? null : rightPanelKey));
    setSidebarOpen(false);
  };

  // Close panels on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        if (rightPanelKey !== null) {
          setDismissedRightPanelKey(rightPanelKey);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [rightPanelKey]);

  // Backdrop is visible when any overlay panel is open
  const isBackdropVisible = (isSidebarOverlay && sidebarOpen) || (isRightPanelOverlay && rightPanelOpen);

  return (
    <div className={`${styles.container} ${rightPanel ? styles.withRightPanel : ''}`}>
      {header && <div className={styles.topbar}>{header}</div>}
      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Mobile info button (only show when there's a right panel) */}
      {hasRightPanel && (
        <button
          className={styles.mobileInfoButton}
          onClick={toggleRightPanel}
          aria-label="Toggle region info"
        >
          {rightPanelOpen ? '✕' : 'ℹ'}
        </button>
      )}

      {/* Backdrop for mobile/tablet overlays */}
      <div
        className={`${styles.backdrop} ${isBackdropVisible ? styles.visible : ''}`}
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
            onClick={toggleRightPanel}
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
