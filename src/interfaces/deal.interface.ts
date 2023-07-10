import {ICompany} from "@/interfaces/company.interface";

export interface IDeal {
    id: bigint | null;
    company: ICompany | null;
    deal_type: string | null;
    status: string | null;
    price_opex_value: number | null;
    price_public_services: number | null;
    holidays: boolean | null;
    holidays_value_min: number | null;
    holidays_value_max: number | null;
    deposit: boolean | null;
    deposit_value: number | null;
    pledge: boolean | null;
    is_exclusive: boolean | null;
    contract_is_signed: boolean | null;
    commission_owner: boolean | null;
    commission_owner_value: number | null;
    commission_owner_type: string | null;
    commission_client: boolean | null;
    commission_client_value: number | null;
    commission_agent: boolean | null;
    commission_agent_value: number | null;
    tax_form: string | null;

}