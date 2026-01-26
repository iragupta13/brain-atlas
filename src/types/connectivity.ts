export interface Connection {
  source: string;    // Region name, e.g., "Hippocampus_L"
  target: string;    // Region name, e.g., "Amygdala_L"
  strength: number;  // Normalized 0-1
}

export interface ConnectivityData {
  connections: Connection[];
}

export type ConnectionType = 'structural' | 'functional';
