export enum APP_ACTIONS {
  ADD,
  REMOVE,
  SELL,
  UPDATE,
  SELECT,
  UNSELECT,
  BUY,
  CANCEL,
  PAY,
  DELETE,
}

export enum INVOICE_STATUS {
  PAID = 1,
  PENDING = 2,
  CANCELED = 3,
}

export enum FETCH_STATUS {
  LOADING,
  SUCCESS,
  ERROR,
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum TRENDING {
  UP = 1,
  DOWN = 2,
}

export enum MONTHS {
  JANUARY = 'enero',
  FEBRUARY = 'febrero',
  MARCH = 'marzo',
  APRIL = 'abril',
  MAY = 'mayo',
  JUNE = 'junio',
  JULY = 'julio',
  AUGUST = 'agosto',
  SEPTEMBER = 'septiembre',
  OCTOBER = 'octubre',
  NOVEMBER = 'noviembre',
  DECEMBER = 'diciembre',
}


export enum DAYS {
  MONDAY = 'lunes',
  TUESDAY = 'martes',
  WEDNESDAY = 'miércoles',
  THURSDAY = 'jueves',
  FRIDAY = 'viernes',
  SATURDAY = 'sábado',
  SUNDAY = 'domingo',
}


export enum CHART_FOR {
  PAID = 'paid',
  CANCELED = 'canceled',
}
