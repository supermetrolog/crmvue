import BaseEntity from "@/entities/base.entity";
import {ICrane} from "@/interfaces/crane.interace";
import {
    craneBeamsAmountTypes, craneBeamTypes,
    craneHoistingTypes, craneTypes,
    liftingDeviceConditionTypes,
    liftingDeviceControlsTypes, liftingDeviceLocationTypes
} from "@/const/liftingDevices";


export class CraneEntity extends BaseEntity implements ICrane {
    get crane_type(): string | null {
        return this._crane_type ? craneTypes[this._crane_type] : null;
    }

    get crane_location(): string | null {
        return this._crane_location ? liftingDeviceLocationTypes[this._crane_location] : null;
    }

    get crane_beam(): string | null {
        return this._crane_beam ? craneBeamTypes[this._crane_beam] : null;
    }

    get crane_beams_amount(): string | null {
        return this._crane_beams_amount ? craneBeamsAmountTypes[this._crane_beams_amount] : null;
    }

    get crane_span(): number | null {
        return this._crane_span;
    }

    get crane_hoisting(): string | null {
        return this._crane_hoisting ? craneHoistingTypes[this._crane_hoisting] : null
    }

    get crane_controls(): string[] | null {
        return this._crane_controls ? this._crane_controls.map(el => liftingDeviceControlsTypes[el]) : null;
    }

    get crane_hooks(): number | null {
        return this._crane_hooks;
    }

    get crane_hook_height(): number | null {
        return this._crane_hook_height;
    }

    get crane_condition(): string | null {
        return this._crane_condition ? liftingDeviceConditionTypes[this._crane_condition] : null;
    }

    get crane_supervision(): boolean | null {
        return this._crane_supervision ? !!(this._crane_supervision - 1) : null;
    }

    get crane_documents(): boolean | null {
        return this._crane_documents ? !!(this._crane_documents - 1) : null;
    }

    public id: bigint | null = null;
    public photo: string[] | null = null;
    public crane_capacity: number | null = null;
    public description: string | null = null;

    private _crane_type: number | null = null;
    private _crane_location: number | null = null;
    private _crane_beam: number | null = null;
    private _crane_beams_amount: number | null = null;
    private _crane_span: number | null = null;
    private _crane_hoisting: number | null = null;
    private _crane_controls: number[] | null = null;
    private _crane_hooks: number | null = null;
    private _crane_hook_height: number | null = null;
    private _crane_condition: number | null = null;
    private _crane_supervision: number | null = null;
    private _crane_documents: number | null = null;
}