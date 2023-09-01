import BaseEntity from "@/entities/base.entity";
import { IBuilder } from "@/interfaces/builder.interface";

export default class BuilderEntity extends BaseEntity implements  IBuilder {

    get name(): string | null {
        return this._name;
    }

    get duration(): string | null {
        return this._duration;
    }

    get projectAvailability(): boolean | null {
        return this.processBooleanField(this._projectAvailability);
    }
   
    private _name: string | null = null;
    private _duration: string| null = null;
    private _projectAvailability: boolean | null = null;
}