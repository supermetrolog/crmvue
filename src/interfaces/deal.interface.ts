import {
  IProperty,
  IRange
} from "@/types/property.interface";
import {
  ITradeOfferParameters,
  ITradeOfferPropeties,
} from "../components/complex/trade-offer-tabs/tradeOfferTabs.interface";
import {
  unitTypes
} from "@/const/unitTypes";
import {
  IPhone,
  IEmail
} from "./contact.interface";

export interface IDeal {
  id: number | null;
  type: number | null;
  company: ICompany | null;
  area: IRange | null;
  price: IDealPrice | null;
  status: number | null;
  floors: IFloor[] | null;
  owner: IOwner | null;
  builder ? : IBuilder | null;
  consultant ? : IConsultant | null;
  additionalDetails: IAdditionalDetails | null;
  buildingInfo: IBuildingInfo | null;
}

export interface IOwner {
  company_id: number | null;
  name: string | null;
  rating: number | null;
  contacts: number | null;
  requests: number | null;
  objects: number | null ;
  representative: IRepresentative | null;
  phones: IPhone[] | null;
  emails: IEmail[] | null;
}


interface IRepresentative {
  name: string;
  post: string;
}

export interface IDealPrice extends IRange {
  unitType: unitTypes;
  type:string;
}

export interface IAdditionalDetails {
  taxForm: number;
  exploitation: boolean;
  communal: boolean;
  extraCosts: IProperty[];
  specialTerms: IProperty[];
  business: IBusiness;
}

export interface IBuildingInfo {
  area: ITradeOfferPropeties;
  price: ITradeOfferPropeties;
  parameters: ITradeOfferParameters;
}

interface IBusiness {
  type: string;
  info: IProperty[];
}

export interface IBuilder {
  name: string;
  duration: string;
  projectAvailability: boolean;
}

export interface IConsultant {
  name: string;
  visitType: string;
}

export interface ICompany {
  name: string;
}

export interface IFloor {
  name: string;
  area: IRange;
  checked: boolean;
  sections: ISection[];
}

export interface ISection {
  company: ICompany | null;
  area: IRange | null;
  status: number;
  checked: boolean | null;
}