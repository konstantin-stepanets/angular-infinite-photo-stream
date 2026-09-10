import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Photo } from '../shared/models/photo.model';
import { Photos } from './photos';
import { PhotoService } from './services/photo.service';

describe('Photos', () => {
  let fixture: ComponentFixture<Photos>;
  const mockPhotos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/200/300' },
    { id: '2', url: 'https://picsum.photos/id/2/200/300' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Photos],
      providers: [
        {
          provide: PhotoService,
          useValue: {
            loadPhotos: () => of(mockPhotos),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Photos);
    await fixture.whenStable();
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
});
