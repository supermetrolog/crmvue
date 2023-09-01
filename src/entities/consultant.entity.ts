import BaseEntity from "@/entities/base.entity";
import { IConsultant } from "@/interfaces/consultant.interface"

export default class ConsultantEntity extends BaseEntity implements IConsultant {

    get name(): string | null {
        return this._name;
    }

    get visitType(): string | null {
        return this._visitType;
    }


    private _name: string | null = null;
    private _visitType: string| null = null;
    
}