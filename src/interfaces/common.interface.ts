
export interface IPhone extends Item{
    phone: string,
    native_phone: string,
    exten: number
  }
  
  export interface IEmail extends Item{
    email: string
  }
  
  interface Item {
    id: number,
    contact_id: number,
    isMain: boolean
  }
  