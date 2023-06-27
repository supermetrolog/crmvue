export default interface IObject {
	id: bigint | null;
	type: number | null;
	purposes: number[] | null;
	area: number | null;
	floorArea: number | null;
	address: string | null;
	owners: number[] | null;
	photo: { src: string }[] | null;
	objectClass: string | null;
	areaMezanin: number | null;
	areaOffice: number | null;
	areaTech: number | null;
	floors: number | null;
	facing: string | null;
	yearBuild: number | null;
	yearRepair: number | null;
	cadastralNumber: string | null;
	restrictions: boolean | null;
	ownType: string | null;
}
