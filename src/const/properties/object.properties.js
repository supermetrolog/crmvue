import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';
import { floorTypes, internetTypes, landCategoryTypes, landscapeTypes } from '@/const/types';

const characteristicsWithSections = [
    {
        id: 'area',
        name: 'Площади',
        properties: {
            area_building: {
                name: 'Общая площадь',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_floor_full: {
                name: 'S - пола (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            area_mezzanine_full: {
                name: 'S - мезонина (общая)',
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
            }
        }
    },
    {
        id: 'characteristics',
        name: 'Характеристики',
        properties: {
            floors_building: {
                name: 'Этажность склада',
                arraySize: true,
                unitType: unitTypes.FLOORS
            },
            object_class: {
                name: 'Класс объекта',
                types: entityOptions.object.class
            },
            facing_type: {
                name: 'Внешняя отделка',
                types: entityOptions.object.facing
            }
        }
    },
    {
        id: 'information',
        name: 'Юридическая информация',
        properties: {
            own_type: {
                name: 'Право на строение',
                types: entityOptions.object.ownType
            },
            cadastral_number: {
                name: 'Кадастровый номер',
                count: true
            },
            land_use_restrictions: {
                name: 'Ограничения',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'services',
        name: 'Обслуживание',
        properties: {
            year_build: {
                name: 'Год постройки',
                count: true,
                strict: true
            },
            year_repair: {
                name: 'Год последнего ремонта',
                count: true,
                strict: true
            }
        }
    }
];

const characteristicsForLandWithSections = [
    {
        id: 'main',
        name: 'Основное',
        properties: {
            area_field_full: {
                name: 'S - участка (общая)',
                count: true,
                unitType: unitTypes.SQUARE_METERS
            },
            land_length: {
                name: 'Длина участка',
                count: true,
                unitType: unitTypes.METERS
            },
            land_width: {
                name: 'Ширина участка',
                count: true,
                unitType: unitTypes.METERS
            },
            own_type_land: {
                name: 'Право на участок',
                types: entityOptions.object.ownTypeLand
            },
            cadastral_number_land: {
                name: 'Кадастровый номер',
                count: true
            },
            land_category: {
                name: 'Категория земли',
                types: entityOptions.object.landCategory
            },
            landscape_type: {
                name: 'Рельеф участка',
                types: entityOptions.object.landscape
            },
            land_use_restrictions: {
                name: 'Ограничения',
                types: entityOptions.defaults.boolean
            },
            first_line: {
                name: 'Первая линия',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'communications',
        name: 'Коммуникации',
        properties: {
            power: {
                name: 'Электроснабжение',
                types: entityOptions.defaults.boolean
            },
            heating_central: {
                name: 'Отопление центральное',
                types: entityOptions.defaults.boolean
            },
            water: {
                name: 'Водоснабжение',
                types: entityOptions.defaults.boolean
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
            sewage_central_value: {
                name: 'Центральная канализация, объем',
                condition: 'sewage_central',
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
    },
    {
        id: 'allow',
        name: 'В.Р.И',
        properties: {
            field_allow_usage: {
                name: 'Описание',
                count: true
            }
        }
    }
];

const parameters = {
    count: {
        calc_ceiling_height: {
            name: 'Высота потолков',
            unitType: unitTypes.METERS,
            icon: 'fa-solid fa-arrows-down-to-line fa-rotate-180'
        },
        calc_gate_type: {
            name: 'Ворота',
            icon: 'fa-solid fa-archway'
        },
        land_length: {
            name: 'Длина участка',
            unitType: unitTypes.METERS
        },
        land_width: {
            name: 'Ширина участка',
            unitType: unitTypes.METERS
        }
    },
    types: {
        own_type_land: {
            name: 'Право на участок',
            icon: 'fa-solid fa-passport',
            types: entityOptions.object.ownTypeLand
        },
        first_line: {
            name: 'Первая линия',
            icon: 'fa-regular fa-clock'
        },
        landscape_type: {
            name: 'Рельеф участка',
            icon: 'fa-solid fa-mountain-sun',
            types: landscapeTypes
        },
        land_category: {
            name: 'Категория земли',
            icon: 'fa-solid fa-layer-group',
            types: landCategoryTypes
        },
        land_use_restrictions: {
            name: 'Ограничения',
            icon: 'fa-solid fa-triangle-exclamation'
        },
        power: {
            name: 'Электричество',
            icon: 'fas fa-bolt'
        },
        heating: {
            name: 'Отопление',
            icon: 'fa fa-thermometer-full'
        },
        floor_type: {
            name: 'Тип пола',
            icon: 'fas fa-arrow-down',
            types: floorTypes
        },
        gas: {
            name: 'Газ в цеху',
            icon: 'fas fa-fire',
            countProperty: 'gas_value',
            unitType: unitTypes.CUBE_METERS_PER_HOUR
        },
        internet_type: {
            name: 'Интернет',
            icon: 'fas fa-wifi',
            multiple: true,
            types: internetTypes
        },
        water: {
            name: 'Водоснабжение',
            icon: 'fas fa-tint',
            countProperty: 'water_value',
            unitType: unitTypes.CUBE_METERS_PER_DAY
        },
        sewage: {
            name: 'Канализация',
            icon: 'fas fa-shower'
        },
        sewage_central: {
            name: 'Центр. канализация',
            icon: 'fas fa-shower'
        },
        sewage_rain: {
            name: 'Ливневая канализация',
            icon: 'fas fa-shower'
        },
        steam: {
            name: 'Пар',
            icon: 'fa-solid fa-cloud',
            countProperty: 'steam_value',
            unitType: unitTypes.BAR
        },
        ventilation: {
            name: 'Вентилация',
            icon: 'fa-solid fa-mask-face'
        },
        phone_line: {
            name: 'Телекоммуникация',
            icon: 'fa-solid fa-phone-volume'
        },
        railway: {
            name: 'Ж/Д ветка',
            icon: 'fa-solid fa-train',
            countProperty: 'railway_value',
            unitType: unitTypes.METERS
        },
        fire_alert: {
            name: 'Пожарная сигнализация',
            icon: 'fa-solid fa-bell'
        }
    }
};

export const objectProperties = {
    characteristicsWithSections,
    characteristicsForLandWithSections,
    parameters
};
