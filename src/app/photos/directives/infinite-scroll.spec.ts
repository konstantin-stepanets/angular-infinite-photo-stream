import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InfiniteScroll } from './infinite-scroll';

@Component({
  selector: 'app-infinite-scroll-host',
  imports: [InfiniteScroll],
  template: `
    <div appInfiniteScroll [scrollDisabled]="disabled()" (scrolled)="onScrolled()"></div>
  `,
})
class Host {
  readonly disabled = signal(false);
  scrolledCount = 0;

  onScrolled(): void {
    this.scrolledCount += 1;
  }
}

describe('InfiniteScroll', () => {
  let observerCallback: IntersectionObserverCallback;
  let observe: ReturnType<typeof vi.fn>;
  let unobserve: ReturnType<typeof vi.fn>;
  let disconnect: ReturnType<typeof vi.fn>;
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let host: Host;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }

        observe = observe;
        unobserve = unobserve;
        disconnect = disconnect;
        takeRecords = vi.fn(() => []);
        root = null;
        rootMargin = '';
        thresholds = [];
      },
    );

    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should observe the host element', () => {
    fixture.detectChanges();

    expect(observe).toHaveBeenCalled();
  });

  it('should emit scrolled when the element intersects', () => {
    fixture.detectChanges();

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(host.scrolledCount).toBe(1);
  });

  it('should not emit scrolled when disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(host.scrolledCount).toBe(0);
  });

  it('should re-check intersection when enabled again', () => {
    host.disabled.set(true);
    fixture.detectChanges();

    const observeCallsAfterInit = observe.mock.calls.length;

    host.disabled.set(false);
    fixture.detectChanges();

    expect(unobserve).toHaveBeenCalled();
    expect(observe.mock.calls.length).toBeGreaterThan(observeCallsAfterInit);

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(host.scrolledCount).toBe(1);
  });

  it('should disconnect on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();

    expect(disconnect).toHaveBeenCalled();
  });
});
