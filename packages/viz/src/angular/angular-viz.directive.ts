import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { SceneManager } from "../core/SceneManager";
import type { VizConfig } from "../core/types";

@Directive({ selector: "[lspVizContainer]" })
export class AngularVizDirective implements OnInit, OnDestroy {
  @Input("lspVizContainer") config!: VizConfig;
  private manager: SceneManager | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.manager = new SceneManager(this.el.nativeElement, this.config);
  }

  ngOnDestroy(): void {
    if (this.manager) {
      this.manager.dispose();
      this.manager = null;
    }
  }
}
