import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';

const characteristicsWithSections = [
    {
        id: 'areas',
        name: 'Основное',
        properties: {
            area_field_full: {
                name: 'S - участка (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_buildings_full: {
                name: 'S - строений (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_floor_full: {
                name: 'S - этажей (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_office_full: {
                name: 'S - офисная (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_tech_full: {
                name: 'S - техническая (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            managment_company: {
                name: 'Управляющая компания',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'communications',
        name: 'Коммуникации',
        properties: {
            power: {
                name: 'Электричество',
                types: entityOptions.defaults.boolean
            },
            power_value: {
                name: 'Электричество, мощность',
                condition: 'power',
                count: true,
                unitType: unitTypes.KILOWATT
            },
            heating_central: {
                name: 'Отопление центральное',
                types: entityOptions.defaults.boolean
            },
            heating_autonomous: {
                name: 'Отопление автономное',
                types: entityOptions.defaults.boolean
            },
            heating_autonomous_type: {
                name: 'Отопление автономное, виды',
                condition: 'heating_autonomous',
                multiple: true,
                types: entityOptions.complex.heatingAutonomous
            },
            water: {
                name: 'Водоснабжение',
                types: entityOptions.defaults.boolean
            },
            water_type: {
                name: 'Водоснабжение, виды',
                condition: 'water',
                multiple: true,
                types: entityOptions.complex.water
            },
            water_value: {
                name: 'Водоснабжение, объем',
                condition: 'water',
                count: true,
                unitType: unitTypes.CUBE_METERS_PER_DAY
            },
            sewage: {
                name: 'Центральная канализация',
                types: entityOptions.defaults.boolean
            },
            sewage_value: {
                name: 'Центральная канализация, объем',
                condition: 'sewage',
                count: true,
                unitType: unitTypes.CUBE_METERS_PER_DAY
            },
            sewage_rain: {
                name: 'Ливневая канализация',
                types: entityOptions.defaults.boolean
            },
            gas: {
                name: 'Газ для производства',
                types: entityOptions.defaults.boolean
            },
            gas_type: {
                name: 'Тип газ. подключения',
                condition: 'gas',
                types: entityOptions.complex.gas
            },
            gas_value: {
                name: 'Газ для производства, объем',
                condition: 'gas',
                count: true,
                unitType: unitTypes.CUBE_METERS_PER_HOUR
            },
            steam: {
                name: 'Пар для производства',
                types: entityOptions.defaults.boolean
            },
            steam_value: {
                name: 'Пар для производства, давление',
                condition: 'steam',
                count: true,
                unitType: unitTypes.BAR
            },
            internet: {
                name: 'Интернет',
                types: entityOptions.defaults.boolean
            },
            internet_type: {
                name: 'Интернет, тип подключения',
                condition: 'internet',
                multiple: true,
                types: entityOptions.complex.internet
            },
            phone_line: {
                name: 'Телекоммуникация',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'security',
        name: 'Безопасность',
        properties: {
            guard: {
                name: 'Охрана объекта',
                types: entityOptions.defaults.boolean
            },
            guard_type: {
                name: 'Охрана объекта, вид',
                condition: 'guard',
                multiple: true,
                types: entityOptions.complex.guard
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
            barrier: {
                name: 'Шлагбаум',
                types: entityOptions.defaults.boolean
            },
            fence: {
                name: 'Забор по периметру',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'railway',
        name: 'Железная дорога',
        properties: {
            railway: {
                name: 'Ж/Д на территории',
                types: entityOptions.defaults.boolean
            },
            railway_value: {
                name: 'Длина Ж/Д ветки',
                condition: 'railway',
                count: true,
                unitType: unitTypes.METERS
            }
        }
    },
    {
        id: 'infrastructure',
        name: 'Инфраструктура',
        properties: {
            entry_territory_type: {
                name: 'Въезд на территорию',
                types: entityOptions.complex.entryTerritory
            },
            entry_territory: {
                name: 'Плата за въезд',
                types: entityOptions.complex.entryTerritoryPrice
            },
            parking_car: {
                name: 'P легковая',
                types: entityOptions.defaults.boolean
            },
            parking_car_type: {
                name: 'P легковая, тариф',
                condition: 'parking_car',
                types: entityOptions.complex.parkingPrice
            },
            parking_lorry: {
                name: 'P 3-10 тонн',
                types: entityOptions.defaults.boolean
            },
            parking_lorry_type: {
                name: 'P 3-10 тонн, тариф',
                condition: 'parking_lorry',
                types: entityOptions.complex.parkingPrice
            },
            parking_truck: {
                name: 'P грузовая',
                types: entityOptions.defaults.boolean
            },
            parking_truck_type: {
                name: 'P грузовая, тариф',
                condition: 'parking_truck',
                types: entityOptions.complex.parkingPrice
            },
            canteen: {
                name: 'Столовая/кафе',
                types: entityOptions.defaults.boolean
            },
            hostel: {
                name: 'Общежитие',
                types: entityOptions.defaults.boolean
            }
        }
    }
];

export const complexProperties = {
    characteristicsWithSections
};
