import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FavoritesService } from '../favorites/services/favorites.service';
import { Photo } from '../shared/models/photo.model';
import { Photos } from './photos';
import { PhotoService } from './services/photo.service';

describe('Photos', () => {
  let fixture: ComponentFixture<Photos>;
  const mockPhotos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/200/300' },
    { id: '2', url: 'https://picsum.photos/id/2/200/300' },
  ];
  const add = vi.fn();

  beforeEach(async () => {
    add.mockReset();

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
        unobserve = vi.fn();
        takeRecords = vi.fn(() => []);
        root = null;
        rootMargin = '';
        thresholds = [];
      },
    );

    await TestBed.configureTestingModule({
      imports: [Photos],
      providers: [
        {
          provide: PhotoService,
          useValue: {
            loadPhotos: () => of(mockPhotos),
          },
        },
        {
          provide: FavoritesService,
          useValue: {
            favorites: signal([]).asReadonly(),
            add,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Photos);
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load and render photos on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.photos().length).toBe(2);
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-photo-card');
    expect(cards.length).toBe(2);
  });

  it('should add a photo to favorites on card click', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button.photo-card',
    ) as HTMLButtonElement;
    button.click();

    expect(add).toHaveBeenCalledWith(mockPhotos[0]);
  });
});
