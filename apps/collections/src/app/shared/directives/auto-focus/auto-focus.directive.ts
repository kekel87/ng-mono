import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[colAutofocus]',
})
export class AutoFocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.focus();
    this.el.nativeElement.select();
  }
}
