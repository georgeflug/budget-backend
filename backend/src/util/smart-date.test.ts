import { SmartDate } from "./smart-date";

describe("Smart Date", () => {

  it('isBefore', () => {
    const date1 = new Date(1);
    const date2 = new Date(2);

    const result1 = SmartDate.of(date1).isBefore(date2);
    const result2 = SmartDate.of(date2).isBefore(date1);
    const result3 = SmartDate.of(date1).isBefore(date1);

    expect(result1).toEqual(true);
    expect(result2).toEqual(false);
    expect(result3).toEqual(false);
  });

  it('isAfter', () => {
    const date1 = new Date(1);
    const date2 = new Date(2);

    const result1 = SmartDate.of(date1).isAfter(date2);
    const result2 = SmartDate.of(date2).isAfter(date1);
    const result3 = SmartDate.of(date1).isAfter(date1);

    expect(result1).toEqual(false);
    expect(result2).toEqual(true);
    expect(result3).toEqual(false);
  });

  it('isSameOrBefore', () => {
    const date1 = new Date(1);
    const date2 = new Date(2);

    const result1 = SmartDate.of(date1).isSameOrBefore(date2);
    const result2 = SmartDate.of(date2).isSameOrBefore(date1);
    const result3 = SmartDate.of(date1).isSameOrBefore(date1);

    expect(result1).toEqual(true);
    expect(result2).toEqual(false);
    expect(result3).toEqual(true);
  });

  it('isSameOrAfter', () => {
    const date1 = new Date(1);
    const date2 = new Date(2);

    const result1 = SmartDate.of(date1).isSameOrAfter(date2);
    const result2 = SmartDate.of(date2).isSameOrAfter(date1);
    const result3 = SmartDate.of(date1).isSameOrAfter(date1);

    expect(result1).toEqual(false);
    expect(result2).toEqual(true);
    expect(result3).toEqual(true);
  });

});
