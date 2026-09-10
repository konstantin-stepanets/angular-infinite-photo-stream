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
    const id = crypto.randomUUID();

    return {
      id,
      url: `https://picsum.photos/seed/${id}/200/300`,
    };
  }

  private randomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }
}
