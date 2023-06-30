import {unitTypes} from "./unitTypes";

export interface IAboutComlexProperties {
	area: IProperty[];
	communications: IProperty[];
	safety: IProperty[];
	railway: IProperty[];
	infrastructure: IProperty[];
}

interface IProperty {
	name: string;
	unitType: unitTypes | null;
	value?: string | boolean | number | null;
	valueMin?: number | null;
	valueMax?: number | null;
}

export const aboutComplexProperties: IAboutComlexProperties = {
	area: [
		{
			name: "S - участка общая",
			unitType: unitTypes.SQUARE_METERS,
		},
		{
			name: "S - строений в комплексе",
			unitType: unitTypes.SQUARE_METERS,
		},
		{
			name: "S - этажей общая",
			unitType: unitTypes.SQUARE_METERS,
		},
		{
			name: "S - оффисов общая",
			unitType: unitTypes.SQUARE_METERS,
		},
		{
			name: "S - техническая общая",
			unitType: unitTypes.SQUARE_METERS,
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
			name: "Отопление центральное",
			unitType: null,
		},
		{
			name: "Отопление автономное",
			unitType: null,
		},
		{
			name: "Вид отопления",
			unitType: null,
		},
		{
			name: "Водоснабжение",
			unitType: null,
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
			unitType: unitTypes.CUBE_METERS_PER_HOUR,
		},
		{
			name: "Пар",
			unitType: unitTypes.CUBE_METERS_PER_HOUR,
		},
		{
			name: "Телефония",
			unitType: null,
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
