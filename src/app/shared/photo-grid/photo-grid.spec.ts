import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Photo } from '../models/photo.model';
import { PhotoGrid } from './photo-grid';

describe('PhotoGrid', () => {
  let fixture: ComponentFixture<PhotoGrid>;
  const photos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/200/300' },
    { id: '2', url: 'https://picsum.photos/id/2/200/300' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', photos);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a card for each photo', () => {
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-photo-card');
    expect(cards.length).toBe(2);
  });

  it('should emit photoClick from a card', () => {
    let emitted: Photo | undefined;
    fixture.componentInstance.photoClick.subscribe((photo) => {
      emitted = photo;
    });

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button.photo-card',
    ) as HTMLButtonElement;
    button.click();

    expect(emitted).toEqual(photos[0]);
  });
});
