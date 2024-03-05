import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';

const characteristicsWithSections = [
    {
        name: 'Площади',
        properties: {
            area_floor: {
                name: 'S - пола',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_mezzanine: {
                name: 'S - мезонина',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_office: {
                name: 'S - офисов',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_tech: {
                name: 'S - техническая',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_field: {
                name: 'S - участка',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            pallet_place: {
                name: 'Паллет-мест',
                range: true,
                unitType: unitTypes.PALLET_PLACE
            },
            cells_place: {
                name: 'Ячейка-мест',
                range: true,
                unitType: unitTypes.PIECES
            }
        }
    },
    {
        name: 'Характеристики',
        properties: {
            ceiling_height: {
                name: 'Высота хранения',
                range: true,
                unitType: unitTypes.METERS
            },
            floor_types: {
                name: 'Тип пола',
                multiple: true,
                types: entityOptions.floor.floorTypes
            },
            load_floor: {
                name: 'Нагрузка на пол',
                range: true,
                unitType: unitTypes.TON_PER_SQUARE_METER
            },
            load_mezzanine: {
                name: 'Нагрузка на мезонин',
                range: true,
                unitType: unitTypes.TON_PER_SQUARE_METER
            },
            column_grids: {
                name: 'Шаг колонн',
                multiple: true,
                types: entityOptions.floor.gridColumn
            },
            gates: {
                name: 'Тип, кол-во ворот',
                count: true,
                unitType: unitTypes.PIECES,
                types: entityOptions.floor.gate
            },
            temperature: {
                name: 'Температура',
                range: true,
                unitType: unitTypes.CELCIUS
            },
            enterance_block: {
                name: 'Вход в блок',
                types: entityOptions.part.entrance
            }
        }
    },
    {
        name: 'Оборудование',
        properties: {
            racks: {
                name: 'Стеллажи',
                types: entityOptions.defaults.boolean
            },
            rack_types: {
                name: 'Тип стеллажей',
                multiple: true,
                types: entityOptions.part.rack
            },
            safe_type: {
                name: 'Тип хранения',
                multiple: true,
                types: entityOptions.part.safe
            },
            charging_room: {
                name: 'Зарядная комната',
                types: entityOptions.defaults.boolean
            },
            warehouse_equipment: {
                name: 'Складская техника',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Коммуникации',
        properties: {
            power: {
                name: 'Доступное электричество',
                count: true,
                unitType: unitTypes.KILOWATT
            },
            lighting: {
                name: 'Освещение',
                multiple: true,
                types: entityOptions.floor.lighting
            },
            heated: {
                name: 'Отопление',
                types: entityOptions.defaults.boolean
            },
            water: {
                name: 'Водоснабжение',
                types: entityOptions.defaults.boolean
            },
            sewage: {
                name: 'Канализация',
                types: entityOptions.defaults.boolean
            },
            ventilation: {
                name: 'Вентилация',
                multiple: true,
                types: entityOptions.floor.ventilation
            },
            climate_control: {
                name: 'Климат-контроль',
                types: entityOptions.defaults.boolean
            },
            gas: {
                name: 'Газ для производства',
                types: entityOptions.complex.gas
            },
            steam: {
                name: 'Пар для производства',
                types: entityOptions.defaults.boolean
            },
            internet: {
                name: 'Интернет',
                types: entityOptions.complex.internet
            },
            phone_line: {
                name: 'Телекоммуникация',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Безопасность',
        properties: {
            firefighting_type: {
                name: 'Система пожаротушения',
                types: entityOptions.floor.firefighting,
                multiple: true
            },
            smoke_exhaust: {
                name: 'Дымоудаление',
                types: entityOptions.defaults.boolean
            },
            video_control: {
                name: 'Видеонаблюдение',
                types: entityOptions.defaults.boolean
            },
            access_control: {
                name: 'Контроль доступа',
                types: entityOptions.defaults.boolean
            },
            security_alert: {
                name: 'Охранная сигнализация',
                types: entityOptions.defaults.boolean
            },
            fire_alert: {
                name: 'Пожарная сигнализация',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Подъемные устройства',
        properties: {
            elevators: {
                name: 'Лифты/Подъемники',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            cranes: {
                name: 'Мостовые краны',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            telphers: {
                name: 'Тельферы',
                types: entityOptions.defaults.boolean
            },
            cranes_runways: {
                name: 'Подкрановые пути',
                types: entityOptions.defaults.boolean
            }
        }
    }
];

const characteristicsWithSectionsForLand = [
    {
        name: 'Площади',
        properties: {
            area_floor: {
                name: 'S - пола',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_field: {
                name: 'S - участка',
                range: true,
                unitType: unitTypes.SQUARE_METERS
            },
            pallet_place: {
                name: 'Паллет-мест',
                range: true,
                unitType: unitTypes.PALLET_PLACE
            },
            cells_place: {
                name: 'Ячейка-мест',
                range: true,
                unitType: unitTypes.PIECES
            }
        }
    },
    {
        name: 'Характеристики',
        properties: {
            floor_types_land: {
                name: 'Тип покрытия',
                multiple: true,
                types: entityOptions.part.floorType
            },
            land_length: {
                name: 'Длина участка',
                unitType: unitTypes.METERS
            },
            land_width: {
                name: 'Ширина участка',
                unitType: unitTypes.METERS
            },
            landscape_type: {
                name: 'Рельеф участка',
                icon: 'fa-solid fa-mountain-sun',
                types: entityOptions.part.landscape
            },
            fence: {
                name: 'Забор',
                types: entityOptions.defaults.boolean
            },
            barrier: {
                name: 'Шлагбаум',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Коммуникации',
        properties: {
            power: {
                name: 'Доступное электричество',
                count: true,
                unitType: unitTypes.KILOWATT
            },
            water: {
                name: 'Водоснабжение',
                types: entityOptions.defaults.boolean
            },
            heated: {
                name: 'Отопление',
                types: entityOptions.defaults.boolean
            },
            sewage: {
                name: 'Канализация',
                types: entityOptions.defaults.boolean
            },
            ventilation: {
                name: 'Вентилация',
                multiple: true,
                types: entityOptions.floor.ventilation
            },
            climate_control: {
                name: 'Климат-контроль',
                types: entityOptions.defaults.boolean
            },
            gas: {
                name: 'Газ для производства',
                types: entityOptions.complex.gas
            },
            steam: {
                name: 'Пар для производства',
                types: entityOptions.defaults.boolean
            },
            internet: {
                name: 'Интернет',
                types: entityOptions.complex.internet
            },
            phone_line: {
                name: 'Телекоммуникация',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Оборудование',
        properties: {
            racks: {
                name: 'Стеллажи',
                types: entityOptions.defaults.boolean
            },
            rack_types: {
                name: 'Типы стеллажей',
                types: entityOptions.part.rack,
                multiple: true
            },
            charging_room: {
                name: 'Зарядная комната',
                types: entityOptions.defaults.boolean
            },
            warehouse_equipment: {
                name: 'Складская техника',
                types: entityOptions.defaults.boolean
            },
            cells: {
                name: 'Ячейки',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Безопасность',
        properties: {
            firefighting_type: {
                name: 'Система пожаротушения',
                types: entityOptions.floor.firefighting,
                multiple: true
            },
            smoke_exhaust: {
                name: 'Дымоудаление',
                types: entityOptions.defaults.boolean
            },
            video_control: {
                name: 'Видеонаблюдение',
                types: entityOptions.defaults.boolean
            },
            access_control: {
                name: 'Контроль доступа',
                types: entityOptions.defaults.boolean
            },
            security_alert: {
                name: 'Охранная сигнализация',
                types: entityOptions.defaults.boolean
            },
            fire_alert: {
                name: 'Пожарная сигнализация',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        name: 'Подъемные устройства',
        properties: {
            elevators: {
                name: 'Лифты/Подъемники',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            cranes: {
                name: 'Мостовые краны',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            telphers: {
                name: 'Тельферы',
                types: entityOptions.defaults.boolean
            },
            cranes_runways: {
                name: 'Подкрановые пути',
                types: entityOptions.defaults.boolean
            }
        }
    }
];

export const partProperties = {
    characteristicsWithSections,
    characteristicsWithSectionsForLand
};
