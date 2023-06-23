import IComplex from "@/interfaces/complex.interface";
import BaseEntity from "@/entities/base.entity";

export default class ComplexEntity extends BaseEntity implements IComplex {
  get id(): bigint | null {
    return this._id;
  }

  get consultantName(): string | null {
    return this._consultant_name;
  }

  get lastUpdatedAt(): string | null {
    return this._last_update !== null ? this.dateFormatter.locale(this._last_update * 1000) : null;
  }

  get createdAt(): string | null {
    return this._publ_time !== null ? this.dateFormatter.locale(this._publ_time * 1000) : null;
  }

  get name(): string | null {
    return this._name;
  }

  get region(): string | null {
    return this._region;
  }

  get district(): string | null {
    return this._district;
  }

  get direction(): string | null {
    return this._direction;
  }

  get locality(): string | null {
    return this._locality;
  }

  get highway(): string | null {
    return this._highway;
  }

  get metro(): string | null {
    return this._metro;
  }

  get highwaySecondary(): string | null {
    return this._highway_secondary;
  }

  get fromMkad(): number | null {
    return this._from_mkad;
  }

  get areaFieldFull(): number | null {
    return this._area_field_full;
  }

  get areaBuilding(): number | null {
    return this._area_building;
  }

  get areaFloorFull(): number | null {
    return this._area_floor_full;
  }

  get areaOfficeFull(): number | null {
    return this._area_office_full;
  }

  get areaTechFull(): number | null {
    return this._area_tech_full;
  }

  get managmentCompany(): boolean | null {
    return this.processBooleanField(this._managment_company);
  }

  get managmentCompanyValue(): string | null {
    return this._managment_company_value;
  }

  get power(): boolean | null {
    return this.processBooleanField(this._power);
  }

  get powerValue(): number | null {
    return this._power_value !== null ? parseInt(this._power_value) : null;
  }

  get heating(): boolean | null {
    return this.processBooleanField(this._heating);
  }

  get heatingAutonomous(): boolean | null {
    return this.processBooleanField(this._heating_autonomous);
  }

  get heatingAutonomousType(): string | null {
    return this._heating_autonomous_type;
  }

  get water(): boolean | null {
    return this.processBooleanField(this._water);
  }

  get sewage(): boolean | null {
    return this.processBooleanField(this._sewage);
  }

  get sewageRain(): boolean | null {
    return this.processBooleanField(this._sewage_rain);
  }

  get gas(): boolean | null {
    return this.processBooleanField(this._gas);
  }

  get gasValue(): number | null {
    return this._gas_value;
  }

  get steam(): boolean | null {
    return this.processBooleanField(this._steam);
  }

  get steamValue(): number | null {
    return this._steam_value;
  }

  get phoneLine(): boolean | null {
    return this.processBooleanField(this._phone_line);
  }

  get internet(): boolean | null {
    return this.processBooleanField(this._internet);
  }

  get internetType(): string | null {
    return this._internet_type;
  }
  
  get latitude(): number | null {
    return this._latitude;
  }

  get longitude(): number | null {
    return this._longitude;
  }

  private _id: bigint | null = null;
  private _consultant_name: string | null = null;
  private _last_update: number | null = null;
  private _publ_time: number | null = null;
  private _name: string | null = null;
  private _region: string | null = null;
  private _district: string | null = null;
  private _direction: string | null = null;
  private _locality: string | null = null;
  private _highway: string | null = null;
  private _metro: string | null = null;
  private _highway_secondary: string | null = null;
  private _from_mkad: number | null = null;
  private _area_field_full: number | null = null;
  private _area_building: number | null = null;
  private _area_floor_full: number | null = null;
  private _area_office_full: number | null = null;
  private _area_tech_full: number | null = null;
  private _managment_company: number | null = null;
  private _managment_company_value: string | null = null;
  private _power: number | null = null;
  private _power_value: string | null = null;
  private _heating: number | null = null;
  private _heating_autonomous: number | null = null;
  private _heating_autonomous_type: string | null = null;
  private _water: number | null = null;
  private _sewage: number | null = null;
  private _sewage_rain: number | null = null;
  private _gas: number | null = null;
  private _gas_value: number | null = null;
  private _steam: number | null = null;
  private _steam_value: number | null = null;
  private _phone_line: number | null = null;
  private _internet: number | null = null;
  private _internet_type: string | null = null;
  private _latitude: number | null = null;
  private _longitude: number | null = null;
}
