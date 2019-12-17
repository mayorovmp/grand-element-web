import { Car } from './Car';

export class Req {
  constructor(
  public product: string,
  public quantity: string,
  public startDate: string,
  public endDate: string,
  public status: string,
  public time: string,
  public cars: Car[],
  public expanded: boolean) {}
}
