import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';
import { ventilationTypes } from '@/const/types';

const characteristicsWithSections = [
    {
        id: 'characteristics',
        name: 'Характеристики',
        properties: {
            floor_types: {
                name: 'Тип пола',
                multiple: true,
                types: entityOptions.floor.floorTypes
            },
            ceiling_height: {
                name: 'Высота хранения',
                range: true,
                unitType: unitTypes.METERS
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
        id: 'communications',
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
                types: entityOptions.defaults.boolean
            },
            steam: {
                name: 'Пар для производства',
                types: entityOptions.defaults.boolean
            },
            internet: {
                name: 'Интернет',
                types: entityOptions.defaults.boolean
            },
            phone_line: {
                name: 'Телекоммуникация',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'equipment',
        name: 'Оборудование',
        properties: {
            racks: {
                name: 'Стеллажи',
                types: entityOptions.defaults.boolean
            },
            rack_types: {
                name: 'Типы стеллажей',
                types: entityOptions.part.rack,
                condition: 'racks',
                multiple: true
            },
            rack_levels: {
                name: 'Ярусность стеллажей',
                count: true,
                condition: 'racks'
            },
            safe_type: {
                name: 'Типы хранения',
                types: entityOptions.part.safe,
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
        id: 'security',
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
        id: 'lifting',
        name: 'Подъемные устройства',
        properties: {
            elevators_num: {
                name: 'Лифты/подъемники',
                count: true,
                unitType: unitTypes.PIECES
            },
            elevators: {
                name: 'Грузоподъемность подъемников',
                range: true,
                lengthCondition: 'elevators_num',
                unitType: unitTypes.TON
            },
            cranes_num: {
                name: 'Краны',
                count: true,
                unitType: unitTypes.PIECES
            },
            cranes: {
                name: 'Грузоподъемность кранов',
                range: true,
                lengthCondition: 'cranes_num',
                unitType: unitTypes.TON
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
        id: 'characteristics',
        name: 'Характеристики',
        properties: {
            floor_types_land: {
                name: 'Тип покрытия',
                multiple: true,
                types: entityOptions.floor.floorTypes
            }
        }
    },
    {
        id: 'communications',
        name: 'Коммуникации',
        properties: {
            power: {
                name: 'Мощность электричества',
                count: true,
                unitType: unitTypes.KILOWATT
            },
            water: {
                name: 'Водоснабжение',
                types: entityOptions.defaults.boolean
            },
            sewage: {
                name: 'Канализация',
                types: entityOptions.defaults.boolean
            },
            gas: {
                name: 'Газ для производства',
                types: entityOptions.defaults.boolean
            },
            steam: {
                name: 'Пар для производства',
                types: entityOptions.defaults.boolean
            },
            internet: {
                name: 'Интернет',
                types: entityOptions.defaults.boolean
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
            fence: {
                name: 'Забор по периметру',
                types: entityOptions.defaults.boolean
            },
            barrier: {
                name: 'Шлагбаум',
                types: entityOptions.defaults.boolean
            }
        }
    },
    {
        id: 'lifting',
        name: 'Подъемные устройства',
        properties: {
            elevators_num: {
                name: 'Лифты/подъемники',
                count: true,
                unitType: unitTypes.PIECES
            },
            elevators: {
                name: 'Грузоподъемность подъемников',
                range: true,
                lengthCondition: 'elevators_num',
                unitType: unitTypes.TON
            },
            cranes_num: {
                name: 'Краны',
                count: true,
                unitType: unitTypes.PIECES
            },
            cranes: {
                name: 'Грузоподъемность кранов',
                range: true,
                lengthCondition: 'cranes_num',
                unitType: unitTypes.TON
            },
            cranes_runways: {
                name: 'Подкрановые пути',
                types: entityOptions.defaults.boolean
            }
        }
    }
];

const priceWithSections = {
    service: {
        price_safe_service_document: 'Подготовка сопроводительных документов',
        price_safe_service_inventory: 'Выборочная инвентаризация',
        price_safe_service_packing_pack: 'Формирование коробов',
        price_safe_service_packing_pallet: 'Формирование паллет',
        price_safe_service_pallet: 'Предоставление поддонов',
        price_safe_service_recycling: 'Утилизация мусора',
        price_safe_service_report: 'Предоставление отчетов',
        price_safe_service_sealing: 'Опломбирование авто',
        price_safe_service_stickers: 'Стикеровка',
        price_safe_service_winding: 'Обмотка стретч пленкой 2-3 слоя'
    },
    service_in: {
        price_safe_pallet_eu_in: 'EU паллет 1.2*0.8*1.75',
        price_safe_pallet_fin_in: 'FIN паллет 1.2*1*1.75',
        price_safe_pallet_us_in: 'US паллет 1.2*1.2*1.75',
        price_safe_pallet_oversized_in: 'Негаб. паллет/груз до 2т.',
        price_safe_pallet_oversized_middle_in: 'Нагаб. паллет (2-5 т.)',
        price_safe_pallet_oversized_big_in: 'Негаб. паллет (5-8 т.)',
        price_safe_pack_big_complement: 'Комплектовка короба/мешка до 40кг',
        price_safe_pack_big_in: 'Короб/мешок до 40кг',
        price_safe_pack_middle_complement: 'Комплектовка короба/мешка до 25кг',
        price_safe_pack_middle_in: 'Короб/мешок до 25кг',
        price_safe_pack_small_complement: 'Комплектовка короба/мешка до 10кг',
        price_safe_pack_small_in: 'Короб/мешок до 10кг'
    },
    service_out: {
        price_safe_pallet_eu_out: 'EU паллет 1.2*0.8*1.75',
        price_safe_pallet_fin_out: 'FIN паллет 1.2*1*1.75',
        price_safe_pallet_us_out: 'US паллет 1.2*1.2*1.75',
        price_safe_pallet_oversized_out: 'Негаб. паллет/груз до 2т.',
        price_safe_pallet_oversized_middle_out: 'Нагаб. паллет (2-5 т.)',
        price_safe_pallet_oversized_big_out: 'Негаб. паллет (5-8 т.)',
        price_safe_pack_big_out: 'Короб/мешок до 40кг',
        price_safe_pack_middle_out: 'Короб/мешок до 25кг',
        price_safe_pack_small_out: 'Короб/мешок до 10кг'
    },
    range: {
        price_office: 'E - офисов',
        price_field: 'E - участка',
        price_sale: 'Цена за кв. м',
        price_tech: 'E - тех. помещений',
        price_safe_pallet_eu: 'EU паллет 1.2*0.8*1.75',
        price_safe_pallet_fin: 'FIN паллет 1.2*1*1.75',
        price_safe_pallet_us: 'US паллет 1.2*1.2*1.75',
        price_safe_pallet_oversized: {
            name: 'Негабаритный паллет',
            unitType: unitTypes.RUB_PER_PIECE
        },
        price_safe_cell_small: {
            name: 'Ячейки 30x40',
            unitType: unitTypes.RUB_PER_PIECE_PER_DAY
        },
        price_safe_cell_middle: {
            name: 'Ячейки 60x40',
            unitType: unitTypes.RUB_PER_PIECE_PER_DAY
        },
        price_safe_cell_big: {
            name: 'Ячейки 60x80',
            unitType: unitTypes.RUB_PER_PIECE_PER_DAY
        },
        price_safe_floor: {
            name: 'Напольное',
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_DAY
        },
        price_safe_volume: {
            name: 'Объемное',
            unitType: unitTypes.RUB_PER_CUBE_METERS_PER_DAY
        }
    },
    warehouse: {
        price_sub_three: 'E - подвала (-3 этажа)',
        price_sub_two: 'E - подвала (-2 этажа)',
        price_sub: 'E - подвала (-1 этажа)',
        price_floor: 'E - пола 1 этажa',
        price_floor_two: 'E - пола 2 этажa',
        price_floor_three: 'E - пола 3 этажa',
        price_floor_four: 'E - пола 4 этажa',
        price_floor_five: 'E - пола 5 этажa',
        price_floor_six: 'E - пола 6 этажa',
        price_mezzanine: 'E - мезонина 1 уровня',
        price_mezzanine_two: 'E - мезонина 2 уровня',
        price_mezzanine_three: 'E - мезонина 3 уровня',
        price_mezzanine_four: 'E - мезонина 4 уровня'
    }
};

const parameters = {
    range: {
        ceiling_height: {
            name: 'Высота потолка',
            unitType: unitTypes.METERS,
            icon: 'fa-solid fa-arrows-down-to-line fa-rotate-180'
        },
        temperature: {
            name: 'Температурный режим',
            unitType: unitTypes.CELCIUS,
            icon: 'fa-solid fa-temperature-three-quarters'
        },
        load_floor: {
            name: 'Нагрузка на пол',
            unitType: unitTypes.TON,
            icon: 'fa-solid fa-weight-hanging'
        }
    },
    types: {
        column_grids: {
            name: 'Сетка колонн',
            multiple: true,
            types: entityOptions.floor.gridColumn
        },
        gates: {
            name: 'Ворота',
            icon: 'fa-solid fa-archway',
            withCount: true,
            types: entityOptions.floor.gate
        },
        internet: {
            name: 'Интернет',
            icon: 'fas fa-wifi'
        },
        water: {
            name: 'Водоснабжение',
            icon: 'fas fa-tint'
        },
        sewage: {
            name: 'Канализация',
            icon: 'fas fa-shower'
        },
        lighting: {
            name: 'Освещение',
            icon: 'fa-solid fa-lightbulb',
            multiple: true,
            types: entityOptions.floor.lighting
        },
        heated: {
            name: 'Отопление',
            icon: 'fa fa-thermometer-full'
        },
        gas: {
            name: 'Газ',
            icon: 'fas fa-fire'
        },
        steam: {
            name: 'Пар',
            icon: 'fa-solid fa-cloud'
        },
        ventilation: {
            name: 'Вентилация',
            icon: 'fa-solid fa-mask-face',
            multiple: true,
            types: ventilationTypes
        },
        floor_types: {
            name: 'Тип пола',
            icon: 'fas fa-arrow-down',
            multiple: true,
            types: entityOptions.floor.floorTypes
        },
        floor_types_land: {
            name: 'Тип покрытия',
            icon: 'fas fa-arrow-down',
            multiple: true,
            types: entityOptions.floor.floorTypes
        },
        safe_type: {
            name: 'Тип хранения',
            icon: 'fa-solid fa-boxes-stacked',
            multiple: true,
            types: entityOptions.part.safe
        },
        phone_line: {
            name: 'Телекоммуникация',
            icon: 'fa-solid fa-phone-volume'
        },
        fire_alert: {
            name: 'Пожарная сигнализация',
            icon: 'fa-solid fa-bell'
        },
        warehouse_equipment: {
            name: 'Складская техника',
            icon: 'fa-solid fa-toolbox'
        },
        rack_types: {
            name: 'Стеллажи',
            icon: 'fa-solid fa-box-archive',
            multiple: true,
            types: entityOptions.part.rack
        },
        climate_control: {
            name: 'Климат-контроль',
            icon: 'fa-solid fa-poo-storm'
        },
        firefighting_type: {
            name: 'Система пожаротушения',
            icon: 'fa-solid fa-fire-extinguisher',
            types: entityOptions.floor.firefighting,
            multiple: true
        },
        smoke_exhaust: {
            name: 'Дымоудаление',
            icon: 'fa-solid fa-smog'
        },
        video_control: {
            name: 'Система видеонаблюдения',
            icon: 'fa-solid fa-video'
        },
        access_control: {
            name: 'Контроль доступа',
            icon: 'fa-solid fa-fingerprint'
        },
        security_alert: {
            name: 'Охранная сигнализация',
            icon: 'fa-solid fa-land-mine-on'
        },
        cranes_runways: {
            name: 'Подкрановые пути'
        }
    },
    count: {
        power: {
            name: 'Электричество',
            icon: 'fas fa-bolt',
            unitType: unitTypes.KILOWATT
        }
    }
};

const advertisements = {
    avito: {
        label: 'Авито',
        properties: {
            ad_avito: {
                label: 'Avito'
            }
        }
    },
    free: {
        label: 'Бесплатные',
        properties: {
            ad_free: {
                label: 'Бесплатные'
            }
        }
    },
    realtor: {
        label: 'Realtor',
        properties: {
            ad_realtor: {
                label: 'Реклама на сайте'
            },
            ad_special: {
                label: 'Спецпредложение'
            }
        }
    },
    cian: {
        label: 'Циан',
        properties: {
            ad_cian: {
                label: 'Реклама в ЦИАН'
            },
            ad_cian_top3: {
                label: 'Реклама в ТОП-3'
            },
            ad_cian_premium: {
                label: 'Премиум'
            },
            ad_cian_hl: {
                label: 'Выделить цветом'
            }
        }
    },
    yandex: {
        label: 'Яндекс Недвижимость',
        properties: {
            ad_yandex: {
                label: 'Реклама в Яндекс Недвижимость'
            },
            ad_yandex_premium: {
                label: 'Премиум'
            },
            ad_yandex_promotion: {
                label: 'Поднять в выдаче'
            },
            ad_yandex_raise: {
                label: 'Продвинуть объявление'
            }
        }
    }
};

export const offerProperties = {
    characteristicsWithSections,
    characteristicsWithSectionsForLand,
    priceWithSections,
    parameters,
    advertisements
};
