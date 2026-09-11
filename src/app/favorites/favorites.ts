import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '../shared/models/photo.model';
import { PhotoGrid } from '../shared/photo-grid/photo-grid';
import { FavoritesService } from './services/favorites.service';

@Component({
  selector: 'app-favorites',
  imports: [PhotoGrid],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  readonly photos = this.favoritesService.favorites;

  openPhoto(photo: Photo): void {
    void this.router.navigate(['/photos', photo.id]);
  }
}
