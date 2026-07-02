import { Injectable } from "@angular/core";
import { SceneManager } from "../core/SceneManager";
import type { VizConfig } from "../core/types";

@Injectable({ providedIn: "root" })
export class AngularVizService {
  private managers = new Map<string, SceneManager>();

  createScene(container: HTMLElement, config: VizConfig, id: string): SceneManager {
    const manager = new SceneManager(container, config);
    this.managers.set(id, manager);
    return manager;
  }

  getScene(id: string): SceneManager | undefined {
    return this.managers.get(id);
  }

  destroyScene(id: string): void {
    const manager = this.managers.get(id);
    if (manager) {
      manager.dispose();
      this.managers.delete(id);
    }
  }

  destroyAll(): void {
    this.managers.forEach((manager) => manager.dispose());
    this.managers.clear();
  }
}
