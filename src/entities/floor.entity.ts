import BaseEntity from "@/entities/base.entity";
import {IFloor} from "@/interfaces/floor.interface";
import {IFloorPart} from "@/interfaces/floorPart.interface";
import {FloorPartEntity} from "@/entities/floorPart.entity";

export class FloorEntity extends BaseEntity implements IFloor {
    get parts(): IFloorPart[] | null {
        return this._parts ? this._parts.map(part => {
            const floorPart = new FloorPartEntity();
            floorPart.load(part);
            return floorPart
        }) : null;
    }

    public id: bigint | null = null;
    public floor_num_id: number | null = null;
    public area_floor_full: number | null = null;

    private _parts: Record<string, any>[] | null = null;
}