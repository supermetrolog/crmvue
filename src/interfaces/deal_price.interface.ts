import { IRange } from "@/types/property.interface";
import { unitTypes } from "@/const/unitTypes";

export interface IDealPrice extends IRange {
    unitType: unitTypes;
    type:string;
  }
  