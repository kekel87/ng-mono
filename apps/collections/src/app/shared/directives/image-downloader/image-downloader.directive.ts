import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { hasValue, isEmpty } from '@ng-mono/shared/utils';
import { SupabaseHelperService } from '~shared/services/supabase-helper.service';

@Directive({
  standalone: true,
  selector: 'img[colImg]',
})
export class ImageDowloaderDirective implements OnChanges {
  @Input({ alias: 'colImg' }) path?: string | null;
  @Input() default = 'assets/400x200.png';

  constructor(
    private el: ElementRef,
    private supabase: SupabaseHelperService
  ) {}

  ngOnChanges(): void {
    if (isEmpty(this.path)) {
      this.el.nativeElement.src = this.default;
      return;
    }

    this.supabase.download(this.path!).subscribe({
      next: (response) => {
        if (hasValue(response)) {
          this.el.nativeElement.src = URL.createObjectURL(response);
        } else {
          this.el.nativeElement.src = this.default;
        }
      },
      error: () => (this.el.nativeElement.src = this.default),
    });
  }
}
