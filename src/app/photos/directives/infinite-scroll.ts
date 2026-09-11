import { Directive, ElementRef, OnDestroy, effect, inject, input, output, untracked } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll implements OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly scrollDisabled = input(false);
  readonly scrolled = output<void>();

  private readonly observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !this.scrollDisabled()) {
      this.scrolled.emit();
    }
  });

  constructor() {
    this.observer.observe(this.element.nativeElement);

    // If the sentinel stays on screen after load, observe again to fetch the next page.
    effect(() => {
      if (this.scrollDisabled()) {
        return;
      }

      untracked(() => {
        const el = this.element.nativeElement;
        this.observer.unobserve(el);
        this.observer.observe(el);
      });
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
