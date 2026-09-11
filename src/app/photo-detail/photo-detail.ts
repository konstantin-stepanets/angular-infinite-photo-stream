import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FavoritesService } from '../favorites/services/favorites.service';

@Component({
  selector: 'app-photo-detail',
  imports: [NgOptimizedImage, MatButtonModule],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss',
})
export class PhotoDetail {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly photo = computed(() => this.favoritesService.getById(this.id()));

  removeFromFavorites(): void {
    this.favoritesService.remove(this.id());
    void this.router.navigate(['/favorites']);
  }
}
