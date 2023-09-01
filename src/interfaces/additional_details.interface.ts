import { IProperty } from "@/types/property.interface";
import { IBusiness } from "@/interfaces/business.inteface";

export interface IAdditionalDetails {
    taxForm: number;
    exploitation: boolean;
    communal: boolean;
    extraCosts: IProperty[];
    specialTerms: IProperty[];
    business: IBusiness;
  }
  