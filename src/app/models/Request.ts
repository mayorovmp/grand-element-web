import { Car } from 'src/app/models/Car';
import { Product } from 'src/app/models/Product';
import { Address } from './Address';
import { Supplier } from './Supplier';
import { Client } from './Client';


export class Request {
  id?: number;
  product?: Product;
  deliveryAddress?: Address;
  supplier?: Supplier;
  amount?: number;
  deliveryStart?: Date;
  deliveryEnd?: Date;
  purchasePrice?: number;
  sellingPrice?: number;
  freightPrice?: number;
  unit?: string;
  freightCost?: number;
  profit?: number;
  client?: Client;
  car?: Car;
  status?: string;
}
