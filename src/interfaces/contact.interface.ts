export default interface IContact {
    company_id: number,
    full_name: string,
    phones: IPhone[],
    emails: IEmail[]
}

export interface IPhone extends Item{
    phone: string,
    native_phone: string,
    exten: bigint
}

export interface IEmail extends Item{
    email: string
}

interface Item {
    id: number,
    contact_id: bigint,
    isMain: boolean
}