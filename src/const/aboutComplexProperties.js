import { unitTypes } from "./unitTypes";

// после добавления ts
// export interface IAboutComlexProperties {
//   area: IProperty[];
//   communications: IProperty[];
//   safety: IProperty[];
//   railway: IProperty[];
//   infrastructure: IProperty[];
// }

// interface IProperty {
//   name: string;
//   unitType: unitTypes | null;
// }

export const aboutComplexProperties = {
  area: [
    {
      name: "S - участка общая",
      unitType: unitTypes.SQUARE_METERS,
    },
    {
      name: "S - строений в комплексе",
      unitType: unitTypes.RUB_PER_MONTH,
    },
    {
      name: "Управляющая компания",
      unitType: null,
    },
  ],
  communications: [
    {
      name: "Электричество",
      unitType: unitTypes.KILOWATT,
    },
    {
      name: "Отопление",
      unitType: null,
    },
    {
      name: "Вид отопления",
      unitType: null,
    },
    {
      name: "Водоснабжение",
      unitType: unitTypes.CUBE_METERS_PER_HOUR,
    },
    {
      name: "Канализация",
      unitType: null,
    },
    {
      name: "Ливневая канал.",
      unitType: null,
    },
    {
      name: "Газ",
      unitType: null,
    },
    {
      name: "Пар",
      unitType: unitTypes.CUBE_METERS_PER_HOUR,
    },
    {
      name: "Телефония",
      unitType: unitTypes.BAR,
    },
    {
      name: "Интернет",
      unitType: null,
    },
  ],
  safety: [
    {
      name: "Охрана объекта",
      unitType: null,
    },
    {
      name: "Видеонабл. наруж.",
      unitType: null,
    },
    {
      name: "Контр. дост. наруж.",
      unitType: null,
    },
    {
      name: "Охран. сигнал. наруж.",
      unitType: null,
    },
    {
      name: "Шлагбаум",
      unitType: null,
    },
    {
      name: "Забор по периметру",
      unitType: null,
    },
  ],
  railway: [
    {
      name: "Ж/Д ветка",
      unitType: unitTypes.SQUARE_METERS,
    },
  ],
  infrastructure: [
    {
      name: "Въезд",
      unitType: null,
    },
    {
      name: "«P» легковая",
      unitType: unitTypes.RUB_PER_MONTH,
    },
    {
      name: "«P» 3-10 тонн",
      unitType: null,
    },
    {
      name: "«P» от 10 тонн",
      unitType: null,
    },
    {
      name: "Столовая/кафе",
      unitType: null,
    },
    {
      name: "Общежитие",
      unitType: null,
    },
  ],
};
