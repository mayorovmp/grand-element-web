export class Status {
  id?: number;
  description?: string;
  orderBy: number;
}

export enum StatusName {
  New = 1,
  Executed,
  OnTheWork,
  OnTheRoad,
  Incident,
}
