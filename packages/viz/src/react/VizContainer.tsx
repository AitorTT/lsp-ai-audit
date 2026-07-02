import React, { useRef, useEffect } from "react";
import { SceneManager } from "../core/SceneManager";
import type { VizConfig } from "../core/types";

interface VizContainerProps {
  config: VizConfig;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function VizContainer({ config, children, className, style }: VizContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const manager = new SceneManager(container, config);

    return () => {
      manager.dispose();
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      {children}
    </div>
  );
}
