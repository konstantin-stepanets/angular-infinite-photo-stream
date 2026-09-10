import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Photo } from '../../shared/models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  loadPhotos(count: number): Observable<Photo[]> {
    const photos = Array.from({ length: count }, () => this.createPhoto());
    const delayMs = this.randomDelay();

    return of(photos).pipe(delay(delayMs));
  }

  private createPhoto(): Photo {
    // Different /id/N → different image. Same /200/300 for all cards → one cached picture.
    const imageId = Math.floor(Math.random() * 1000);

    return {
      id: crypto.randomUUID(),
      url: `https://picsum.photos/id/${imageId}/200/300`,
    };
  }

  private randomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }
}
