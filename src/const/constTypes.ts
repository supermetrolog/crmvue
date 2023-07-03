// Продолжение файла Const.js но с типизацией(чтобы не сломалось, то что на js написано)

import {ObjectTypes} from "@/types/objectTypes.enum";

export const facingTypes: Record<number, string> = {
	1: "Кирпич",
	2: "Сайдинг",
	3: "Сендвич-панели",
	4: "Штукатурка",
	5: "Бетонные панели",
	6: "Керамическая плитка",
}

export const ownTypes: Record<number, string> = {
	1: "Аренда",
	2: "Собственность",
	3: "Безвозмездное пользование",
	4: "Бессрочная аренда",
}

//Дублирует существующую константу, но с типизацией и ввиде объекта
export const objectClassTypes: Record<number, string> = {
	1: "A",
	2: "B",
	3: "C",
	4: "D"
}

//Дублирует существующую константу, но с типизацией и ввиде объекта
export const objectPurposes: Record<number, { name: string, icon: string, type: ObjectTypes }> = {
		1: {name: "сухой склад", icon: "fas fa-warehouse", type: ObjectTypes.WAREHOUSE},
		2: {name: "сборочное производство", icon: "fas fa-industry", type: ObjectTypes.PRODUCTION},
		3: {name: "холодильник (0/+5С)", icon: "fas fa-thermometer-half", type: ObjectTypes.WAREHOUSE},
		4: {name: "швейное", icon: "fab fa-shirtsinbulk", type: ObjectTypes.PRODUCTION},
		5: {name: "пищевое (пр-во)", icon: "fas fa-utensils", type: ObjectTypes.WAREHOUSE},
		6: {name: "автосервис/мойка", icon: "fas fa-car", type: ObjectTypes.PRODUCTION},
		8: {name: "морозильник (до -25С)", icon: "fas fa-snowflake", type: ObjectTypes.WAREHOUSE},
		9: {name: "хранение/стоянка", icon: "fas fa-pallet", type: ObjectTypes.PRODUCTION},
		10: {name: "алкогольрный склад", icon: "fas fa-beer", type: ObjectTypes.WAREHOUSE},
		11: {name: "фармацевтический склад", icon: "fas fa-medkit", type: ObjectTypes.WAREHOUSE},
		12: {name: "овощехранилище", icon: "fas fa-lemon", type: ObjectTypes.WAREHOUSE},
		13: {name: "грузоперевозки/логистика", icon: "fas fa-truck", type: ObjectTypes.WAREHOUSE},
		14: {name: "автосервис/услуги (стройка)", icon: "fas fa-burn", type: ObjectTypes.PRODUCTION},
		15: {name: "производство/склад (стройка)", icon: "far fa-square", type: ObjectTypes.PRODUCTION},
		16: {name: "опасные грузы", icon: "fas fa-skull-crossbones", type: ObjectTypes.WAREHOUSE},
		17: {name: "деревообработка", icon: "fas fa-tree", type: ObjectTypes.PRODUCTION},
		18: {name: "металлообработка", icon: "fas fa-gavel", type: ObjectTypes.PRODUCTION},
		19: {name: "ЖБИ/камень", icon: "fas fa-chess-rook", type: ObjectTypes.PRODUCTION},
		20: {name: "машиностроение", icon: "fas fa-cogs", type: ObjectTypes.PRODUCTION},
		21: {name: "ПВХ/полимеры/минералы", icon: "fas fa-bong", type: ObjectTypes.PRODUCTION},
		22: {name: "фарм/косметика/алкоголь", icon: "fas fa-pills", type: ObjectTypes.PRODUCTION},
		23: {name: "1-3 класс опасности", icon: "fas fa-biohazard", type: ObjectTypes.PRODUCTION},
		24: {name: "прачечная", icon: "fas fa-tshirt", type: ObjectTypes.PRODUCTION},
		26: {name: "торговый центр (стройка)", icon: "fas fa-store-alt", type: ObjectTypes.PRODUCTION},
		27: {name: "холодный склад", icon: "fas fa-warehouse", type: ObjectTypes.WAREHOUSE},
		28: {name: "архив", icon: "fas fa-archive", type: ObjectTypes.WAREHOUSE},
		29: {name: "досуг/развлечения", icon: "fas fa-volleyball-ball", type: ObjectTypes.WAREHOUSE},
		30: {name: "типография", icon: "fas fa-print", type: ObjectTypes.PRODUCTION},
		31: {name: "производство 1-3 класс опасности (уч)", icon: "fas fa-biohazard", type: ObjectTypes.PRODUCTION},
		32: {name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball", type: ObjectTypes.PRODUCTION},
		33: {name: "АЗС (стройка)", icon: "fas fa-gas-pump", type: ObjectTypes.PRODUCTION},
	}
;

export const ownTypesLand: Record<number, string> = {
	1: "Собственность",
	2: "Аренда",
	3: "Безвозмездное пользование",
	4: "Бессрочная аренда",
}
export const landCategoryTypes: Record<number, string> = {
	1: "Земли запаса",
	2: "Земли лесного фонда",
	3: "Земли особо охраняемых территорий и объектов",
	4: "Земли населенных пунктов",
	5: "Земли промышленности",
	6: "Земли сельхозназначения",
}

export const landscapeTypes: Record<number, string> = {
	1: "Ровный",
	2: "С перепадами",
}

export const entryTerritoryTypes: Record<number, string> = {
	1: "Свободный",
	2: "По пропускам",
}

export const feeTypes: Record<number, string> = {
	1: "Платный",
	2: "Бесплатный"
}

export const waterTypes: Record<number, string> = {
	1: "Скважина",
	2: "Центральное"
}

export const gasTypes: Record<number, string> = {
	1: "внутри",
	2: "газопр. рядом",
	3: "по границе"
}

export const internetTypes: Record<number, string> = {
	1: "Опто-волокно",
	2: "Беспроводной"
}

export const guardTypes: Record<number, string> = {
	1: "МВД",
	2: "ЧОП",
	3: "Охрана собственника"
}

export const floorTypes: Record<number, string> = {
	1: "Асфальт",
	2: "Антипыль",
	3: "Бет. плиты",
	4: "Тех. плитка",
	5: "Стяжка",
}

export const gateTypes: Record<number, string> = {
	1: "док. типа",
	2: "нулевой уровень",
	3: "авторампа",
	4: "ж/д рампа",
}
