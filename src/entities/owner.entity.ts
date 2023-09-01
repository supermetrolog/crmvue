import BaseEntity from "@/entities/base.entity";
import { IOwner } from "@/interfaces/owner.interface";
import { IRepresentative } from "@/interfaces/representative.interface"
import { IPhone, IEmail } from "@/interfaces/contact.interface"



export default class OwnerEntity extends BaseEntity implements IOwner {

get company_id(): number | null{
    return this._company_id;
}

get name(): string | null{
    return this._name;
}
    
get rating(): number | null{
    return this._rating;
}
    
get contacts(): number | null{
    return this._contacts;
}

get requests(): number | null{
    return this._requests;
}

get objects(): number | null {
    return this._objects;
}


get  representative(): IRepresentative | null {
    return this._representative;
}

get phones(): IPhone[] | null {
    return this._phones;
}

get emails(): IEmail[]| null {
    return this._emails;
}



  
  private _company_id: number | null = null;
  private _name: string | null = null;
  private _rating: number | null = null;
  private _contacts: number | null = null;
  private _requests: number | null = null;
  private _objects: number | null = null;
  private _representative: IRepresentative| null = null;
  private _phones: IPhone[] | null = null;
  private _emails: IEmail[]  | null = null;

}