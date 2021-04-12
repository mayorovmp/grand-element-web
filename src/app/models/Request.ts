import { Car } from '@models/Car';
import { Product } from '@models/Product';
import { Address } from './Address';
import { Supplier } from './Supplier';
import { Client } from './Client';
import { CarCategory } from './CarCategory';
import { Status } from './Status';

export class Request {
  id?: number;
  client?: Client;
  product?: Product;
  deliveryAddress?: Address;
  supplier?: Supplier;
  car?: Car;
  amountOut?: number;
  amountComplete?: number;
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
  income?: number;
  profit?: number;
  reward = 0;
  supplierVat?: boolean;
  carVat?: boolean;
  carCategory?: CarCategory;
  status?: string;
  comment?: string;
  isLong?: boolean;
  statusId?: number;
  carId?: number;
  productId?: number;
  deliveryAddressId?: number;
  clientId?: number;
  carCategoryId?: number;
  supplierId?: number;
  requestStatus: Status;
  requestStatusId: number;
}

export interface LastRequest {
  clientId?: number;
  addressId?: number;
  productId?: number;
  supplierId?: number;
  carId?: number;
}
