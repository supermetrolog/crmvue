import { IRange } from "@/types/property.interface";
import { IFloor } from "@/interfaces/floor.interface"
import { IOwner } from "@/interfaces/owner.interface";
import { IDealPrice } from "@/interfaces/deal_price.interface";
import { IBuilder } from "@/interfaces/builder.interface";
import { IConsultant } from "@/interfaces/consultant.interface";
import { ICompany } from "@/interfaces/company.interface";
import { IAdditionalDetails } from "@/interfaces/additional_details.interface"
import { IBuildingInfo } from "@/interfaces/building_info.interface"


export interface IDeal {
  id: number | null;
  type: number | null;
  company: ICompany | null;
  area: IRange | null;
  price: IDealPrice | null;
  status: number | null;
  floors: IFloor[] | null;
  owner: IOwner | null;
  builder ? : IBuilder | null;
  consultant ? : IConsultant | null;
  additionalDetails: IAdditionalDetails | null;
  buildingInfo: IBuildingInfo | null;
}




