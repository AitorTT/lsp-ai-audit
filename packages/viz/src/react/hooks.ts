import { useRef, useEffect, useState, useCallback } from "react";
import { SceneManager } from "../core/SceneManager";
import type { VizConfig } from "../core/types";

export function useSceneManager(
  containerRef: React.RefObject<HTMLElement | null>,
  config?: Partial<VizConfig>
) {
  const managerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const defaultConfig: VizConfig = {
      animate: config?.animate ?? true,
      width: config?.width,
      height: config?.height,
      backgroundColor: config?.backgroundColor,
    };

    const manager = new SceneManager(container, defaultConfig);
    managerRef.current = manager;

    return () => {
      manager.dispose();
      managerRef.current = null;
    };
  }, [containerRef]);

  return managerRef;
}

export function useResize(containerRef: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  return dimensions;
}
