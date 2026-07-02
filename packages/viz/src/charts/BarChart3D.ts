import {
  Group,
  Mesh,
  MeshPhongMaterial,
  BoxGeometry,
  PlaneGeometry,
  CanvasTexture,
  SpriteMaterial,
  Sprite,
  Raycaster,
  Vector2,
  Color,
  AmbientLight,
  DirectionalLight,
} from "three";
import type { BarChartData } from "../core/types";
import { CHART_COLORS } from "../helpers/colors";

export function createBarChart3D(data: BarChartData): Group {
  const group = new Group();
  const raycaster = new Raycaster();
  const pointer = new Vector2();

  const ambientLight = new AmbientLight(0xffffff, 0.5);
  group.add(ambientLight);

  const dirLight = new DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  group.add(dirLight);

  const maxVal = Math.max(...data.values, 1);
  const barCount = data.values.length;
  const spacing = 1.5;
  const totalWidth = (barCount - 1) * spacing;
  const startX = -totalWidth / 2;

  const bars: Mesh[] = [];

  data.values.forEach((value, i) => {
    const height = (value / maxVal) * 4 + 0.1;
    const colorHex = data.colors?.[i] ?? CHART_COLORS[i % CHART_COLORS.length];
    const color = new Color(colorHex);

    const geometry = new BoxGeometry(0.8, height, 0.8);
    const material = new MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      shininess: 30,
    });

    const bar = new Mesh(geometry, material);
    bar.position.set(startX + i * spacing, height / 2, 0);
    bar.userData = { originalColor: colorHex, originalHeight: height, index: i };
    bar.castShadow = true;
    group.add(bar);
    bars.push(bar);

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.labels[i], 64, 32);

    const texture = new CanvasTexture(canvas);
    const spriteMat = new SpriteMaterial({ map: texture });
    const label = new Sprite(spriteMat);
    label.position.set(startX + i * spacing, -0.3, 0);
    label.scale.set(1.5, 0.75, 1);
    group.add(label);
  });

  group.userData = {
    bars,
    hitTest: (x: number, y: number, camera: any): Mesh | null => {
      pointer.x = x;
      pointer.y = y;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(bars);
      return intersects.length > 0 ? (intersects[0].object as Mesh) : null;
    },
    resetHighlights: () => {
      bars.forEach((bar) => {
        const mat = bar.material as MeshPhongMaterial;
        mat.color.set(bar.userData.originalColor as string);
        mat.emissive.setHex(0x000000);
        bar.scale.set(1, 1, 1);
      });
    },
    highlightBar: (bar: Mesh) => {
      const mat = bar.material as MeshPhongMaterial;
      mat.emissive.setHex(0x333333);
      bar.scale.set(1.1, 1.05, 1.1);
    },
  };

  return group;
}
