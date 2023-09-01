import { IRepresentative } from "@/interfaces/representative.interface"
import {IPhone, IEmail } from "@/interfaces/contact.interface"


export interface IOwner {
    company_id: number | null;
    name: string | null;
    rating: number | null;
    contacts: number | null;
    requests: number | null;
    objects: number | null ;
    representative: IRepresentative | null;
    phones: IPhone[] | null;
    emails: IEmail[] | null;
  }