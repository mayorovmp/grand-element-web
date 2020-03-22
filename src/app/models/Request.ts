import { Car } from 'src/app/models/Car';
import { Product } from 'src/app/models/Product';
import { Address } from './Address';
import { Supplier } from './Supplier';
import { Client } from './Client';
import { CarCategory } from './CarCategory';


export class Request {
  id?: number;
  product?: Product;
  deliveryAddress?: Address;
  supplier?: Supplier;
  amountOut?: number;
  amountIn?: number;
  deliveryStart?: Date = new Date();
  deliveryEnd?: Date = new Date();
  purchasePrice?: number;
  sellingPrice?: number;
  freightPrice?: number;
  unit?: string;
  freightCost?: number;
  profit?: number;
  client?: Client;
  carCategory?: CarCategory;
  car?: Car;
  status?: string;
}
