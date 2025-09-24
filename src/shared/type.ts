import { AlatType } from "./enum";

export type Alat = {
  name: string;
  detailName: string;
  id: string;
  startDate: string;
  battery: number;
  signal: number;
  data: number;
  status: string;
  note: string;
  jenis: AlatType;
};

export type AlatAWL = {
  name: string;
  detailName: string;
  stationName: string;
  id: string;
  startDate: string;
  battery: number;
  signal: number;
  data: number;
  status: string;
  note: string;
};

export type AlatAWS = {
  name: string;
  detailName: string;
  id: string;
  startDate: string;
  battery: number;
  signal: number;
  sensor: number;
  status: string;
};
