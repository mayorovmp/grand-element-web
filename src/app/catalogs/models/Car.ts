import { CarCategory } from 'src/app/catalogs/models/CarCategory';
export class Car {

  constructor(
    public owner: string,
    public stateNumber: string,
    public contact: string,
    public comments: string,
    public carCategory: CarCategory) { }
}
