import {ICompany} from "@/interfaces/company.interface";

export interface IDeal {
    id: bigint | null;
    company: ICompany | null;
    deal_type: string | null;
    status: string | null;
}