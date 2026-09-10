import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Photo } from '../../shared/models/photo.model';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the requested number of photos', async () => {
    let photos: Photo[] = [];

    service.loadPhotos(5).subscribe((result) => {
      photos = result;
    });
    await vi.advanceTimersByTimeAsync(300);

    expect(photos.length).toBe(5);
  });

  it('should generate unique IDs for each photo', async () => {
    let photos: Photo[] = [];

    service.loadPhotos(10).subscribe((result) => {
      photos = result;
    });
    await vi.advanceTimersByTimeAsync(300);

    const ids = photos.map((photo) => photo.id);
    expect(new Set(ids).size).toBe(10);
  });

  it('should generate stable picsum URLs with seed', async () => {
    let photos: Photo[] = [];

    service.loadPhotos(3).subscribe((result) => {
      photos = result;
    });
    await vi.advanceTimersByTimeAsync(300);

    photos.forEach((photo) => {
      expect(photo.url).toBe(`https://picsum.photos/seed/${photo.id}/200/300`);
    });
  });

  it('should delay the response between 200 and 300ms', async () => {
    let photos: Photo[] | undefined;

    service.loadPhotos(1).subscribe((result) => {
      photos = result;
    });

    await vi.advanceTimersByTimeAsync(199);
    expect(photos).toBeUndefined();

    await vi.advanceTimersByTimeAsync(101);
    expect(photos?.length).toBe(1);
  });
});
