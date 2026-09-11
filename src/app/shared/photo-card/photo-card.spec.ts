import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Photo } from '../models/photo.model';
import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  let fixture: ComponentFixture<PhotoCard>;
  const photo: Photo = {
    id: 'abc',
    url: 'https://picsum.photos/id/1/200/300',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCard);
    fixture.componentRef.setInput('photo', photo);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the photo image', () => {
    const img = (fixture.nativeElement as HTMLElement).querySelector('.photo-image');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toContain(photo.url);
  });

  it('should emit photoClick when clicked', () => {
    let emitted: Photo | undefined;
    fixture.componentInstance.photoClick.subscribe((value) => {
      emitted = value;
    });

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button.photo-card',
    ) as HTMLButtonElement;
    button.click();

    expect(emitted).toEqual(photo);
  });
});
