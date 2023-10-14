import { DestroyRef, Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, inject } from '@angular/core';
import { GeoJSON } from 'geojson';
import { GeoJSON2SVG } from 'geojson2svg';
import { first, timer } from 'rxjs';

@Directive({
  standalone: true,
  selector: 'svg[logFromGeoJson]',
})
export class FromGeoJsonDirective implements OnChanges, OnDestroy {
  @Input({ required: true }) logFromGeoJson!: GeoJSON;
  @Input() size = 50;

  protected destroyRef = inject(DestroyRef);

  private paths: SVGPathElement[] = [];
  private group: SVGGraphicsElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.renderer.setAttribute(this.group, 'id', 'paths');
    this.el.nativeElement.appendChild(this.group);
  }

  ngOnChanges() {
    this.hide();
    this.clear();
    this.renderer.setStyle(this.el.nativeElement, 'width', `${this.size}px`);
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.size}px`);

    const converter = new GeoJSON2SVG({
      mapExtentFromGeojson: true,
      output: 'path',
      viewportSize: { width: this.size, height: this.size },
    });

    const pathDatas: string[] = converter.convert(this.logFromGeoJson);
    pathDatas.forEach((pathData) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.renderer.setAttribute(path, 'd', pathData);
      this.group.appendChild(path);
      this.paths.push(path);
    });

    timer(1)
      .pipe(first())
      .subscribe(() => {
        this.centerGroup();
        this.showWithSmoothTransition();
      });
  }

  ngOnDestroy() {
    this.clear();
  }

  private centerGroup(): void {
    const rootSVGSize = this.el.nativeElement.getBoundingClientRect();
    const groupSize = this.group.getBoundingClientRect();

    const x = rootSVGSize.x - groupSize.x + (rootSVGSize.width - groupSize.width) / 2;
    const y = rootSVGSize.y - groupSize.y + (rootSVGSize.height - groupSize.height) / 2;

    this.renderer.setAttribute(this.group, 'transform', `translate(${x}, ${y})`);
  }

  private hide() {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
  }

  private showWithSmoothTransition() {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.4s ease-in-out');
  }

  private clear() {
    this.paths.forEach((path) => this.renderer.removeChild(this.group, path));
  }
}
