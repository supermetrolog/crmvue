import { ICompany } from "@/interfaces/deal.interface"
import { IRange } from "@/types/property.interface"


export interface ISection {
    company: ICompany | null;
    area: IRange | null;
    status: number | null;
    checked: boolean | null;
  }