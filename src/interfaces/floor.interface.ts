import {IFloorPart} from "@/interfaces/floorPart.interface";

export interface IFloor {
    id: bigint | null;
    floor_num_id: number | null;
    area_floor_full: number | null;
    parts: IFloorPart[] | null;
}