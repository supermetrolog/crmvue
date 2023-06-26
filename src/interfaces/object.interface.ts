export default interface IObject {
	id: bigint | null;
	type: number | null;
	purposes: number[] | null;
	area: number | null;
	floorArea: number | null;
	address: string | null;
	owners: number[] | null;
	photo: { src: string }[] | null;
}
