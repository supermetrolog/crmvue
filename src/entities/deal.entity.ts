import BaseEntity from "@/entities/base.entity";
import {IDeal} from "@/interfaces/deal.interface";
import {DealStatusList, TaxFormList} from "@/const/Const";
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


    get holidays(): boolean | null {
        return this.processBooleanField(this._holidays);
    }

    get deposit(): boolean | null {
        return this.processBooleanField(this._deposit);
    }

    get pledge(): boolean | null {
        return this.processBooleanField(this._pledge);
    }

    get is_exclusive(): boolean | null {
        return this.processBooleanField(this._is_exclusive);
    }

    get contract_is_signed(): boolean | null {
        return this.processBooleanField(this._contract_is_signed);
    }

    get commission_owner(): boolean | null {
        return this._commission_owner ? !!(this._commission_owner === 1) : null;
    }

    get commission_owner_type(): string | null {
        // return this._commission_owner_type;
        return "Деньгами(гарантированно)";
    }

    get commission_client(): boolean | null {
        return this._commission_client ? !!(this._commission_client === 1) : null;
    }

    get commission_agent(): boolean | null {
        return this._commission_agent ? !!(this._commission_agent === 1) : null;
    }

    get tax_form(): string | null {
        const taxStr = TaxFormList.find(el => el.value === this._tax_form)
        return taxStr ? taxStr.label : null;
    }

    public id: bigint | null = null;
    public price_opex_value: number | null = null;
    public price_public_services: number | null = null;
    public holidays_value_min: number | null = null;
    public holidays_value_max: number | null = null;
    public deposit_value: number | null = null;
    public commission_owner_value: number | null = null;
    public commission_client_value: number | null = null;
    public commission_agent_value: number | null = null;

    private _holidays: number | null = null;
    private _deposit: number | null = null;
    private _pledge: number | null = null;
    private _is_exclusive: number | null = null;
    private _contract_is_signed: number | null = null;
    private _commission_owner: number | null = null;
    private _commission_owner_type: number | null = null;
    private _tax_form: number | null = null;
    private _commission_client: number | null = null;
    private _commission_agent: number | null = null;
    private _company: Record<string, any> | null = null;
    private _dealTypeRecord: { title: string } | null = null;
    private _status_id: number | null = null;
}