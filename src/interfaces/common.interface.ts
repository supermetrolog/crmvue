
export interface IPhone extends Item{
    phone: string,
    native_phone: string,
    exten: bigint
  }
  
  export interface IEmail extends Item{
    email: string
  }
  
  interface Item {
    id: bigint,
    contact_id: bigint,
    isMain: boolean
  }
  