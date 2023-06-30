import {
  ICharacterictic,
  ITradeOfferCharacteristics,
} from "@/const/tradeOfferCharacteristics";
import { IProperty, IRange } from "@/types/property.interface";

export interface ITradeOfferTabs {
  tradeOffers: ITradeOffer[];
}

export interface ITradeOffer {
  id: string;
  active: boolean;
  lastUpdate: Date;
  area: ITradeOfferPropeties;
  price: ITradeOfferPropeties;
  parameters: ITradeOfferParameters;
  status?: ITradeOfferStatus;
}

export interface ITradeOfferParameters {
  summary: ITradeOfferSummary;
  blocks: ITradeOfferBlock[];
}

export interface ITradeOfferSummary {
  parameters: ITradeOfferCharacteristics;
  description: string;
  plan_scheme: string[];
}

export interface ITradeOfferBlock {
  title: string;
  number: string;
  properties: ITradeOfferCharacteristics;
}

export interface ITradeOfferStatus {
  company: ITradeOfferCompany;
  date: Date;
  realtor: string;
  consultant: string;
}

export interface ITradeOfferCompany {
  name: string;
  organization_type: string;
}

export interface ITradeOfferPropeties {
  sum: IRange;
  properties: IProperty[];
}
