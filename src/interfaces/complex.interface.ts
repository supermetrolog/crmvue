import IObject from "@/interfaces/object.interface";

export default interface IComplex {
  id: bigint | null;
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
  sewage: boolean | null;
  sewageRain: boolean | null;
  gas: boolean | null;
  gasValue: number | null;
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
  parkingLorry: boolean | null;
  parkingTruck: boolean | null;
  canteen: boolean | null;
  hostel: boolean | null;
  entryFee: string | null;
  objects: IObject[] | null;
}

export interface IAddressItem {
  title: string;
  type?: string
}
