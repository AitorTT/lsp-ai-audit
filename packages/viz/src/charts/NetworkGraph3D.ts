import {
  Group,
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
  CylinderGeometry,
  Color,
  Vector3,
  CanvasTexture,
  SpriteMaterial,
  Sprite,
} from "three";
import type { NetworkGraphData } from "../core/types";
import { CHART_COLORS } from "../helpers/colors";

export function createNetworkGraph3D(data: NetworkGraphData): Group {
  const group = new Group();
  const nodeMap = new Map<string, { mesh: Mesh; label: Sprite }>();

  const maxVal = Math.max(...data.nodes.map((n) => n.value ?? 0), 1);

  data.nodes.forEach((node, i) => {
    const radius = node.value ? 0.3 + (node.value / maxVal) * 0.5 : 0.35;
    const angle = (i / data.nodes.length) * Math.PI * 2;
    const x = Math.cos(angle) * 4;
    const z = Math.sin(angle) * 4;

    const colorHex = CHART_COLORS[i % CHART_COLORS.length];
    const color = node.value
      ? new Color(colorHex).lerp(new Color(0xe74c3c), node.value / maxVal * 0.5)
      : new Color(colorHex);

    const geometry = new SphereGeometry(radius, 24, 24);
    const material = new MeshPhongMaterial({ color, shininess: 40 });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, 0, z);
    mesh.userData = { nodeId: node.id, label: node.label, value: node.value };
    group.add(mesh);

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, 128, 32);

    const texture = new CanvasTexture(canvas);
    const spriteMat = new SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
    const label = new Sprite(spriteMat);
    label.position.set(x, radius + 0.4, z);
    label.scale.set(2, 0.5, 1);
    group.add(label);

    nodeMap.set(node.id, { mesh, label });
  });

  data.edges.forEach((edge) => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) return;

    const start = source.mesh.position;
    const end = target.mesh.position;
    const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);
    const direction = new Vector3().subVectors(end, start);
    const length = direction.length();
    const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

    const colorHex = edge.weight ? CHART_COLORS[0] : "#666666";
    const cylinderGeo = new CylinderGeometry(0.04, 0.04, length, 6);
    const cylinderMat = new MeshPhongMaterial({
      color: colorHex,
      transparent: true,
      opacity: edge.weight ? 0.8 : 0.4,
    });
    const cylinder = new Mesh(cylinderGeo, cylinderMat);
    cylinder.position.copy(midPoint);
    cylinder.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
    group.add(cylinder);
  });

  return group;
}
