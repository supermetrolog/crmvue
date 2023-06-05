export interface ITradeOfferTabs {
  tradeOffers: ITradeOffer[];
}

export interface ITradeOffer {
  id: string;
  active: boolean;
  lastUpdate: Date;
  area: ITradeOfferPropeties;
  price: ITradeOfferPropeties;
  status?: ITradeOfferStatus;
}

interface IRange {
  valueMin: number | string;
  valueMax: number | string;
}

export interface IProperty extends IRange {
  label: string;
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
