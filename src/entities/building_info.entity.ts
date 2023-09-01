import BaseEntity from "@/entities/base.entity";
import { IBuildingInfo } from "@/interfaces/building_info.interface";
import { ITradeOfferParameters,
       ITradeOfferPropeties 
    } from "../components/complex/trade-offer-tabs/tradeOfferTabs.interface";
  

export default class BuildingInfoEntity extends BaseEntity implements IBuildingInfo {
    
    get area(): ITradeOfferPropeties | null {
        return this._area;
    }

    get price(): ITradeOfferPropeties | null {
        return this._price;
    }

    get parameters(): ITradeOfferParameters | null {
        return this._parameters;
    }


    private _area: ITradeOfferPropeties | null = null;
    private _price: ITradeOfferPropeties | null = null;
    private _parameters: ITradeOfferParameters | null = null;
        // area: ITradeOfferPropeties;
        // price: ITradeOfferPropeties;
        // parameters: ITradeOfferParameters;

}