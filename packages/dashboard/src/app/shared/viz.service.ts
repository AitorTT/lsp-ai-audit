import { Injectable } from '@angular/core';
import { SceneManager, createBarChart3D, createNetworkGraph3D, createRadarChart3D, createProcessFlow3D } from '@lsp/viz';
import type { BarChartData, NetworkGraphData, RadarChartData, ProcessFlowData, VizConfig } from '@lsp/viz';

@Injectable({ providedIn: 'root' })
export class VizService {
  private managers = new Map<string, SceneManager>();

  private createScene(containerId: string): SceneManager {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container #${containerId} not found`);
    }
    const config: VizConfig = {
      width: container.clientWidth || 400,
      height: container.clientHeight || 300,
      animate: true,
    };
    const manager = new SceneManager(container, config);
    this.managers.set(containerId, manager);
    return manager;
  }

  createBarChart(containerId: string, data: BarChartData): SceneManager {
    const manager = this.createScene(containerId);
    const group = createBarChart3D(data);
    manager.add(group);
    return manager;
  }

  createNetworkGraph(containerId: string, data: NetworkGraphData): SceneManager {
    const manager = this.createScene(containerId);
    const group = createNetworkGraph3D(data);
    manager.add(group);
    return manager;
  }

  createRadarChart(containerId: string, data: RadarChartData): SceneManager {
    const manager = this.createScene(containerId);
    const group = createRadarChart3D(data);
    manager.add(group);
    return manager;
  }

  createProcessFlow(containerId: string, data: ProcessFlowData): SceneManager {
    const manager = this.createScene(containerId);
    const group = createProcessFlow3D(data);
    manager.add(group);
    return manager;
  }

  dispose(containerId: string): void {
    const manager = this.managers.get(containerId);
    if (manager) {
      manager.dispose();
      this.managers.delete(containerId);
    }
  }

  disposeAll(): void {
    this.managers.forEach((m) => m.dispose());
    this.managers.clear();
  }
}
