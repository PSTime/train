
export interface From {
  code: string;
  station: string;
  stationTrain: string;
  date: string;
  time: string;
  sortTime: number;
  srcDate: string;
}

export interface To {
  code: string;
  station: string;
  stationTrain: string;
  date: string;
  time: string;
  sortTime: number;
}

export interface Type {
  id: string;
  title: string;
  letter: string;
  places: number;
}

export interface Child {
  minDate: string;
  maxDate: string;
}

export interface List {
  num: string;
  category: number;
  travelTime: string;
  from: From;
  to: To;
  types: Type[];
  child: Child;
  allowStud: number;
  allowBooking: number;
  allowRoundtrip: number;
  isEurope: number;
}

export interface Data {
  list: List[];
}

export interface TrainResponse {
  data: Data;
}

export interface Watch {
  from: number;
  to: number;
  date: string;
  time: string;
  trains: string[];
}
