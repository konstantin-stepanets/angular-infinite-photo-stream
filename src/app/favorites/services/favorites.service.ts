import { Injectable, signal } from '@angular/core';
import { Photo } from '../../shared/models/photo.model';

const STORAGE_KEY = 'photo-favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favoritesSignal = signal<Photo[]>(this.readFromStorage());

  readonly favorites = this.favoritesSignal.asReadonly();

  add(photo: Photo): void {
    if (this.favoritesSignal().some((item) => item.id === photo.id)) {
      return;
    }

    this.favoritesSignal.update((items) => [...items, photo]);
    this.writeToStorage();
  }

  remove(id: string): void {
    this.favoritesSignal.update((items) => items.filter((item) => item.id !== id));
    this.writeToStorage();
  }

  getById(id: string): Photo | undefined {
    return this.favoritesSignal().find((item) => item.id === id);
  }

  private readFromStorage(): Photo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Photo[]) : [];
    } catch {
      return [];
    }
  }

  private writeToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favoritesSignal()));
  }
}
