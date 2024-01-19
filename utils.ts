export interface dayCellItem {
  date: number;
  month: number;
  year: number;
  isCurrentMonth?: boolean;
  isCurrentDay?: boolean;
  isDayOff?: boolean;
  dayOffTheWeek?: number;
}

const VISIBLE_CELL_AMOUNT = 42;
export const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
export const week = ["П", "В", "С", "Ч", "П", "С", "В"];
export const weekFull = [ "Вс","Пн","Вт", "Ср", "Чт", "Пт", "Сб", ];
export const validValueRegex = /^\d{2}\.\d{2}\.\d{4}$/;
const sundayWeekToMondayWeekMap: Record<number, number> = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

function getDayOfTheWeek(date: Date) {
  const day = date.getDay();
  return sundayWeekToMondayWeekMap[day];
}
export function getDaysAmountInAMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
export function getPreviousMonthDays(year: number, month: number) {
  const currentMonthFirstDay = new Date(year, month, 1);
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay);

  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month - 1);
  const cells: dayCellItem[] = [];

  const [cellYear, cellMonth] =
    month === 0 ? [year - 1, 11] : [year, month - 1];

  for (let i = prevMonthCellsAmount - 1; i >= 0; i--)
    cells.push({
      date: daysAmountInPrevMonth - i,
      month: cellMonth,
      year: cellYear,
      isCurrentMonth: false,
      isCurrentDay: false,
      dayOffTheWeek: getDayOfTheWeek(new Date(cellYear, cellMonth, i)),
    });
  return cells;
}
export function getNextMonthDays(year: number, month: number) {
  const currentMonthFirstDay = new Date(year, month, 1);
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay);

  const daysAmount = getDaysAmountInAMonth(year, month);

  const nextMonthDays = VISIBLE_CELL_AMOUNT - daysAmount - prevMonthCellsAmount;

  const [cellYear, cellMonth] =
    month === 11 ? [year + 1, 11] : [year, month + 1];

  const cells: dayCellItem[] = [];
  for (let i = 1; i <= nextMonthDays; i++) {
    cells.push({
      date: i,
      month: cellMonth,
      year: cellYear,
      isCurrentMonth: false,
      isCurrentDay: false,
      dayOffTheWeek: getDayOfTheWeek(new Date(cellYear, cellMonth, i)),
    });
  }
  return cells;
}
export function getCurrentMonthDays(
  year: number,
  month: number,
  numberOfdays: number
) {
  const cells: dayCellItem[] = [];
  for (let i = 1; i <= numberOfdays; i++) {
    const day = new Date(year, month, i).getDay();
    cells.push({
      date: i,
      month,
      year,
      isCurrentMonth: true,
      isCurrentDay: false,
      isDayOff: day === 0 || day === 6,
      dayOffTheWeek: getDayOfTheWeek(new Date(year, month, i)),
    });
  }
  return cells;
}
export function isValidDateString(value) {
  if (!validValueRegex.test(value.trim())) {
    return false;
  }
  const [day, month, year] = value.split(".").map((v) => parseInt(v, 10));
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }
  const maxDaysInAMonth = getDaysAmountInAMonth(year, month - 1);

  if (day > maxDaysInAMonth) {
    return false;
  }
  return true;
}
export function isInRange(cell: dayCellItem, min: Date, max: Date) {
  if (!min && !max) return true;

  if (min && max) {
    return isSmallerThanDate(cell, max) && isBiggerThanDate(cell, min);
  }
  if (min) {
    return isBiggerThanDate(cell, min);
  }
  if (max) {
    return isSmallerThanDate(cell, max);
  }
}
function isBiggerThanDate(cell: dayCellItem, date: Date) {
  if (cell.year > date.getFullYear()) {
    return true;
  }
  if (cell.year < date.getFullYear()) {
    return false;
  }

  if (cell.month > date.getMonth()) {
    return true;
  }
  if (cell.month < date.getMonth()) {
    return false;
  }

  return cell.date >= date.getDate();
}
function isSmallerThanDate(cell: dayCellItem, date: Date) {
  if (cell.year > date.getFullYear()) {
    return false;
  }
  if (cell.year < date.getFullYear()) {
    return true;
  }

  if (cell.month > date.getMonth()) {
    return false;
  }
  if (cell.month < date.getMonth()) {
    return true;
  }

  return cell.date <= date.getDate();
}

export function getDateLitePicker(date?: Date): dayCellItem[] {
  const dateArray: dayCellItem[] = [];
  const today = date || new Date();

  // Add previous 6 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dateArray.push({
      date: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      isCurrentMonth: date.getMonth() === today.getMonth(),
      isCurrentDay: date.toDateString() === today.toDateString(),
      isDayOff: date.getDay() === 0 || date.getDay() === 6,
      dayOffTheWeek: date.getDay()
    });
  }

  // Add next 12 days
  for (let i = 1; i <= 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dateArray.push({
      date: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      isCurrentMonth: date.getMonth() === today.getMonth(),
      isCurrentDay: date.toDateString() === today.toDateString(),
      isDayOff: date.getDay() === 0 || date.getDay() === 6,
      dayOffTheWeek: date.getDay()
    });
  }

  return dateArray;
}
 

