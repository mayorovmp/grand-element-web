import { Product } from 'src/app/models/Product';

export class Supplier {
  id?: number;
  name: string;
  legalEntity: string; // Юр. лицо
  address: string;
  vat: boolean;
  products: Product[] = [];
}
