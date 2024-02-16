import { unitTypes } from '@/const/unitTypes';
import {
    entranceBlockTypes,
    firefightingTypes,
    floorTypes,
    gasTypes,
    gateTypes,
    gridColumnTypes,
    internetTypes,
    landCategoryTypes,
    landscapeTypes,
    lightingTypes,
    rackTypes,
    ventilationTypes,
    waterTypes
} from '@/const/types';

export const tradeOfferPriceProperties = {
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

export const tradeOfferParameters = {
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
        internet: {
            name: 'Интернет',
            icon: 'fas fa-wifi',
            types: internetTypes
        },
        water: {
            name: 'Водоснабжение',
            icon: 'fas fa-tint',
            types: waterTypes
        },
        sewage: {
            name: 'Канализация',
            icon: 'fas fa-shower'
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
        floor_types: {
            name: 'Тип пола',
            icon: 'fas fa-arrow-down',
            multiple: true,
            types: floorTypes
        },
        phone_line: {
            name: 'Телекоммуникация',
            icon: 'fa-solid fa-phone-volume'
        },
        gates: {
            name: 'Ворота',
            icon: 'fa-solid fa-archway',
            withCount: true,
            types: gateTypes
        },
        fire_alert: {
            name: 'Пожарная сигнализация',
            icon: 'fa-solid fa-bell'
        },
        racks: {
            name: 'Стеллажи',
            icon: 'fa-solid fa-box-archive'
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

export const objectParameters = {
    count: {
        power: {
            name: 'Электричество',
            icon: 'fas fa-bolt',
            unitType: unitTypes.KILOWATT
        },
        calc_ceiling_height: {
            name: 'Высота потолков',
            unitType: unitTypes.METERS,
            icon: 'fa-solid fa-arrows-down-to-line fa-rotate-180'
        },
        calc_gate_type: {
            name: 'Ворота',
            icon: 'fa-solid fa-archway'
        }
    },
    types: {
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

export const tradeOfferCharacteristics = [
    {
        name: 'Характеристики',
        properties: {
            floor_types: {
                name: 'Тип пола',
                multiple: true,
                types: floorTypes
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
                types: gridColumnTypes
            },
            gates: {
                name: 'Тип, кол-во ворот',
                count: true,
                unitType: unitTypes.PIECES,
                types: gateTypes
            },
            temperature: {
                name: 'Температура',
                range: true,
                unitType: unitTypes.CELCIUS
            },
            enterance_block: {
                name: 'Вход в блок',
                types: entranceBlockTypes
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
                types: lightingTypes
            },
            heated: {
                name: 'Отопление'
            },
            water: {
                name: 'Водоснабжение'
            },
            sewage: {
                name: 'Канализация'
            },
            ventilation: {
                name: 'Вентилация',
                multiple: true,
                types: ventilationTypes
            },
            climate_control: {
                name: 'Климат-контроль'
            },
            gas: {
                name: 'Газ для производства',
                types: gasTypes
            },
            steam: {
                name: 'Пар для производства'
            },
            internet: {
                name: 'Интернет',
                types: internetTypes
            },
            phone_line: {
                name: 'Телекоммуникация'
            }
        }
    },
    {
        name: 'Оборудование',
        properties: {
            racks: {
                name: 'Стеллажи'
            },
            rack_types: {
                name: 'Типы стеллажей',
                types: rackTypes,
                multiple: true
            },
            charging_room: {
                name: 'Зарядная комната'
            },
            warehouse_equipment: {
                name: 'Складская техника'
            },
            cells: {
                name: 'Ячейки'
            }
        }
    },
    {
        name: 'Безопасность',
        properties: {
            firefighting_type: {
                name: 'Система пожаротушения',
                types: firefightingTypes,
                multiple: true
            },
            smoke_exhaust: {
                name: 'Дымоудаление'
            },
            video_control: {
                name: 'Видеонаблюдение'
            },
            access_control: {
                name: 'Контроль доступа'
            },
            security_alert: {
                name: 'Охранная сигнализация'
            },
            fire_alert: {
                name: 'Пожарная сигнализация'
            }
        }
    },
    {
        name: 'Подъемные устройства',
        properties: {
            elevators_num: {
                name: 'Лифты/подъемники',
                count: true,
                unitType: unitTypes.PIECES
            },
            telphers: {
                name: 'Тельферы'
            },
            cranes_runways: {
                name: 'Подкрановые пути'
            }
        }
    }
    //     bridgeCranes: {
    //         name: 'Мостовые краны',
    //         required: false,
    //         unitType: unitTypes.PIECES
    //     },
    //     beamCranes: {
    //         name: 'Кран-балки',
    //         required: false,
    //         unitType: unitTypes.PIECES
    //     },
];

export const tradeOfferAdvertisements = {
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

export const craneProperties = {
    crane_capacity: {
        label: 'Грузоподъемность',
        unitType: unitTypes.TON
    },
    crane_span: {
        label: 'Длина пролета',
        unitType: unitTypes.METERS
    },
    crane_hook_height: {
        label: 'Высота до крюка',
        unitType: unitTypes.METERS
    },
    'beam.title': {
        label: 'Тип балки',
        condition: 'crane_beam'
    },
    'hoisting.title': {
        label: 'Подъемный механизм',
        condition: 'crane_hoisting'
    },
    'location.title': {
        label: 'Расположение',
        condition: 'crane_location'
    },
    crane_hooks: {
        label: 'Количество крюков',
        unitType: unitTypes.PIECES
    },
    crane_beams_amount: {
        label: 'Количество балок/мостов',
        unitType: unitTypes.PIECES
    },
    crane_documents: {
        label: 'Документы'
    },
    crane_supervision: {
        label: 'Под надзором'
    }
};

export const floorPartCharacteristics = {
    warehouseArea: {
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
    },
    characteristics: {
        ceiling_height: {
            name: 'Высота хранения',
            range: true,
            unitType: unitTypes.METERS
        },
        floor_types: {
            name: 'Тип пола',
            types: floorTypes,
            multiple: true
        },
        load_floor: {
            name: 'Нагр. на пол',
            range: true,
            unitType: unitTypes.TON_PER_SQUARE_METER
        },
        load_mezzanine: {
            name: 'Нагр. на мезонина',
            range: true,
            unitType: unitTypes.TON_PER_SQUARE_METER
        },
        column_grids: {
            name: 'Сетка колонн',
            multiple: true,
            types: gridColumnTypes
        },
        gates: {
            name: 'Тип, кол-во ворот',
            count: true,
            unitType: unitTypes.PIECES,
            types: gateTypes
        },
        temperature: {
            name: 'Тем-ра хранения',
            range: true,
            unitType: unitTypes.CELCIUS
        },
        enterance_block: {
            name: 'Вход в блок',
            types: entranceBlockTypes
        }
    },
    facilities: {
        racks: {
            name: 'Стеллажи'
        },
        rack_types: {
            name: 'Тип стеллажей',
            types: rackTypes
        },
        safe_type: {
            name: 'Тип хранения',
            count: true
        },
        charging_room: {
            name: 'Зарядная комната'
        },
        warehouse_equipment: {
            name: 'Складская техника'
        }
    },
    communications: {
        power: {
            name: 'Эл-во доступное',
            count: true,
            unitType: unitTypes.KILOWATT
        },
        lighting: {
            name: 'Освещение',
            multiple: true,
            types: lightingTypes
        },
        heated: {
            name: 'Отопление'
        },
        water: {
            name: 'Водоснабжение'
        },
        sewage: {
            name: 'Канализация'
        },
        ventilation: {
            name: 'Вентиляция'
        },
        climate_control: {
            name: 'Климат-контроль'
        },
        gas: {
            name: 'Газ для производства'
        },
        steam: {
            name: 'Пар для производства'
        },
        internet: {
            name: 'Интернет'
        },
        internet_type: {
            name: 'Тип интернета',
            multiple: true,
            types: internetTypes
        },
        phone_line: {
            name: 'Телефония'
        },
        fence: {
            name: 'Забор'
        },
        barrier: {
            name: 'Шлагбаум'
        },
        landscape_type: {
            name: 'Рельеф участка',
            types: landscapeTypes
        }
    },
    securitySystems: {
        firefighting_type: {
            name: 'Пожаротушение',
            types: firefightingTypes
        },
        smoke_exhaust: {
            name: 'Дымоудаление'
        },
        video_control: {
            name: 'Видеонаблюдение'
        },
        access_control: {
            name: 'Контроль доступа'
        },
        security_alert: {
            name: 'Охранная сигнализация'
        },
        fire_alert: {
            name: 'Пожарная сигнализация'
        }
    },
    liftingDevices: {
        elevators: {
            name: 'Лифты/Подъемники',
            length: true,
            unitType: unitTypes.PIECES
        },
        cranes: {
            name: 'Мостовые краны',
            length: true,
            unitType: unitTypes.PIECES
        },
        telphers: {
            name: 'Тельферы',
            length: true,
            unitType: unitTypes.PIECES
        },
        cranes_runways: {
            name: 'Подкрановые пути'
        }
    }
};
