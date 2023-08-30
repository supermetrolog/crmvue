import BaseEntity from "@/entities/base.entity";
import { ISection } from "@/interfaces/section.interface"
import { ICompany } from "@/interfaces/deal.interface"
import {IRange} from "@/types/property.interface"
import { CompanyEntity } from "@/entities/company.entity";


export default class SectionEntity extends BaseEntity implements ISection {

   
// get company(): ICompany| null {
//     return this._company;
// }

get company(): ICompany | null {
    if (this._company) {
        const company = new CompanyEntity();
        console.error(this._company, company);
        company.load(this._company);
        return company;
    }
    return null;
}


get area(): IRange | null {
    return this._area;
 }

 get status(): number | null {
    return this._status;
 }

get checked(): boolean | null {
    return this.processBooleanField(this._checked);
}



 private _company: ICompany | null = null;
 private _area: IRange | null = null;
 private _status: number | null = null;
 private _checked: boolean | null = null;
 

}