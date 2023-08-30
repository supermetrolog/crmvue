import { ISection } from "@/interfaces/section.interface"
import { IRange } from "@/types/property.interface"



export interface IFloor {
    name: string | null;
    area: IRange | null;
    checked: boolean | null;
    sections: ISection[] | null;
  }