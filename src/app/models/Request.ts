import { Car } from 'src/app/models/Car';
import { Product } from 'src/app/models/Product';
import { Address } from './Address';
import { Supplier } from './Supplier';
import { Client } from './Client';
import { CarCategory } from './CarCategory';


export class Request {
  id?: number;
  client?: Client;
  product?: Product;
  deliveryAddress?: Address;
  supplier?: Supplier;
  car?: Car;
  amountOut?: number;
  amountIn?: number;
  amount?: number;
  deliveryStart?: Date = new Date();
  deliveryEnd?: Date = new Date();
  purchasePrice?: number;
  sellingPrice?: number;
  freightPrice?: number;
  unit?: string;
  freightCost?: number;
  sellingCost?: number;
  profit?: number;
  reward?: number;
  carCategory?: CarCategory;
  status?: string;
  comment?: string;
  isLong?: number;
}
