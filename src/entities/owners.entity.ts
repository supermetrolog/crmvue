import BaseEntity from "@/entities/base.entity";
import {IOwnersContacts}  from "@/interfaces/owners.interface";

export default class OwnersEntity extends BaseEntity implements IOwnersContacts {
    
    id: bigint |null = null;
    name: string | null = null;
    phones: string[]|null = null;
    emails:string[]| null = null;
   
}
// export class CompanyEntity extends BaseEntity implements ICompany{
//     public id: bigint | null = null;
//     public full_name: string | null = null;
//     public request_count: number | null = null;
//     public offer_count: number | null = null;
//     public object_count: number | null = null;
//     public contacts_count: number | null = null;
// }