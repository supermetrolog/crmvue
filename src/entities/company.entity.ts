import BaseEntity from "@/entities/base.entity";
import IContact from "@/interfaces/contact.interface";

export class CompanyEntity extends BaseEntity {
    public id: bigint | null = null;
    public full_name: string | null = null;
    public request_count: number | null = null;
    public offer_count: number | null = null;
    public object_count: number | null = null;
    public contacts_count: number | null = null;
    public mainContact: IContact|null = null;
}