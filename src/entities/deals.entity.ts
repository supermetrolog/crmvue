import BaseEntity from "@/entities/base.entity";
import {
    IRange
} from "@/types/property.interface";
import {
    IDeal,
    ICompany,
    IDealPrice,
    IFloor,
    IOwner,
    IBuilder,
    IConsultant,
    IAdditionalDetails,
    IBuildingInfo
} from "@/interfaces/deal.interface";
import {
    CompanyEntity
} from "@/entities/company.entity";

export default class DealEntity extends BaseEntity implements IDeal {

    get id(): number | null {
        return this._id;
    }

    get type(): number | null {
        return this._type;
    }
    // CompanyEntity
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
    //     if (this._area) {
    //         const company = new IRange();
    //         console.error(this._company, company);
    //         company.load(this._company);
    //         return company;
    //     }
    //     return null;
    // }


    //   
    

    get price(): IDealPrice | null {
        return this._price
    }

    get status(): number | null {
        return this._status
    }

    get floors(): IFloor[] | null {
        // return this._floors ? this._floors.map((el => {
        //     const floor = new CraneEntity();
        //     floor.load(el);
        //     return floor
        // })) : null;

        return this._floors
    }

    // get cranes(): ICrane[] | null {
    //     return this._cranes ? this._cranes.map((el => {
    //         const crane = new CraneEntity();
    //         crane.load(el);
    //         return crane
    //     })) : null;
    // }

    get owner(): IOwner | null {
        return this._owner
    }

    get builder(): IBuilder | null {
        return this._builder
    }

    get consultant(): IConsultant | null {
        return this._consultant
    }

    get additionalDetails(): IAdditionalDetails | null {
        return this._additionalDetails
    }

    get buildingInfo(): IBuildingInfo | null {
        return this._buildingInfo
    }

    // НЕ ЗНАЮ, ЧТО ИЗ ЭТОГО ДОЛЖНО БЫТЬ PUBLIC, А ЧТО - PRIVATE, ПОКА НАПИСАЛА ТАК
    public _id: number | null = null;
    public _type: number | null = null;
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