import { unitTypes } from "./unitTypes";

export interface ITradeOfferCharacteristics
  extends Record<string, Record<string, ICharacterictic>> {}

export interface ICharacterictic {
  name: string;
  required: boolean;
  unitType?: unitTypes;
}

export const tradeOfferCharacteristics: ITradeOfferCharacteristics = {
  characteristics: {
    height: {
      name: "Высота хранения",
      required: true,
      unitType: unitTypes.METERS,
    },
    floorType: {
      name: "Тип пола",
      required: true,
    },
    floorLoad: {
      name: "Нагр. на пол",
      required: true,
      unitType: unitTypes.TON_PER_SQUARE_METER,
    },
    columnGrid: {
      name: "Сетка колонн",
      required: false,
      unitType: unitTypes.METERS,
    },
    gatesNumber: {
      name: "Тип, кол-во ворот",
      required: true,
      unitType: unitTypes.PIECES,
    },
    temperature: {
      name: "Тем-ра хранения",
      required: true,
      unitType: unitTypes.CELCIUS,
    },
    entry: {
      name: "Вход в блок",
      required: false,
    },
  },
  facilities: {
    shelving: {
      name: "Стеллажи",
      required: false,
    },
    shelvingType: {
      name: "Тип стеллажей",
      required: false,
    },
    storageType: {
      name: "Тип хранения",
      required: false,
    },
    chargingRoom: {
      name: "Зарядная комната",
      required: false,
    },
    warehouseEquipment: {
      name: "Складская техника",
      required: false,
    },
  },
  communications: {
    electricity: {
      name: "Эл-во доступное",
      required: false,
      unitType: unitTypes.KILOWATT,
    },
    lighting: {
      name: "Освещение",
      required: false,
    },
    heating: {
      name: "Отопление",
      required: false,
    },
    heatingType: {
      name: "Вид отопления",
      required: false,
    },
    waterSupply: {
      name: "Водоснабжение",
      required: false,
    },
    sewage: {
      name: "Канализация",
      required: false,
    },
    ventilation: {
      name: "Вентиляция",
      required: false,
    },
    climatControl: {
      name: "Климат-контроль",
      required: false,
    },
    gasForProduction: {
      name: "Газ для производства",
      required: false,
    },
    steamForProduction: {
      name: "Пар для производства",
      required: false,
    },
    internet: {
      name: "Интернет",
      required: false,
    },
    telephony: {
      name: "Телефония",
      required: false,
    },
  },
};
