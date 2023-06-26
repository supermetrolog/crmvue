import BaseEntity from "@/entities/base.entity";
import IObject from "@/interfaces/object.interface";


export default class ObjectEntity extends BaseEntity implements IObject {
	public id: bigint | null = null;
	public address: string | null = null;
	public area_building: number | null = null;
	public area_floor_full: number | null = null;
	public purposes: number[] | null = null;
	public object_type: number[] | null = null;
	public owners: number[] | null = null;
	public photos: string[] | null = null;
}