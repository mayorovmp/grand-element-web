import { CarCategory } from '@models/CarCategory';
export class Car {
  constructor(
    public id?: number,
    public owner?: string,
    public unit?: string,
    public vat?: boolean,
    public contacts?: string,
    public comments?: string,
    public freightPrice?: number,
    public carCategory?: CarCategory
  ) {
    // this.carCategory = new CarCategory();
  }
}
