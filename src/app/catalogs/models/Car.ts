import { CarCategory } from 'src/app/catalogs/models/CarCategory';
export class Car {

  constructor(
    public id: number,
    public owner: string,
    public stateNumber: string,
    public contacts: string,
    public comments: string,
    public carCategory?: CarCategory) { }
}
