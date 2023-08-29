import BaseEntity from "@/entities/base.entity";
import { IDeal } from "@/interfaces/deal.interface";
//import { unitTypes } from "@/const/unitTypes";
//import { tradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import { IRange } from "@/types/property.interface";
//import { ITradeOfferParameters, ITradeOfferPropeties } from "../components/complex/trade-offer-tabs/tradeOfferTabs.interface";
//import { IPhone, IEmail } from "@/interfaces/contact.interface";
import { ICompany, IDealPrice, IFloor, IOwner, IBuilder, IConsultant, IAdditionalDetails, IBuildingInfo } from "@/interfaces/deal.interface";


export default class DealEntity extends BaseEntity implements IDeal {
    get id(): number | null {
        return this._id;
    }

    get type(): number | null {
        return this._type;
    }

    get company(): ICompany | null {
        return this._company;
    }

    get area(): IRange | null {
        return this._area;
    }

    get price(): IDealPrice | null {
        return this._price
    }

    get status(): number | null {
        return this._status
    }
    
    get floors(): IFloor[] | null{
        return this._floors
    }
    
    get owner(): IOwner | null {
         return this._owner
    }
    
    get  builder(): IBuilder | null {
       return this._builder
    }
   
    get consultant(): IConsultant | null {
        return this._consultant
    }
   
    get additionalDetails(): IAdditionalDetails | null {
        return this._additionalDetails
    }
    
    get buildingInfo(): IBuildingInfo | null{
        return this._buildingInfo
    }

// НЕ ЗНАЮ, ЧТО ИЗ ЭТОГО ДОЛЖНО БЫТЬ PUBLIC, А ЧТО - PRIVATE, ПОКА НАПИСАЛА ТАК
    public _id: number | null = null;
    public _type: number | null = null;
    public _company: ICompany  | null = null;
    public _area: IRange | null = null;
    public _price: IDealPrice | null = null;
    public _status: number | null = null;
    public _floors: IFloor[]  | null = null;
    public _owner: IOwner | null = null;
    public _builder: IBuilder  | null = null;
    public _consultant: IConsultant | null = null;
    public _additionalDetails: IAdditionalDetails| null = null;
    public _buildingInfo: IBuildingInfo | null = null;
}