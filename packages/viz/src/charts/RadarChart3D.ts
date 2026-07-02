import {
  Group,
  Mesh,
  MeshPhongMaterial,
  ShapeGeometry,
  ExtrudeGeometry,
  Shape,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Vector3,
  CanvasTexture,
  SpriteMaterial,
  Sprite,
} from "three";
import type { RadarChartData } from "../core/types";
import { CHART_COLORS } from "../helpers/colors";

export function createRadarChart3D(data: RadarChartData): Group {
  const group = new Group();
  const numAxes = data.categories.length;
  const maxVal = Math.max(...data.series.flatMap((s) => s.values), 1);
  const radius = 3;

  for (let ring = 1; ring <= 4; ring++) {
    const r = (radius / 4) * ring;
    const points: Vector3[] = [];
    for (let i = 0; i <= numAxes; i++) {
      const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
      points.push(new Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
    }
    const ringGeo = new BufferGeometry().setFromPoints(points);
    const ringMat = new LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
    const ringLine = new Line(ringGeo, ringMat);
    group.add(ringLine);
  }

  for (let i = 0; i < numAxes; i++) {
    const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
    const end = new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    const axisGeo = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), end]);
    const axisMat = new LineBasicMaterial({ color: 0x666666 });
    const axisLine = new Line(axisGeo, axisMat);
    group.add(axisLine);

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.categories[i], 64, 32);

    const texture = new CanvasTexture(canvas);
    const spriteMat = new SpriteMaterial({ map: texture });
    const label = new Sprite(spriteMat);
    const labelDist = radius + 0.6;
    label.position.set(Math.cos(angle) * labelDist, 0, Math.sin(angle) * labelDist);
    label.scale.set(1.5, 0.75, 1);
    group.add(label);
  }

  data.series.forEach((series, seriesIdx) => {
    const colorHex = CHART_COLORS[seriesIdx % CHART_COLORS.length];
    const shapePoints: Vector3[] = [];

    series.values.forEach((val, i) => {
      const angle = (i / numAxes) * Math.PI * 2 - Math.PI / 2;
      const r = (val / maxVal) * radius;
      shapePoints.push(new Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
    });

    const shape = new Shape();
    shape.moveTo(shapePoints[0].x, shapePoints[0].z);
    for (let i = 1; i < shapePoints.length; i++) {
      shape.lineTo(shapePoints[i].x, shapePoints[i].z);
    }
    shape.closePath();

    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    const material = new MeshPhongMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.5,
      side: 2,
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.05;
    group.add(mesh);
  });

  return group;
}
