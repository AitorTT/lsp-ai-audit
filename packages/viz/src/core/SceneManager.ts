import { Scene, PerspectiveCamera, WebGLRenderer, Object3D, Color, Box3, Vector3, Mesh, Group } from "three";
import type { VizConfig } from "./types";

export class SceneManager {
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  private container: HTMLElement;
  private animationId: number | null = null;
  private resizeObserver: ResizeObserver;
  private config: VizConfig;

  constructor(container: HTMLElement, config: VizConfig) {
    this.container = container;
    this.config = config;

    this.scene = new Scene();
    if (config.backgroundColor) {
      this.scene.background = new Color(config.backgroundColor);
    }

    const width = config.width ?? container.clientWidth;
    const height = config.height ?? container.clientHeight;
    const aspect = width / height;

    this.camera = new PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
      }
    });
    this.resizeObserver.observe(container);

    if (config.animate) {
      this.start();
    }
  }

  add(object: Object3D): void {
    this.scene.add(object);
  }

  remove(object: Object3D): void {
    this.scene.remove(object);
  }

  clear(): void {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  centerCameraOnObjects(): void {
    const objects: Object3D[] = [];
    this.scene.traverse((child) => {
      if (child instanceof Mesh || child instanceof Group) {
        objects.push(child);
      }
    });

    if (objects.length === 0) return;

    const box = new Box3().setFromObject(objects[0]);
    for (let i = 1; i < objects.length; i++) {
      box.expandByObject(objects[i]);
    }

    const center = new Vector3();
    box.getCenter(center);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = maxDim / (2 * Math.tan(fov / 2));
    cameraZ *= 1.5;

    this.camera.position.set(center.x, center.y + cameraZ * 0.3, center.z + cameraZ);
    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();
  }

  private render = (): void => {
    this.renderer.render(this.scene, this.camera);
  };

  private loop = (): void => {
    this.render();
    this.animationId = requestAnimationFrame(this.loop);
  };

  start(): void {
    if (this.animationId !== null) return;
    this.loop();
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  renderFrame(): void {
    this.render();
  }

  dispose(): void {
    this.stop();
    this.resizeObserver.disconnect();
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}
