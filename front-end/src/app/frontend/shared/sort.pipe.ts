/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
*/

import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBy' })

export class SortByPipe implements PipeTransform {

  transform(values: number[]|string[]|object[], key?: string, reverse?: boolean) {
    if (!Array.isArray(values) || values.length <= 0) {
      return null;
    }
    //console.log(values, key, reverse);
    return this.sort(values, key, reverse);
  }

  private sort(value: any[], key?: any, reverse?: boolean): any[] {
    const isInside = key && key.indexOf('.') !== -1;

    if (isInside) {
      key = key.split('.');
    }
    //console.log(key);

    if(key == 'saleDate'){

      value.sort((a: any, b: any) => {
          let left = Number(new Date(a[key]));
          let right = Number(new Date(b[key]));
          return  (reverse) ? right - left : left - right;
      });
      return value;

    }
    else{
      const array: any[] = value.sort((a: any, b: any): number => {
        //console.log((a[key]) , b[key]);
        if (!key) {
          return a > b ? 1 : -1;
        }

        if (!isInside) {
          return parseFloat(a[key]) > parseFloat(b[key]) ? 1 : -1;
        }

        return this.getValue(a, key) > this.getValue(b, key) ? 1 : -1;
      });

      if (reverse) {
        return array.reverse();
      }

      return array;
    }

  }

  private getValue(object: any, key: string[]) {
    for (let i = 0, n = key.length; i < n; ++i) {
      const k = key[i];
      if (!(k in object)) {
        return;
      }

      object = object[k];
    }

    return object;
  }
}
