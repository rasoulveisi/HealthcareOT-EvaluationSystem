import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[dateMask]',
  standalone: true
})
export class DateMaskDirective {
  @HostListener('keyup', ['$event']) public onKeyup(e: KeyboardEvent): void {
    // Get cursor position and input value
    let inputValue = (e.target as HTMLInputElement).value;
    let cursorPosition = inputValue.length;

    // Define date format and regex (regular expression)
    const dateFormat = 'DD-MM-YYYY';
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](19|20)\d\d$/;

    if (e.key === 'Backspace' && [2, 5].includes(cursorPosition)) {
      inputValue = inputValue.substring(0, cursorPosition - 1) + inputValue.substring(cursorPosition);
      cursorPosition--;
    }

    // Remove non-digit characters from input value
    const dateMask = inputValue.replace(/\D/g, '');

    // Format date mask with dashes
    let mask = '';
    for (let i = 0; i < dateMask.length; i++) {
      mask += dateMask[i];
      if ([1, 3].includes(i)) {
        mask += '-';
        // Update the cursor position if a dash is added
        cursorPosition === i + 1 ? cursorPosition++ : null;
      }
      // Break the loop to prevent adding more dashes
      if (i === dateFormat.length - 3) {
        break;
      }
    }

    // Validate date mask with regex and Date object
    if (mask.length === dateFormat.length) {
      if (dateRegex.test(mask)) {
        const [dd, mm, yyyy] = mask.split('-');
        const date = new Date(`${mm}/${dd}/${yyyy}`);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const year = date.getFullYear();
        if (mask !== day + '-' + month + '-' + year) {
          mask = '';
        }
      } else {
        // If mask doesn't match regex, set mask to empty string
        mask = '';
      }
    }

    // Set input value to mask
    (e.target as HTMLInputElement).value = mask;
  }
}
