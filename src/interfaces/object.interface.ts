export default interface IObject {
	id: bigint | null;
	object_type: number[] | null;
	purposes: number[] | null;
	area_building: number | null;
	area_floor_full: number | null;
	address: string | null;
	owners: number[] | null;
	photos: string[] | null;
}
