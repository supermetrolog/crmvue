import BaseEntity from "@/entities/base.entity";
import IObject from "@/interfaces/object.interface";
import {
	facingTypes, floorTypes, internetTypes,
	landCategoryTypes,
	landscapeTypes,
	objectClassTypes,
	ownTypes,
	ownTypesLand
} from "@/const/constTypes";


export default class ObjectEntity extends BaseEntity implements IObject {


	get areaBuilding(): number | null {
		return this._area_building;
	}

	get areaField(): number | null {
		return this._area_field_full;
	}

	get floorArea(): number | null {
		return this._area_floor_full;
	}

	get type(): number | null {
		return this._object_type?.includes(1) || this._object_type?.includes(2) ? 1 : 2;
	}

	get photo(): { src: string }[] | null {
		return this._photo ? this._photo.map(link => ({src: link})) : null;
	}

	get objectClass(): string | null {
		return this._object_class ? objectClassTypes[this._object_class] : null;
	}

	get areaMezanin(): number | null {
		return this._area_mezanin_full;
	}

	get areaOffice(): number | null {
		return this._area_office_full;
	}

	get areaTech(): number | null {
		return this._area_tech_full;
	}

	get facing(): string | null {
		return this._facing_type ? facingTypes[this._facing_type] : null;
	}

	get yearBuild(): number | null {
		return this._year_build || null;
	}

	get yearRepair(): number | null {
		return this._year_repair || null;
	}

	get cadastralNumber(): string | null {
		return this._cadastral_number || null;
	}

	get restrictions(): boolean | null {
		return this.processBooleanField(this._land_use_restriction);
	}

	get ownType(): string | null {
		return this._own_type ? ownTypes[this._own_type] : null;
	}

	get floorsCount(): number | null {
		return this._floors;
	}

	get objectType(): number[] | null {
		return this._object_type;
	}


	get landLength(): number | null {
		return this._land_length;
	}

	get landWidth(): number | null {
		return this._land_width;
	}

	get cadastralNumberLand(): string | null {
		return this._cadastral_number_land || null;
	}

	get ownTypeLand(): string | null {
		return this._own_type_land ? ownTypesLand[this._own_type_land] : null;
	}

	get landCategory(): string | null {
		return this._land_category ? landCategoryTypes[this._land_category] : null;
	}

	get landscapeType(): string | null {
		return this._landscape_type ? landscapeTypes[this._landscape_type] : null;
	}

	get ceilingHeight(): number | null {
		return this._calc_ceiling_height ? parseInt(this._calc_ceiling_height) : null;
	}

	get gateType(): string | null {
		return this._calc_gate_type;
	}

	get floorType(): string | null {
		return this._floor_type ? floorTypes[this._floor_type] : null;
	}

	get water(): boolean | null {
		return this.processBooleanField(this._water);
	}

	get sewage(): boolean | null {
		return this.processBooleanField(this._sewage);
	}

	get gas(): boolean | null {
		return this.processBooleanField(this._gas);
	}

	get steam(): boolean | null {
		return this.processBooleanField(this._steam);
	}

	get internet(): boolean | null {
		return this.processBooleanField(this._internet);
	}

	get internetType(): string | null {
		return this._internet_type ? internetTypes[this._internet_type] : null;

	}

	get powerValue(): number | null {
		return this._power ? parseInt(this._power) : null;
	}

	get heating(): boolean | null {
		return this.processBooleanField(this._heating);
	}

	public id: bigint | null = null;
	public address: string | null = null;
	public purposes: number[] | null = null;
	public owners: number[] | null = null;

	private _floors: number | null = null;
	private _photo: string[] | null = null;
	private _object_type: number[] | null = null;
	private _area_field_full: number | null = null;
	private _area_building: number | null = null;
	private _area_floor_full: number | null = null;
	private _object_class: number | null = null;
	private _area_mezanin_full: number | null = null;
	private _area_office_full: number | null = null;
	private _area_tech_full: number | null = null;
	private _facing_type: number | null = null;
	private _year_build: number | null = null;
	private _year_repair: number | null = null;
	private _cadastral_number: string | null = null;
	private _land_use_restriction: boolean | null = null;
	private _own_type: number | null = null;
	private _land_length: number | null = null;
	private _land_width: number | null = null;
	private _cadastral_number_land: string | null = null;
	private _own_type_land: number | null = null;
	private _land_category: number | null = null;
	private _landscape_type: number | null = null;
	private _calc_ceiling_height: string | null = null;
	private _calc_gate_type: string | null = null;
	private _floor_type: number | null = null;
	private _power: string | null = null;
	private _water: number | null = null;
	private _heating: number | null = null;
	private _sewage: number | null = null;
	private _gas: number | null = null;
	private _steam: number | null = null;
	private _internet: number | null = null;
	private _internet_type: number | null = null;

}