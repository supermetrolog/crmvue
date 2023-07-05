export const craneTypes: Record<number, string> = {
	1: "Кран-балка",
	2: "Мостовой",
	3: "Козловой",
	4: "Тельфер/Лебедка(неподвиж)",
}

export const elevatorTypes: Record<number, string> = {
	1: "Подъемник",
	2: "Грузовой лифт",
	3: "Гидроплатформа",
}

export const liftingDeviceLocationTypes: Record<number, string> = {
	1: "Внутри",
	2: "Снаружи",
}

export const craneBeamTypes: Record<number, string> = {
	1: "Опорная",
	2: "Подвесная",
	3: "С передвижными опорами",
}

export const craneBeamsAmountTypes: Record<number, string> = {
	1: "Одна",
	2: "Две",
	3: "Три",
	4: "Четыре",
	5: "Пять",
}

export const craneHoistingTypes: Record<number, string> = {
	1: "Подвесной",
	2: "На тележке(опирается сверху)",
}

export const liftingDeviceControlsTypes: Record<number, string> = {
	1: "С пола",
	2: "Из кабины",
}

export const liftingDeviceConditionTypes: Record<number, string> = {
	1: "Рабочий",
	2: "Требует ремонта",
	3: "Требуется техобслуживание",
}