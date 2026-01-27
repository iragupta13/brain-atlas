import { useState, useEffect, type ReactNode } from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  sidebar: ReactNode;
  rightPanel?: ReactNode | null;
  children: ReactNode;
}

// Breakpoint where right panel becomes overlay
const RIGHT_PANEL_OVERLAY_BREAKPOINT = 1024;
// Breakpoint where left sidebar becomes overlay
const SIDEBAR_OVERLAY_BREAKPOINT = 700;

export function AppLayout({ sidebar, rightPanel, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSidebarOverlay = windowWidth <= SIDEBAR_OVERLAY_BREAKPOINT;
  const isRightPanelOverlay = windowWidth <= RIGHT_PANEL_OVERLAY_BREAKPOINT;

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

  // Close sidebar when right panel opens (only when both are overlays)
  useEffect(() => {
    if (sidebarOpen && isSidebarOverlay) setRightPanelOpen(false);
  }, [sidebarOpen, isSidebarOverlay]);

  useEffect(() => {
    if (rightPanelOpen && isSidebarOverlay) setSidebarOpen(false);
  }, [rightPanelOpen, isSidebarOverlay]);

  // Auto-open right panel when region is selected (only when it's an overlay)
  useEffect(() => {
    if (rightPanel && isRightPanelOverlay) {
      setRightPanelOpen(true);
    }
  }, [rightPanel, isRightPanelOverlay]);

  // Backdrop is visible when any overlay panel is open
  const isBackdropVisible = (isSidebarOverlay && sidebarOpen) || (isRightPanelOverlay && rightPanelOpen);

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
