import BaseEntity from "@/entities/base.entity";
import {IFloor} from "@/interfaces/floor.interface"
import {ISection} from "@/interfaces/section.interface"
import {IRange} from "@/types/property.interface"

export default class FloorEntity extends BaseEntity implements IFloor {


    get name(): string | null {
        return this._name;
    }

    get area(): IRange | null {
        return this._area;
     }

    get checked(): boolean | null {
        return this.processBooleanField(this._checked);
    }

    get sections(): ISection []| null {
        return this._sections;
     }




    public _name: string | null = null;
    public _area: IRange | null = null;
    public _checked: boolean | null = null;
    public _sections: ISection[] | null = null;
}