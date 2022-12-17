import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Far Away Cabain',
      'In the Norwegian mountains',
      'http://res.cloudinary.com/simpleview/image/upload/v1602138733/clients/norway/woodnest_tree_house_hardanger_fjord_norway_photo_sindre_ellingsen_2_1_d0d2bffc-41e3-4f72-b2d9-a69c74f43bdd.jpg',
      35,
      new Date('2022-12-22'),
      new Date('2023-12-22'),
      'abc'
    ),
    new Place(
      'p2',
      'Lake Hause',
      'Travel in time and fall in love trough the mail',
      'https://images.adsttc.com/media/images/55e5/01f4/9f38/5690/5d00/037c/large_jpg/photo_1.jpg?1441071600',
      7.66,
      new Date('2022-12-22'),
      new Date('2023-12-22'),
      'abc'
    ),
    new Place(
      'p3',
      'Fairy tail hause',
      'Under the earth',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYJPMWY02kHdXi6YMphiYvecXEohQukEK4g&usqp=CAU',
      16.2,
      new Date('2022-12-22'),
      new Date('2023-12-22'),
      'hij'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYJPMWY02kHdXi6YMphiYvecXEohQukEK4g&usqp=CAU',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlacesIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlacesIndex];
        updatedPlaces[updatedPlacesIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageURL,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
