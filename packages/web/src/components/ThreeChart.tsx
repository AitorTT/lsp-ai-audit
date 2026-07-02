'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SceneManager, createBarChart3D, createRadarChart3D, createNetworkGraph3D, createProcessFlow3D } from '@lsp/viz';
import type { BarChartData, RadarChartData, NetworkGraphData, ProcessFlowData } from '@lsp/viz';

type ChartType = 'bar' | 'radar' | 'network' | 'process';
type ChartData = BarChartData | RadarChartData | NetworkGraphData | ProcessFlowData;

interface ThreeChartProps {
  type: ChartType;
  data: ChartData;
  height?: number;
  className?: string;
}

export default function ThreeChart({ type, data, height = 380, className = '' }: ThreeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || managerRef.current) return;

    const manager = new SceneManager(containerRef.current, {
      backgroundColor: '#0f172a',
      animate: true,
    });
    managerRef.current = manager;
    setReady(true);

    return () => {
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !managerRef.current) return;

    const manager = managerRef.current;
    manager.clear();

    let chart: THREE.Group | null = null;

    if (type === 'bar' && 'labels' in data) {
      chart = createBarChart3D(data as BarChartData);
    } else if (type === 'radar' && 'categories' in data) {
      chart = createRadarChart3D(data as RadarChartData);
    } else if (type === 'network' && 'nodes' in data) {
      chart = createNetworkGraph3D(data as NetworkGraphData);
    } else if (type === 'process' && 'stages' in data) {
      chart = createProcessFlow3D(data as ProcessFlowData);
    }

    if (chart) {
      manager.add(chart);
      manager.centerCameraOnObjects();
    }
  }, [ready, type, data]);

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl overflow-hidden border border-white/[0.06] ${className}`}
      style={{ height }}
    />
  );
}
