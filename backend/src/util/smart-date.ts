import * as dateFns from "date-fns";

export class SmartDate {
  constructor(private date: Date) {}

  static of(date: Date) {
    return new SmartDate(date);
  }

  isBefore(date: Date) {
    return dateFns.isBefore(this.date, date);
  }

  isAfter(date: Date) {
    return dateFns.isAfter(this.date, date);
  }

  isSameOrBefore(date: Date) {
    return !this.isAfter(date);
  }

  isSameOrAfter(date: Date) {
    return !this.isBefore(date);
  }
}
