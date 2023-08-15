import {ICrane} from "@/interfaces/crane.interace";
import {ICompany} from "@/interfaces/company.interface";

export default interface IObject {
    id: bigint | null;
    type: number | null;
    purposes: number[] | null;
    areaBuilding: number | null;
    areaField: number | null;
    floorArea: number | null;
    address: string | null;
    company: ICompany | null;
    photo: { src: string }[] | null;
    objectType: number[] | null;
    objectClass: string | null;
    areaMezanin: number | null;
    areaOffice: number | null;
    areaTech: number | null;
    floorsCount: number | null;
    facing: string | null;
    yearBuild: number | null;
    yearRepair: number | null;
    cadastralNumber: string | null;
    restrictions: boolean | null;
    ownType: string | null;
    landLength: number | null;
    landWidth: number | null;
    cadastralNumberLand: string | null;
    ownTypeLand: string | null;
    landCategory: string | null;
    landscapeType: string | null;
    ceilingHeight: number | null;
    gateType: string | null;
    floorType: string | null;

    powerValue: number | null;
    heating: boolean | null;
    water: boolean | null;
    sewage: boolean | null;
    gas: boolean | null;
    steam: boolean | null;
    internet: boolean | null;
    internetType: string | null;
    cranes: ICrane[] | null;
}
