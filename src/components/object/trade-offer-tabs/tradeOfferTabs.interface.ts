export interface ITradeOfferTabs {
  tradeOffers: ITradeOffer[];
}

export interface ITradeOffer {
  id: string;
  active: boolean;
  lastUpdate: Date;
  area: ITradeOfferTable;
  price: ITradeOfferTable;
  status?: IStatus;
}

interface IRange {
  valueMin: number | string;
  valueMax: number | string;
}

interface IProperty extends IRange {
  label: string;
}

interface IStatus {
  company: ICompany;
  date: Date;
  realtor: string;
  consultant: string;
}

interface ICompany {
  name: string;
  organization_type: string;
}

interface ITradeOfferTable {
  sum: IRange;
  properties: IProperty[];
}
