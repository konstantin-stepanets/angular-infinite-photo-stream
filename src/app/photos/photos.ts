import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { FavoritesService } from '../favorites/services/favorites.service';
import { Photo } from '../shared/models/photo.model';
import { PhotoGrid } from '../shared/photo-grid/photo-grid';
import { PhotoService } from './services/photo.service';

@Component({
  selector: 'app-photos',
  imports: [PhotoGrid, MatProgressSpinnerModule],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos implements OnInit {
  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(false);

  private readonly pageSize = 12;

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.photoService
      .loadPhotos(this.pageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((batch) => {
        this.photos.update((current) => [...current, ...batch]);
      });
  }

  addToFavorites(photo: Photo): void {
    this.favoritesService.add(photo);
  }
}
