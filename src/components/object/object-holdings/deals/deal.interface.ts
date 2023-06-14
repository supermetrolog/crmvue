import { IProperty, IRange } from "@/types/property.interface";
import { ITradeOfferPropeties } from "../../trade-offer-tabs/tradeOfferTabs.interface";
import { unitTypes } from "@/const/unitTypes";
import { ITradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";

export interface IDeal {
  id: number;
  type: number;
  company: ICompany | null;
  area: IRange;
  price: IDealPrice;
  status: 1;
  floors: IFloor[];
  owner?: IOwner;
  builder?: IBuilder;
  consultant?: IConsultant;
  additionalDetails?: IAdditionalDetails;
  buildingInfo?: IBuildingInfo;
}

export interface IOwner {
  name: string;
  rating: number;
  contacts: number;
  requests: number;
  objects: number;
  representative: IRepresentative;
  phoneNumbers: string[];
}

interface IRepresentative {
  name: string;
  post: string;
}

interface IDealPrice extends IRange {
  unitType: unitTypes;
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
  parameters: ITradeOfferCharacteristics;
}

interface IBusiness {
  type: string;
  info: IProperty[];
}

interface IBuilder {
  name: string;
  duration: string;
  projectAvailability: boolean;
}

interface IConsultant {
  name: string;
  visitType: string;
}

interface ICompany {
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
