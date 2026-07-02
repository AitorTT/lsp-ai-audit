export interface VizConfig {
  width?: number;
  height?: number;
  backgroundColor?: string;
  animate: boolean;
}

export interface BarChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

export interface NetworkGraphNode {
  id: string;
  label: string;
  value?: number;
}

export interface NetworkGraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface NetworkGraphData {
  nodes: NetworkGraphNode[];
  edges: NetworkGraphEdge[];
}

export interface RadarChartSeries {
  label: string;
  values: number[];
}

export interface RadarChartData {
  categories: string[];
  series: RadarChartSeries[];
}

export interface ProcessFlowStage {
  id: string;
  label: string;
  status: string;
  duration?: number;
  issues?: number;
}

export interface ProcessFlowConnection {
  from: string;
  to: string;
}

export interface ProcessFlowData {
  stages: ProcessFlowStage[];
  connections: ProcessFlowConnection[];
}
