import BaseEntity from "@/entities/base.entity";
import { IRepresentative } from "@/interfaces/representative.interface";


export default class RepresentativeEntity extends BaseEntity implements IRepresentative{

    get name(): string | null {
        return this._name;
    }

    get  post(): string| null {
        return this._post;
    }

    
  
    private _name: string | null = null;
    private _post: string | null = null;
}

