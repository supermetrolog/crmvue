// Продолжение файла Const.js но с типизацией(чтобы не сломалось, то что на js написано)
import {ObjectTypes} from "@/types/objectTypes.enum"

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
export const objectPurposes: Record<number, { name: string, icon: string }> = {
		1: {name: "сухой склад", icon: "fas fa-warehouse"},
		3: {name: "холодильник (0/+5С)", icon: "fas fa-thermometer-half"},
		8: {name: "морозильник (до -25С)", icon: "fas fa-snowflake"},
		10: {name: "алкогольрный склад", icon: "fas fa-beer"},
		11: {name: "фармацевтический склад", icon: "fas fa-medkit"},
		12: {name: "овощехранилище", icon: "fas fa-lemon"},
		13: {name: "грузоперевозки/логистика", icon: "fas fa-truck"},
		16: {name: "опасные грузы", icon: "fas fa-skull-crossbones"},
		27: {name: "холодный склад", icon: "fas fa-warehouse"},
		28: {name: "архив", icon: "fas fa-archive"},
		29: {name: "досуг/развлечения", icon: "fas fa-volleyball-ball"},
		5: {name: "пищевое (пр-во)", icon: "fas fa-utensils"},
		2: {name: "сборочное производство", icon: "fas fa-industry"},
		4: {name: "швейное", icon: "fab fa-shirtsinbulk"},
		6: {name: "автосервис/мойка", icon: "fas fa-car"},
		17: {name: "деревообработка", icon: "fas fa-tree"},
		18: {name: "металлообработка", icon: "fas fa-gavel"},
		19: {name: "ЖБИ/камень", icon: "fas fa-chess-rook"},
		20: {name: "машиностроение", icon: "fas fa-cogs"},
		21: {name: "ПВХ/полимеры/минералы", icon: "fas fa-bong"},
		22: {name: "фарм/косметика/алкоголь", icon: "fas fa-pills"},
		23: {name: "1-3 класс опасности", icon: "fas fa-biohazard"},
		24: {name: "прачечная", icon: "fas fa-tshirt"},
		30: {name: "типография", icon: "fas fa-print"},
		9: {name: "хранение/стоянка", icon: "fas fa-pallet"},
		14: {name: "автосервис/услуги (стройка)", icon: "fas fa-burn"},
		15: {name: "производство/склад (стройка)", icon: "far fa-square"},
		26: {name: "торговый центр (стройка)", icon: "fas fa-store-alt"},
		31: {name: "производство 1-3 класс опасности (уч)", icon: "fas fa-biohazard"},
		32: {name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball"},
		33: {name: "АЗС (стройка)", icon: "fas fa-gas-pump"},
	}
;

export const ownTypesLand: Record<number, string> = {
	1: "Аренда",
	2: "Собственность",
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

export const entryFeeTypes: Record<number, string> = {
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

