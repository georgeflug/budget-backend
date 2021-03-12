import * as dateFns from "date-fns";

export class SmartDate {
  constructor(private date: Date) {}

  static of(date: Date): SmartDate {
    return new SmartDate(date);
  }

  isBefore(date: Date): boolean {
    return dateFns.isBefore(this.date, date);
  }

  isAfter(date: Date): boolean {
    return dateFns.isAfter(this.date, date);
  }

  isSameOrBefore(date: Date): boolean {
    return !this.isAfter(date);
  }

  isSameOrAfter(date: Date): boolean {
    return !this.isBefore(date);
  }
}
