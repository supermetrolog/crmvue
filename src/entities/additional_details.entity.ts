import BaseEntity from "@/entities/base.entity";
import {IAdditionalDetails} from "@/interfaces/additional_details.interface"
import { IProperty } from "@/types/property.interface";
import { IBusiness } from "@/interfaces/business.inteface"
import BusinessEntity from "@/entities/business.entity";

export default class AdditionalDetailsEntity extends BaseEntity implements IAdditionalDetails {

    get taxForm(): number | null {
        return this._taxForm;
     }
   
     get exploitation(): boolean | null {
        return this.processBooleanField(this._exploitation);
    }

    get  communal(): boolean | null {
        return this.processBooleanField(this._communal);
    }

    get extraCosts(): IProperty[] | null {
        return this._extraCosts;
     }

     get specialTerms(): IProperty[] | null {
        return this._specialTerms;
     }


    get business(): IBusiness | null {
            if (this._business) {
                const business = new BusinessEntity();
                console.error(this._business, business);
                business.load(this._business);
                return business;
            }
            return null;
        }
     
     private _taxForm: number  | null = null;
     private _exploitation: boolean | null = null;
     private _communal: boolean | null = null;
     private _extraCosts: IProperty[] | null = null;
     private _specialTerms: IProperty[] | null = null;
     private _business: IBusiness | null = null;


    // taxForm: number;
    // exploitation: boolean;
    // communal: boolean;
    // extraCosts: IProperty[];
    // specialTerms: IProperty[];
    // business: IBusiness;
}