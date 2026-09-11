import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Photo } from '../shared/models/photo.model';
import { Favorites } from './favorites';
import { FavoritesService } from './services/favorites.service';

describe('Favorites', () => {
  let fixture: ComponentFixture<Favorites>;
  const photos = signal<Photo[]>([]);

  beforeEach(async () => {
    photos.set([]);

    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: {
            favorites: photos.asReadonly(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state when there are no favorites', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No favorites yet');
  });

  it('should render favorite photos', () => {
    photos.set([{ id: '1', url: 'https://picsum.photos/id/1/200/300' }]);
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-photo-card');
    expect(cards.length).toBe(1);
  });

  it('should navigate to photo detail on click', () => {
    photos.set([{ id: '1', url: 'https://picsum.photos/id/1/200/300' }]);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button.photo-card',
    ) as HTMLButtonElement;
    button.click();

    expect(navigate).toHaveBeenCalledWith(['/photos', '1']);
  });
});
