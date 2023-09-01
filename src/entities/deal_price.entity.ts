import BaseEntity from "@/entities/base.entity";
import { IDealPrice } from "@/interfaces/deal_price.interface";
import { unitTypes } from "@/const/unitTypes";

export default class DealPriceEntity extends BaseEntity implements IDealPrice {

    get type():string | null {
        return this._type;
    }

    get unitType (): unitTypes | null {
        return this._unitType;
    }

    private _type: string | null = null;
    private _unitType: unitTypes | null = null;
}