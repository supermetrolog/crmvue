import BaseEntity from "@/entities/base.entity";
import IObject from "@/interfaces/object.interface";
import IComplex, {IAddressItem} from "@/interfaces/complex.interface";
import {entryFeeTypes, entryTerritoryTypes, gasTypes, guardTypes, internetTypes, waterTypes} from "@/const/constTypes";


interface IComplexAddress extends Record<string, any> {
}


export default class ComplexEntity extends BaseEntity implements IComplex {
	get id(): bigint | null {
		return this._id;
	}

	get consultantName(): string | null {
		return this._author ? this._author.userProfile.full_name : null;
	}

	get lastUpdatedAt(): string | null {
		return this._last_update !== null ? this.dateFormatter.locale(this._last_update * 1000) : null;
	}

	get createdAt(): string | null {
		return this._publ_time !== null ? this.dateFormatter.locale(this._publ_time * 1000) : null;
	}

	get name(): string | null {
		return this._title;
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
		return this.processBooleanField(this._heating_central);
	}

	get heatingAutonomous(): boolean | null {
		return this.processBooleanField(this._heating_autonomous);
	}

	get heatingAutonomousType(): string | null {
		// return this._heating_autonomous_type;
		return "Газовое";
	}

	get water(): boolean | null {
		return this.processBooleanField(this._water);
	}

	get waterType(): string[] | null {
		return this._water_type?.map(el => waterTypes[el]) || null;
	}

	get waterValue(): number | null {
		return  this._water_value;
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

	get gasType(): string | null {
		return this._gas_type ? gasTypes[this._gas_type] : null;
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

	get internetType(): string[] | null {
		return this._internet_type?.map(el => internetTypes[el]) || null;

	}

	get latitude(): number | null {
		return this._latitude;
	}

	get longitude(): number | null {
		return this._longitude;
	}

	get fenceAroundPerimeter(): boolean | null {
		return this.processBooleanField(this._fence_around_perimeter);
	}

	get guard(): boolean | null {
		return this.processBooleanField(this._guard);
	}

	get guardType(): string[] | null {
		return this._guard_type?.map(el => guardTypes[el]) || null;
	}

	get videoControl(): boolean | null {
		return this.processBooleanField(this._video_control);
	}

	get accessControl(): boolean | null {
		return this.processBooleanField(this._access_control);
	}

	get securityAlert(): boolean | null {
		return this.processBooleanField(this._security_alert);
	}

	get fireAlert(): boolean | null {
		return this.processBooleanField(this._fire_alert);
	}

	get barrier(): boolean | null {
		return this.processBooleanField(this._barrier);
	}

	get railway(): boolean | null {
		return this.processBooleanField(this._railway);
	}


	get entryTerritory(): boolean | null {
		return this.processBooleanField(this._entry_territory);
	}

	get entryTerritoryType(): string | null {
		return this._entry_territory_type ? entryTerritoryTypes[this._entry_territory_type] : null;
	}

	get parkingCar(): boolean | null {
		return this.processBooleanField(this._parking_car);
	}

	get parkingLorry(): boolean | null {
		return this.processBooleanField(this._parking_lorry);
	}

	get parkingTruck(): boolean | null {
		return this.processBooleanField(this._parking_truck);
	}

	get canteen(): boolean | null {
		return this.processBooleanField(this._canteen);
	}

	get hostel(): boolean | null {
		return this.processBooleanField(this._hostel);
	}

	get entryFee(): string | null {
		return this._entrance_type ? entryFeeTypes[this._entrance_type] : null;
	}


	get region(): IAddressItem | null {
		return this._regionRecord ? {
			title: this._regionRecord.title,
		} : null;
	}

	get highway(): IAddressItem | null {
		return this._highwayRecord ? {
			title: this._highwayRecord.title
		} : null;
	}

	get direction(): IAddressItem | null {
		return this._directionRecord ? {
			title: this._directionRecord.title
		} : null;
	}

	get district(): IAddressItem | null {
		return this._districtRecord ? {
			title: this._districtRecord.title,
			type: this._districtTypeRecord?.title
		} : null;
	}

	get districtMoscow(): IAddressItem | null {
		return this._districtMoscowRecord ? {
			title: this._districtMoscowRecord.title,
		} : null;
	}

	get locality(): IAddressItem | null {
		return this._townRecord ? {
			title: this._townRecord.title,
			type: this._townRecord.townTypeRecord.title
		} : null;
	}

	get metro(): IAddressItem | null {
		return this._metroRecord ? {
			title: this._metroRecord.title
		} : null;
	}

	getMetroLogoName(): string | null {
		if (
			this.locality?.title === "москва" ||
			this.region?.title === "московская область"
		) {
			return "metro";
		}
		if (
			this.locality?.title === "санкт Петербург" ||
			this.region?.title === "ленинградская область"
		) {
			return "metro_spb";
		} else {
			return null;
		}
	}

	private _id: bigint | null = null;
	private _author: IAuthorRes | null = null;
	private _last_update: number | null = null;
	private _publ_time: number | null = null;
	private _title: string | null = null;
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
	private _heating_central: number | null = null;
	private _heating_autonomous: number | null = null;
	private _heating_autonomous_type: number | null = null;
	private _water: number | null = null;
	private _water_type: number[] | null = null;
	private _water_value: number | null = null;
	private _sewage: number | null = null;
	private _sewage_rain: number | null = null;
	private _gas: number | null = null;
	private _gas_value: number | null = null;
	private _gas_type: number | null = null;
	private _steam: number | null = null;
	private _steam_value: number | null = null;
	private _phone_line: number | null = null;
	private _internet: number | null = null;
	private _internet_type: number[] | null = null;
	private _latitude: number | null = null;
	private _longitude: number | null = null;
	private _fence_around_perimeter: number | null = null;
	private _guard: number | null = null;
	private _guard_type: number[] | null = null;
	private _video_control: number | null = null;
	private _access_control: number | null = null;
	private _security_alert: number | null = null;
	private _fire_alert: number | null = null;
	private _barrier: number | null = null;
	private _railway: number | null = null;
	private _entry_territory: number | null = null;
	private _entry_territory_type: number | null = null;
	private _parking_car: number | null = null;
	private _parking_lorry: number | null = null;
	private _parking_truck: number | null = null;
	private _canteen: number | null = null;
	private _hostel: number | null = null;
	private _entrance_type: number | null = null;
	public objects: IObject[] | null = null;
	private _regionRecord: IComplexAddress | null = null;
	private _highwayRecord: IComplexAddress | null = null;
	private _directionRecord: IComplexAddress | null = null;
	private _districtRecord: IComplexAddress | null = null;
	private _districtTypeRecord: IComplexAddress | null = null;
	private _districtMoscowRecord: IComplexAddress | null = null;
	private _townRecord: IComplexAddress | null = null;
	private _metroRecord: IComplexAddress | null = null;
}

interface IAuthorRes {
	userProfile: {
		full_name: string;
	}
}
