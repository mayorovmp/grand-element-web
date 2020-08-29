import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  // /**
  //  * Transform
  //  *
  //  * @param {any[]} items
  //  * @param {string} searchText
  //  * @returns {any[]}
  //  */
  transform(items: any[], searchText: string, type: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    if (type) {
      switch (type) {
        case 'client.name':
          return items.filter(it => {
            return it.name.toLocaleLowerCase().includes(searchText);
          });
        default:
          return items.filter(it => {
            return it.toLocaleLowerCase().includes(searchText);
          });
      }
    } else {
      return items.filter(it => {
        return it.toLocaleLowerCase().includes(searchText);
      });
    }
  }
}

@Pipe({ name: 'carOwnerFilter' })
export class CarOwnerPipe implements PipeTransform {
  // /**
  //  * Transform
  //  *
  //  * @param {any[]} items
  //  * @param {string} searchText
  //  * @returns {any[]}
  //  */
  transform(items: any[], searchText: string, type: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    if (type) {
      switch (type) {
        case 'car.owner':
          return items.filter(it => {
            return it.owner.toLocaleLowerCase().includes(searchText);
          });
        default:
          return items.filter(it => {
            return it.toLocaleLowerCase().includes(searchText);
          });
      }
    } else {
      return items.filter(it => {
        return it.toLocaleLowerCase().includes(searchText);
      });
    }
  }
}
