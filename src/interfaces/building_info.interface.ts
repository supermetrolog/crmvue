import {
    ITradeOfferParameters,
    ITradeOfferPropeties,
  } from "../components/complex/trade-offer-tabs/tradeOfferTabs.interface";
  

export interface IBuildingInfo {
    area: ITradeOfferPropeties;
    price: ITradeOfferPropeties;
    parameters: ITradeOfferParameters;
  }
  