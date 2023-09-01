import IObject from "@/interfaces/object.interface";
//import {IDeal} from "@/interfaces/deal.interface";

export default interface IComplex {
    id: number | null;
    name: string | null;
    consultantName: string | null;
    lastUpdatedAt: string | null;
    createdAt: string | null;
    region: IAddressItem | null;
    district: IAddressItem | null;
    direction: IAddressItem | null;
    locality: IAddressItem | null;
    highway: IAddressItem | null;
    metro: IAddressItem | null;
    getMetroLogoName: () => string | null;
    districtMoscow: IAddressItem | null;
    fromMkad: number | null;
    areaFieldFull: number | null;
    areaBuilding: number | null;
    areaFloorFull: number | null;
    areaOfficeFull: number | null;
    areaTechFull: number | null;
    managmentCompany: boolean | null;
    managmentCompanyValue: string | null;
    power: boolean | null;
    powerValue: number | null;
    heating: boolean | null;
    heatingAutonomous: boolean | null;
    heatingAutonomousType: string | null;
    water: boolean | null;
    waterType: string[] | null;
    waterValue: number | null;
    sewage: boolean | null;
    sewageRain: boolean | null;
    gas: boolean | null;
    gasValue: number | null;
    gasType: string | null;
    steam: boolean | null;
    steamValue: number | null;
    phoneLine: boolean | null;
    internet: boolean | null;
    internetType: string[] | null;
    latitude: number | null;
    longitude: number | null;
    fenceAroundPerimeter: boolean | null;
    guard: boolean | null;
    guardType: string[] | null;
    videoControl: boolean | null;
    accessControl: boolean | null;
    securityAlert: boolean | null;
    fireAlert: boolean | null;
    barrier: boolean | null;
    railway: boolean | null;
    entryTerritory: boolean | null;
    entryTerritoryType: string | null;
    parkingCar: boolean | null;
    parkingCarType: string | null;
    parkingLorry: boolean | null;
    parkingLorryType: string | null;
    parkingTruck: boolean | null;
    parkingTruckType: string | null;
    canteen: boolean | null;
    hostel: boolean | null;
    entryFee: string | null;
    objects: IObject[] | null;
    //deals:IDeal[]|null;
}

export interface IAddressItem {
    title: string;
    type?: string
}
