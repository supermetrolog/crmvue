import BaseEntity from "@/entities/base.entity";
import {ICompany} from "@/interfaces/company.interface";

export class CompanyEntity extends BaseEntity implements ICompany{
    public id: bigint | null = null;
    public full_name: string | null = null;
    public request_count: number | null = null;
    public offer_count: number | null = null;
    public object_count: number | null = null;
    public contacts_count: number | null = null;
    public rating: number | null = null;
}