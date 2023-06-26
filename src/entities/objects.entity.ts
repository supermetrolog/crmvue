import BaseEntity from "@/entities/base.entity";
import IObject from "@/interfaces/object.interface";


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

	public id: bigint | null = null;
	public address: string | null = null;
	public purposes: number[] | null = null;
	public owners: number[] | null = null;
	private _photo: string[] | null = null;

	private _object_type: number[] | null = null;
	private _area_building: number | null = null;
	private _area_floor_full: number | null = null;
}