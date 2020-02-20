import { Contact } from './Contact';

export class Address {
  id?: number;
  name?: string;
  contacts: Contact[] = [];
}
