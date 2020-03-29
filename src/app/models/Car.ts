import { CarCategory } from 'src/app/models/CarCategory';
export class Car {

  constructor(
    public id?: number,
    public owner?: string,
    public stateNumber?: string,
    public contacts?: string,
    public comments?: string,
    public freightPrice?: number,
    public carCategory?: CarCategory) {

    // this.carCategory = new CarCategory();
  }
}
