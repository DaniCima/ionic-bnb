import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

// [
//   new Place(
//     'p1',
//     'Far Away Cabain',
//     'In the Norwegian mountains',
//     'http://res.cloudinary.com/simpleview/image/upload/v1602138733/clients/norway/woodnest_tree_house_hardanger_fjord_norway_photo_sindre_ellingsen_2_1_d0d2bffc-41e3-4f72-b2d9-a69c74f43bdd.jpg',
//     35,
//     new Date('2022-12-22'),
//     new Date('2023-12-22'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     'Lake Hause',
//     'Travel in time and fall in love trough the mail',
//     'https://images.adsttc.com/media/images/55e5/01f4/9f38/5690/5d00/037c/large_jpg/photo_1.jpg?1441071600',
//     7.66,
//     new Date('2022-12-22'),
//     new Date('2023-12-22'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'Fairy tail hause',
//     'Under the earth',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYJPMWY02kHdXi6YMphiYvecXEohQukEK4g&usqp=CAU',
//     16.2,
//     new Date('2022-12-22'),
//     new Date('2023-12-22'),
//     'hij'
//   ),
// ]

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ionicangular-bnb-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionicangular-bnb-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
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
    let generatedId: string;
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
    return this.http
      .post<{ name: string }>(
        'https://ionicangular-bnb-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json',
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageURL,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-course.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
