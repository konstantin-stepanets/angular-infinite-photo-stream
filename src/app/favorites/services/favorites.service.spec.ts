import { TestBed } from '@angular/core/testing';
import { Photo } from '../../shared/models/photo.model';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const photo: Photo = {
    id: '1',
    url: 'https://picsum.photos/id/1/200/300',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start empty', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('should add a photo', () => {
    service.add(photo);
    expect(service.favorites()).toEqual([photo]);
  });

  it('should not add the same photo twice', () => {
    service.add(photo);
    service.add(photo);
    expect(service.favorites().length).toBe(1);
  });

  it('should remove a photo', () => {
    service.add(photo);
    service.remove(photo.id);
    expect(service.favorites()).toEqual([]);
  });

  it('should get a photo by id', () => {
    service.add(photo);
    expect(service.getById('1')).toEqual(photo);
    expect(service.getById('missing')).toBeUndefined();
  });

  it('should persist favorites in localStorage', () => {
    service.add(photo);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const reloaded = TestBed.inject(FavoritesService);

    expect(reloaded.favorites()).toEqual([photo]);
  });
});
