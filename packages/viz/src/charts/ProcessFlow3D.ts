import {
  Group,
  Mesh,
  MeshPhongMaterial,
  BoxGeometry,
  SphereGeometry,
  CylinderGeometry,
  Vector3,
  Color,
  CanvasTexture,
  SpriteMaterial,
  Sprite,
} from "three";
import type { ProcessFlowData } from "../core/types";
import { statusColor } from "../helpers/colors";

export function createProcessFlow3D(data: ProcessFlowData): Group {
  const group = new Group();
  const stageMap = new Map<string, { mesh: Mesh; label: Sprite }>();
  const stageCount = data.stages.length;
  const spacing = 2.5;
  const totalWidth = (stageCount - 1) * spacing;
  const startX = -totalWidth / 2;

  data.stages.forEach((stage, i) => {
    const x = startX + i * spacing;
    const colorHex = statusColor(stage.status);

    const geometry = new BoxGeometry(1.2, 0.8, 0.8);
    const material = new MeshPhongMaterial({ color: colorHex, transparent: true, opacity: 0.9 });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, 0, 0);
    mesh.userData = { stageId: stage.id, label: stage.label, status: stage.status };
    group.add(mesh);

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stage.label, 128, 32);

    const texture = new CanvasTexture(canvas);
    const spriteMat = new SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
    const label = new Sprite(spriteMat);
    label.position.set(x, 0.7, 0);
    label.scale.set(2, 0.5, 1);
    group.add(label);

    if (stage.issues && stage.issues > 0) {
      const badgeCanvas = document.createElement("canvas");
      badgeCanvas.width = 64;
      badgeCanvas.height = 64;
      const bCtx = badgeCanvas.getContext("2d")!;
      bCtx.fillStyle = "#e74c3c";
      bCtx.beginPath();
      bCtx.arc(32, 32, 24, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.fillStyle = "#ffffff";
      bCtx.font = "bold 24px sans-serif";
      bCtx.textAlign = "center";
      bCtx.textBaseline = "middle";
      bCtx.fillText(String(stage.issues), 32, 34);

      const bTexture = new CanvasTexture(badgeCanvas);
      const bMat = new SpriteMaterial({ map: bTexture, depthTest: false });
      const badge = new Sprite(bMat);
      badge.position.set(x + 0.8, 0.6, 0);
      badge.scale.set(0.4, 0.4, 1);
      group.add(badge);
    }

    if (stage.duration) {
      const dCanvas = document.createElement("canvas");
      dCanvas.width = 128;
      dCanvas.height = 48;
      const dCtx = dCanvas.getContext("2d")!;
      dCtx.fillStyle = "#aaaaaa";
      dCtx.font = "14px sans-serif";
      dCtx.textAlign = "center";
      dCtx.textBaseline = "middle";
      dCtx.fillText(`${stage.duration}h`, 64, 24);

      const dTexture = new CanvasTexture(dCanvas);
      const dMat = new SpriteMaterial({ map: dTexture, depthTest: false });
      const durationLabel = new Sprite(dMat);
      durationLabel.position.set(x, -0.7, 0);
      durationLabel.scale.set(0.8, 0.3, 1);
      group.add(durationLabel);
    }

    stageMap.set(stage.id, { mesh, label });
  });

  data.connections.forEach((conn) => {
    const from = stageMap.get(conn.from);
    const to = stageMap.get(conn.to);
    if (!from || !to) return;

    const start = from.mesh.position;
    const end = to.mesh.position;
    const direction = new Vector3().subVectors(end, start);
    const length = direction.length();
    const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

    const cylinderGeo = new CylinderGeometry(0.04, 0.04, length - 1.2, 6);
    const cylinderMat = new MeshPhongMaterial({ color: 0x666666 });
    const cylinder = new Mesh(cylinderGeo, cylinderMat);
    cylinder.position.copy(midPoint);
    cylinder.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
    group.add(cylinder);

    const arrowHead = new Mesh(
      new CylinderGeometry(0, 0.15, 0.3, 6),
      new MeshPhongMaterial({ color: 0x888888 })
    );
    const arrowPos = direction.clone().normalize().multiplyScalar((length - 1.2) / 2);
    arrowHead.position.copy(midPoint.clone().add(arrowPos));
    arrowHead.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
    group.add(arrowHead);
  });

  return group;
}
