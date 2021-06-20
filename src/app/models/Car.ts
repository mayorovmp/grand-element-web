import { CarNumber } from '@models/CarNumber';
export class Car {
  id?: number;
  owner?: string;
  vat?: boolean;
  contacts?: string;
  carNumbers: CarNumber[] = [];
}