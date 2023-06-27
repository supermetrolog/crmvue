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

export const objectClassTypes: Record<number, string> = {
	1: "A",
	2: "B",
	3: "C",
	4: "D"
}

export const objectPurposes: Record<ObjectTypes, Record<number, { name: string, icon: string }>> = {
		[ObjectTypes.WAREHOUSE]: {
			0: {name: "сухой склад", icon: "fas fa-warehouse"},
			1: {name: "холодильник (0/+5С)", icon: "fas fa-thermometer-half"},
			2: {name: "морозильник (до -25С)", icon: "fas fa-snowflake"},
			3: {name: "алкогольрный склад", icon: "fas fa-beer"},
			4: {name: "фармацевтический склад", icon: "fas fa-medkit"},
			5: {name: "овощехранилище", icon: "fas fa-lemon"},
			6: {name: "грузоперевозки/логистика", icon: "fas fa-truck"},
			7: {name: "опасные грузы", icon: "fas fa-skull-crossbones"},
			8: {name: "холодный склад", icon: "fas fa-warehouse alt"},
			9: {name: "архив", icon: "fas fa-archive"},
			10: {name: "досуг/развлечения", icon: "fas fa-volleyball-ball"},
			11: {name: "пищевое (склад)", icon: "fas fa-utensils"},
		},
		[ObjectTypes.PRODUCTION]: {
			12: {name: "сборочное", icon: "fas fa-industry"},
			13: {name: "швейное", icon: "fab fa-shirtsinbulk"},
			14: {name: "пищевое (пр-во)", icon: "fas fa-utensils"},
			15: {name: "автосервис/мойка", icon: "fas fa-car"},
			16: {name: "деревообработка", icon: "fas fa-tree"},
			17: {name: "металлообработка", icon: "fas fa-gavel"},
			18: {name: "ЖБИ/камень", icon: "fas fa-chess-rook"},
			19: {name: "машиностроение", icon: "fas fa-cogs"},
			20: {name: "ПВХ/полимеры/минералы", icon: "fas fa-bong"},
			21: {name: "фарм/косметика/алкоголь", icon: "fas fa-pills"},
			22: {name: "1-3 класс опасности", icon: "fas fa-biohazard"},
			23: {name: "прачечная", icon: "fas fa-tshirt"},
			24: {name: "типография", icon: "fas fa-print"},
		},
		[ObjectTypes.PLOT]: {
			25: {name: "хранение/стоянка", icon: "fas fa-pallet"},
			26: {name: "автосервис/услуги (стройка)", icon: "fas fa-burn"},
			27: {name: "производство/склад (стройка)", icon: "far fa-square"},
			28: {name: "торговый центр (стройка)", icon: "fas fa-store-alt"},
			29: {name: "производство 1-3 класс опасности (уч)", icon: "fas fa-biohazard"},
			30: {name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball"},
			31: {name: "АЗС (стройка)", icon: "fas fa-gas-pump"},
		}
	}
;