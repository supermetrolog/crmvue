import BaseEntity from "@/entities/base.entity";
import { IBusiness } from "@/interfaces/business.inteface";
import { IProperty } from "@/types/property.interface";

export default class BusinessEntity extends BaseEntity implements IBusiness {

    get type(): string | null {
        return this._type;
     }

     get info(): IProperty[] | null {
        return this._info;
     }


     private _type: string | null = null;
     private _info: IProperty[] | null = null;
}