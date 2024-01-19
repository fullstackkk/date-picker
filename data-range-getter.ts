class DateRengeGetter {
  constructor(private date: Date) {}

  // функция возвращает вчерашний день
  public static getYesterday(): [Date, Date] {
    const date = new Date(new Date().setDate(new Date().getDate() - 1));
    return [date, date];
  }
  // функция возвращает сегодняшний день
  public static getToday(): [Date, Date] {
    const date = new Date();
    return [date, date];
  }
  // функция возвращает завтрашний день
  public static getTomorrow(): [Date, Date] {
    const date = new Date(new Date().setDate(new Date().getDate() + 1));
    return [date, date];
  }

  // функция возвращает прошлую неделю
  public static getLastWeek(): [Date, Date] {
    const today = new Date(); // текущая дата
    const dayOfWeek = today.getDay(); // день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + 7; // разница в днях между текущим днем и понедельником прошлой недели + 7 дней
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - diff
    ); // понедельник прошлой недели
    const sunday = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + 6
    ); // воскресенье прошлой недели
    return [monday, sunday];
  }
  // функция возвращает последние 7 дней
  public static getLast7Days(): [Date, Date] {
    const date = new Date(new Date().setDate(new Date().getDate() - 7));
    return [date, new Date()];
  }
  // функция возвращает с начала этой недели
  public static getStartThisWeek(): [Date, Date] {
    const today = new Date(); // текущая дата
    const dayOfWeek = today.getDay(); // день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // разница в днях между текущим днем и понедельником текущей недели
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - diff
    ); // понедельник текущей недели
    return [monday, today];
  }
  // функция возвращает эту неделю
  public static getThisWeek(): [Date, Date] {
    const today = new Date(); // текущая дата
    const dayOfWeek = today.getDay(); // день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const diffStart = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // разница в днях между текущим днем и понедельником текущей недели
    const diffEnd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // разница в днях между текущим днем и воскресеньем текущей недели
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - diffStart
    ); // понедельник текущей недели
    const sunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + diffEnd
    ); // воскресенье текущей недели
    return [monday, sunday];
  }
  // функция возвращает до конца этой недели
  public static getEndThisWeek(): [Date, Date] {
    const today = new Date(); // текущая дата
    const dayOfWeek = today.getDay(); // день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const diffEnd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // разница в днях между текущим днем и воскресеньем текущей недели
    const sunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + diffEnd
    ); // воскресенье текущей недели
    return [today, sunday];
  }
  // функция возвращает следующую неделю
  public static getNextWeek(): [Date, Date] {
    const today = new Date(); // текущая дата
    const dayOfWeek = today.getDay(); // день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const diffStart = 8 - dayOfWeek; // разница в днях между понедельником следующей недели и текущим днем
    const diffEnd = 14 - dayOfWeek; // разница в днях между воскресеньем следующей недели и текущим днем
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + diffStart
    ); // понедельник следующей недели
    const sunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + diffEnd
    ); // воскресенье следующей недели
    return [monday, sunday];
  }

  // функция возвращает прошлый месяц
  public static getLastMonth(): [Date, Date] {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    return [lastMonth, lastMonthLastDay];
  }
  // функция возвращает последние 30 дней (на самом деле 31 иногда 28/29)
  public static getLastMonthRange(): [Date, Date] {
    const today = new Date(); // текущая дата
    const lastMonthDay = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    ); // дата соответствующая сегодняшнему дню прошлого месяца
    return [lastMonthDay, today];
  }
  // функция возвращает с начала этого месяца
  public static getStartThisMonth(): [Date, Date] {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return [lastMonth, today];
  }
  // функция возвращает этот месяц
  public static getThisMonth(): [Date, Date] {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    return [lastMonth, lastMonthLastDay];
  }
  // функция возвращает до конца этого месяца
  public static getEndThisMonth(): [Date, Date] {
    const today = new Date();
    const lastMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    return [today, lastMonthLastDay];
  }
  // функция возвращает следующий месяц
  public static getNextMonth(): [Date, Date] {
    const today = new Date(); // текущая дата
    const nextMonthFirstDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    ); // первое число следующего месяца
    const nextMonthLastDate = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    ); // последнее число следующего месяца
    return [nextMonthFirstDate, nextMonthLastDate];
  }

  // функция возвращает прошлый год
  public static getLastYear(): [Date, Date] {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, 0, 1);
    const lastYearLastDay = new Date(today.getFullYear(), 0, 0);

    return [lastYear, lastYearLastDay];
  }
  // функция возвращает с начала этого года
  public static getStartThisYear(): [Date, Date] {
    const today = new Date();
    const lastYear = new Date(today.getFullYear(), 0, 1);

    return [lastYear, today];
  }
  // функция возвращает этот год
  public static getThisYear(): [Date, Date] {
    const today = new Date();
    const lastYear = new Date(today.getFullYear(), 0, 1);
    const lastYearLastDay = new Date(today.getFullYear() + 1, 0, 0);

    return [lastYear, lastYearLastDay];
  }
  // функция возвращает до конца этого года
  public static getEndThisYear(): [Date, Date] {
    const today = new Date();
    const lastYearLastDay = new Date(today.getFullYear() + 1, 0, 0);

    return [today, lastYearLastDay];
  }
  // функция возвращает следующий год
  public static getNextYear(): [Date, Date] {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() + 1, 0, 1);
    const lastYearLastDay = new Date(today.getFullYear() + 2, 0, 0);

    return [lastYear, lastYearLastDay];
  }
}

export default DateRengeGetter;
