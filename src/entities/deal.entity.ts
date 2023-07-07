import BaseEntity from "@/entities/base.entity";
import {IDeal} from "@/interfaces/deal.interface";
import {DealStatusList} from "@/const/Const";
import {CompanyEntity} from "@/entities/company.entity";
import {ICompany} from "@/interfaces/company.interface";

export class DealEntity extends BaseEntity implements IDeal {
    get company(): ICompany | null {
        if (this._company) {
            const company = new CompanyEntity();
            company.load(this._company);
            return company;
        }
        return null;
    }

    get deal_type(): string | null {
        return this._dealTypeRecord ? this._dealTypeRecord.title : null;
    }

    get status(): string | null {
        return this._status_id ? DealStatusList[this._status_id] : null;
    }

    public id: bigint | null = null;

    private _company: Record<string, any> | null = null;
    private _dealTypeRecord: {title: string} | null = null;
    private _status_id: number | null = null;
}