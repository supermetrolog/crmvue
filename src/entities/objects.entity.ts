import BaseEntity from "@/entities/base.entity";
import IObject from "@/interfaces/object.interface";
import {facingTypes, objectClassTypes, ownTypes} from "@/const/constTypes";


export default class ObjectEntity extends BaseEntity implements IObject {


	get area(): number | null {
		return this._area_building;
	}

	get floorArea(): number | null {
		return this._area_floor_full;
	}

	get type(): number | null {
		return this._object_type?.includes(1) || this._object_type?.includes(2) ? 1 : 2;
	}

	get photo(): { src: string }[] | null {
		return this._photo ? this._photo.map(link => ({src: "https://pennylane.pro" + link})) : null;
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
		return this._cadastral_number_land || null;
	}

	get restrictions(): boolean | null {
		return this.processBooleanField(this._land_use_restriction);
	}

	get ownType(): string | null {
		return this._own_type_land ? ownTypes[this._own_type_land] : null;
	}

	get floorsCount(): number | null {
		return this._floors;
	}

	get objectType(): number[] | null {
		return this._object_type;
	}


	public id: bigint | null = null;
	public address: string | null = null;
	public purposes: number[] | null = null;
	public owners: number[] | null = null;

	private _floors: number | null = null;
	private _photo: string[] | null = null;
	private _object_type: number[] | null = null;
	private _area_building: number | null = null;
	private _area_floor_full: number | null = null;
	private _object_class: number | null = null;
	private _area_mezanin_full: number | null = null;
	private _area_office_full: number | null = null;
	private _area_tech_full: number | null = null;
	private _facing_type: number | null = null;
	private _year_build: number | null = null;
	private _year_repair: number | null = null;
	private _cadastral_number_land: string | null = null;
	private _land_use_restriction: boolean | null = null;
	private _own_type_land: number | null = null;
}