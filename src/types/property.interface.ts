import { unitTypes } from "@/const/unitTypes";

export interface IRange {
  valueMin?: number | string;
  valueMax?: number | string;
  value?: number | string | boolean | null;
}

export interface IProperty extends IRange {
  label: string;
  unitType?: unitTypes;
}
