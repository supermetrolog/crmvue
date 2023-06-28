export default interface IObject {
	id: bigint | null;
	type: number | null;
	purposes: number[] | null;
	area: number | null;
	floorArea: number | null;
	address: string | null;
	owners: number[] | null;
	photo: { src: string }[] | null;
	objectType: number[] | null;
	objectClass: string | null;
	areaMezanin: number | null;
	areaOffice: number | null;
	areaTech: number | null;
	floorsCount: number | null;
	facing: string | null;
	yearBuild: number | null;
	yearRepair: number | null;
	cadastralNumber: string | null;
	restrictions: boolean | null;
	ownType: string | null;
	landLength: number | null;
	landWidth: number | null;
	cadastralNumberLand: string | null;
	ownTypeLand: string | null;
	landCategory: string | null;
	landscapeType: string | null;
}
