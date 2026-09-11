import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./photos/photos').then((m) => m.Photos),
    title: 'Photos',
  },
  {
    path: 'favorites',
    loadComponent: () => import('./favorites/favorites').then((m) => m.Favorites),
    title: 'Favorites',
  },
  {
    path: 'photos/:id',
    loadComponent: () => import('./photo-detail/photo-detail').then((m) => m.PhotoDetail),
    title: 'Photo',
  },
];
