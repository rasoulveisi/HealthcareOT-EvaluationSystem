import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'warning-svg',
  template: `<svg
    width="100%"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="Fill"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.70394 3.05176e-05C4.34103 3.05176e-05 0.666992 3.65717 0.666992 8.00003C0.666992 12.3429 4.34103 16 8.70394 16C13.0669 16 16.7409 12.4572 16.7409 8.00003C16.7409 3.54289 13.1817 3.05176e-05 8.70394 3.05176e-05ZM8.12986 3.4286H9.278V9.14289H8.12986V3.4286ZM8.70464 12.8002C8.24539 12.8002 7.78613 12.343 7.78613 11.8859C7.78613 11.4287 8.13057 10.9716 8.70464 10.9716C9.1639 10.9716 9.62315 11.4287 9.62315 11.8859C9.62315 12.343 9.1639 12.8002 8.70464 12.8002Z"
      [attr.fill]="fillColor"
    />
  </svg> `,
})
export class WarningSvg {
  @Input('fillColor') fillColor: string = '#DA1E28';
}
