import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FavoritesService } from '../favorites/services/favorites.service';
import { Photo } from '../shared/models/photo.model';
import { PhotoDetail } from './photo-detail';

describe('PhotoDetail', () => {
  let fixture: ComponentFixture<PhotoDetail>;
  const photo: Photo = { id: '1', url: 'https://picsum.photos/id/1/200/300' };
  const remove = vi.fn();

  beforeEach(async () => {
    remove.mockReset();

    await TestBed.configureTestingModule({
      imports: [PhotoDetail],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: {
            getById: (id: string) => (id === photo.id ? photo : undefined),
            remove,
            favorites: signal([photo]).asReadonly(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetail);
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the photo and remove button', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('img')).toBeTruthy();
    expect(el.textContent).toContain('Remove from favorites');
  });

  it('should remove the photo and navigate back to favorites', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const removeButton = buttons.find((button) =>
      button.textContent?.includes('Remove from favorites'),
    );
    removeButton?.click();

    expect(remove).toHaveBeenCalledWith('1');
    expect(navigate).toHaveBeenCalledWith(['/favorites']);
  });
});
