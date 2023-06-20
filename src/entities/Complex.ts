import IComplex from "@/interfaces/IComplex";

export default class Complex implements IComplex
{
    get name(): string | null {
        return this._name;
    }

    set name(value: string | null) {
        this._name = value;
    }
    get lastUpdatedAt(): string | null {
        return this._lastUpdatedAt;
    }

    set lastUpdatedAt(value: string | null) {
        this._lastUpdatedAt = value;
    }
    get createdAt(): string | null {
        return this._createdAt;
    }

    set createdAt(value: string | null) {
        this._createdAt = value;
    }
    get consultantName(): string | null {
        return this._consultantName;
    }

    set consultantName(value: string | null) {
        this._consultantName = value;
    }
    get id(): bigint | null {
        return this._id;
    }

    set id(value: bigint | null) {
        this._id = value;
    }

    private _id: bigint|null = null;
    private _consultantName: string|null = null;
    private _createdAt: string|null = null;
    private _lastUpdatedAt: string|null = null;
    private _name: string|null = null;
}