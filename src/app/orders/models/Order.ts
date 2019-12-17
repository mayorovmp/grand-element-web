import { Client } from './Client';
import { Req } from './Request';

export class Order {
  constructor(
  public client: Client,
  public requests: Req[],
  public expanded: boolean) {}
}
