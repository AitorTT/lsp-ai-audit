import { Camera, WebGLRenderer, Box3, Object3D, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createOrbitControls(camera: Camera, renderer: WebGLRenderer): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.6;
  controls.minDistance = 2;
  controls.maxDistance = 50;
  controls.target.set(0, 0, 0);
  controls.update();
  return controls;
}

export function createBoundingBox(objects: Object3D[]): Box3 {
  const box = new Box3();
  for (const obj of objects) {
    box.expandByObject(obj);
  }
  return box;
}

export function centerCameraOnObjects(camera: Camera, objects: Object3D[]): void {
  if (objects.length === 0) return;
  const box = createBoundingBox(objects);
  const center = new Vector3();
  box.getCenter(center);
  const size = new Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 1.5 + 5;
  camera.position.set(center.x, center.y + distance * 0.4, center.z + distance);
  camera.lookAt(center);
}
