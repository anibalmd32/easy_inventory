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
  ENERO = 'enero',
  FEBRERO = 'febrero',
  MARZO = 'marzo',
  ABRIL = 'abril',
  MAYO = 'mayo',
  JUNIO = 'junio',
  JULIO = 'julio',
  AGOSTO = 'agosto',
  SEPTIEMBRE = 'septiembre',
  OBTUBRE = 'obtubre',
  NOMVIEMBRE = 'noviembre',
  DICIEMBRE = 'diciembre',
}

export enum DAYS {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
  DOMINGO = 'domingo',
}

export enum CHART_FOR {
  PAID = 'paid',
  CANCELED = 'canceled',
}
