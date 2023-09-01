import BaseEntity from "@/entities/base.entity";
import IContact from "@/interfaces/contact.interface";
import { ICompany } from "@/interfaces/company.interface";

export class CompanyEntity extends BaseEntity implements ICompany {

    get id(): number | null {
        return this._id;
    }

    get full_name(): string | null {
        return this._full_name;
    }

    get request_count(): number  | null {
        return this._request_count;
    }

    get offer_count(): number | null {
        return this._offer_count;
    }

    get object_count(): number | null {
        return this._object_count;
    }

    get contacts_count(): number | null {
        return this._contacts_count;
    }

    get mainContact(): IContact | null {
        return this._mainContact;
    }




private _id: number | null = null;
private _full_name: string | null = null;
private _request_count: number | null = null;
private _offer_count: number | null = null;
private _object_count: number | null = null;
private _contacts_count: number | null = null;
private _mainContact: IContact | null = null;


    // public id: bigint | null = null;
    // public full_name: string | null = null;
    // public request_count: number | null = null;
    // public offer_count: number | null = null;
    // public object_count: number | null = null;
    // public contacts_count: number | null = null;
    // public mainContact: IContact|null = null;
}