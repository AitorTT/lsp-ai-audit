export const CHART_COLORS: string[] = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2",
  "#59a14f", "#edc948", "#b07aa1", "#ff9da7",
  "#9c755f", "#bab0ac",
];

export function severityColor(severity: string): string {
  const map: Record<string, string> = {
    CRITICAL: "#d7191c",
    HIGH: "#fdae61",
    MEDIUM: "#fee08b",
    LOW: "#abdda4",
    INFO: "#2b83ba",
  };
  return map[severity] ?? "#cccccc";
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    COMPLETED: "#2ecc71",
    IN_PROGRESS: "#f1c40f",
    PENDING: "#95a5a6",
    REVIEW: "#3498db",
    DRAFT: "#bdc3c7",
    ARCHIVED: "#7f8c8d",
  };
  return map[status] ?? "#95a5a6";
}

export function generateGradient(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const r = Math.round(46 + t * (241 - 46));
    const g = Math.round(121 + t * (142 - 121));
    const b = Math.round(167 + t * (43 - 167));
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    colors.push(hex);
  }
  return colors;
}
