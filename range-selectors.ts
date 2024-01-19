import DateRengeGetter from "./data-range-getter";
export interface SelectorRange {
  [key: string]: {
    title: string;
    handler: () => [Date, Date];
  }[];
}
export enum Tabs {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}
export enum TabsTitle {
  day = "День",
  week = "Неделя",
  month = "Месяц",
  year = "Год",
}
export const selectors: SelectorRange = {
  day: [
    { title: "Вчера", handler: DateRengeGetter.getYesterday },
    { title: "Сегодня", handler: DateRengeGetter.getToday },
    { title: "Завтра", handler: DateRengeGetter.getTomorrow },
  ],
  week: [
    { title: "Прошлая неделя", handler: DateRengeGetter.getLastWeek },
    { title: "Последние 7 дней", handler: DateRengeGetter.getLast7Days },
    {
      title: "С начала этой недели",
      handler: DateRengeGetter.getStartThisWeek,
    },
    { title: "Эта неделя", handler: DateRengeGetter.getThisWeek },
    { title: "До конца этой недели", handler: DateRengeGetter.getEndThisWeek },
    { title: "Следующая неделя", handler: DateRengeGetter.getNextWeek },
  ],
  month: [
    { title: "Прошлый месяц", handler: DateRengeGetter.getLastMonth },
    { title: "Месяц", handler: DateRengeGetter.getLastMonthRange },
    {
      title: "С начала этого месяца",
      handler: DateRengeGetter.getStartThisMonth,
    },
    { title: "Этот месяц", handler: DateRengeGetter.getThisMonth },
    {
      title: "До конца этого месяца",
      handler: DateRengeGetter.getEndThisMonth,
    },
    { title: "Следующий месяц", handler: DateRengeGetter.getNextMonth },
  ],
  year: [
    { title: "Прошлый год", handler: DateRengeGetter.getLastYear },
    { title: "С начала этого года", handler: DateRengeGetter.getStartThisYear },
    { title: "Этот год", handler: DateRengeGetter.getThisYear },
    { title: "До конца этого года", handler: DateRengeGetter.getEndThisYear },
    { title: "Следующий год", handler: DateRengeGetter.getNextYear },
  ],
};
