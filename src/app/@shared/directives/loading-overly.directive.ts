import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLoadingOverly]',
  standalone: true
})
export class LoadingOverlyDirective {
  private localAppLoadingOverly: boolean = false;
  @Input() set appLoadingOverly(appLoadingOverly: boolean) {
    this.localAppLoadingOverly = appLoadingOverly;
    if (appLoadingOverly) {
      this.addOverly();
    } else {
      this.removeOverly();
    }
  }
  @Input() overLayBackgroundColor: string | null = null;

  get appLoadingOverly() {
    return this.localAppLoadingOverly;
  }
  private overlyLayer = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private addOverly() {
    if (this.appLoadingOverly === null) return;
    if (!this.overlyLayer) {
      this.el.nativeElement.style.position = 'relative';
      this.overlyLayer = this.renderer.createElement('div');
      this.renderer.addClass(this.overlyLayer, 'loader-container');
      if (this.overLayBackgroundColor) {
        this.renderer.setStyle(this.overlyLayer, 'background-color', this.overLayBackgroundColor);
      }

      const loaderSpinner = this.renderer.createElement('div');
      this.renderer.addClass(loaderSpinner, 'loader-single-page');

      this.renderer.appendChild(this.overlyLayer, loaderSpinner);

      this.renderer.appendChild(this.el.nativeElement, this.overlyLayer);
    } else {
      this.renderer.appendChild(this.el.nativeElement, this.overlyLayer);
    }
  }

  private removeOverly() {
    if (this.appLoadingOverly === null || !this.overlyLayer) return;

    this.renderer.removeChild(this.el.nativeElement, this.overlyLayer);
  }
}
