import BaseEntity from "@/entities/base.entity";
import { IRange } from "@/types/property.interface";
import { IDeal } from "@/interfaces/deal.interface";
import { ICompany } from "@/interfaces/company.interface"
import { CompanyEntity } from "@/entities/company.entity";
import FloorsEntity from "@/entities/floors.entity"
import {IFloor} from "@/interfaces/floor.interface"
import { IOwner } from "@/interfaces/owner.interface";
import OwnerEntity from "@/entities/owner.entity";
import { IDealPrice } from "@/interfaces/deal_price.interface"
import DealPriceEntity from "@/entities/deal_price.entity";
import { IBuilder } from "@/interfaces/builder.interface";
import BuilderEntity from "@/entities/builder.entity";
import { IConsultant } from "@/interfaces/consultant.interface";
import ConsultantEntity from "@/entities/consultant.entity"
import { IAdditionalDetails } from "@/interfaces/additional_details.interface"
import AdditionalDetailsEntity from "@/entities/additional_details.entity";
import { IBuildingInfo } from "@/interfaces/building_info.interface"
import BuildingInfoEntity from "@/entities/building_info.entity";


export default class DealEntity extends BaseEntity implements IDeal {

    get id(): number | null {
        return this._id;
    }

    get type(): number | null {
        return this._type;
    }
    
    get company(): ICompany | null {
        if (this._company) {
            const company = new CompanyEntity();
            console.error(this._company, company);
            company.load(this._company);
            return company;
        }
        return null;
    }


    get area(): IRange | null {
        return this._area;
     }
   

    get price(): IDealPrice | null {
        if (this._price) {
            const price = new DealPriceEntity();
            console.error(this._price,  price);
            price.load(this._price);
            return price;
            }
            return null;
        }
    

    get status(): number | null {
        return this._status;
    }


    get floors(): IFloor[] | null {
        return this._floors ? this._floors.map((el => {
            const floor = new FloorsEntity();
            floor.load(el);
            return floor
        })) : null;
        }


    get owner(): IOwner | null {
        if (this._owner) {
            const owner = new OwnerEntity();
            console.error(this._owner, owner);
            owner.load(this._owner);
            return owner;
        }
        return null;
    }
    

    get builder(): IBuilder | null {
        if (this._builder) {
            const builder = new BuilderEntity();
            console.error(this._builder, builder);
            builder.load(this._builder);
            return builder;
        }
        return null;
    }

    

    get consultant(): IConsultant | null {
        if (this._consultant) {
            const consultant = new ConsultantEntity();
            console.error(this._consultant, consultant);
            consultant.load(this._consultant);
            return consultant;
        }
        return null;
    }



    get additionalDetails(): IAdditionalDetails | null {
            if (this._additionalDetails) {
                const additionalDetails = new AdditionalDetailsEntity();
                console.error(this._additionalDetails, additionalDetails);
                additionalDetails.load(this._additionalDetails);
                return additionalDetails;
            }
            return null;
        }
    

    // get buildingInfo(): IBuildingInfo | null {
    //     return this._buildingInfo;
    // }

    get buildingInfo(): IBuildingInfo | null {
        if (this._buildingInfo) {
            const buildingInfo = new BuildingInfoEntity();
            console.error(this._buildingInfo, buildingInfo);
            buildingInfo.load(this._buildingInfo);
            return buildingInfo;
        }
        return null;
    }




    // НЕ ЗНАЮ, ЧТО ИЗ ЭТОГО ДОЛЖНО БЫТЬ PUBLIC, А ЧТО - PRIVATE, ПОКА НАПИСАЛА ТАК
    public _id: number | null = null;
    private _type: number | null = null;
    private _company: ICompany | null = null;
    private _area: IRange | null = null;
    private _price: IDealPrice | null = null;
    private _status: number | null = null;
    private _floors: IFloor[] | null = null;
    private _owner: IOwner | null = null;
    private _builder: IBuilder | null = null;
    private _consultant: IConsultant | null = null;
    private _additionalDetails: IAdditionalDetails | null = null;
    private _buildingInfo: IBuildingInfo | null = null;
}