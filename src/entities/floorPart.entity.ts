import BaseEntity from "@/entities/base.entity";
import {IFloorPart} from "@/interfaces/floorPart.interface";

export class FloorPartEntity extends BaseEntity implements IFloorPart {
    public id: bigint |  null = null;
    public offer_id: bigint | null = null;
    public area_floor_min: number | null = null;
    public area_floor_max: number | null = null;
}