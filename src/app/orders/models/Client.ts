import { Req } from './Request';

export class Client {
  constructor(
  public name: string,
  public address: string,
  public dist: string,
  public expanded: boolean) {}
}
