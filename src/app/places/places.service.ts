import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Far Away Cabain',
      'In the Norwegian mountains',
      'http://res.cloudinary.com/simpleview/image/upload/v1602138733/clients/norway/woodnest_tree_house_hardanger_fjord_norway_photo_sindre_ellingsen_2_1_d0d2bffc-41e3-4f72-b2d9-a69c74f43bdd.jpg',
      35
    ),
    new Place(
      'p2',
      'Lake Hause',
      'Travel in time and fall in love trough the mail',
      'https://images.adsttc.com/media/images/55e5/01f4/9f38/5690/5d00/037c/large_jpg/photo_1.jpg?1441071600',
      7.66
    ),
    new Place(
      'p3',
      'Fairy tail hause',
      'Under the earth',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYJPMWY02kHdXi6YMphiYvecXEohQukEK4g&usqp=CAU',
      16.2
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}
}
