import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';

// Список услуг по категориям
const servicesWithCategories = [
    {
        name: 'Упаковка/комплектовка товаров',
        properties: {
            safe_service_complement: {
                name: 'Комплектация наборов',
                icon: 'fa-solid fa-people-carry-box'
            },
            safe_service_stickers: {
                name: 'Стикеровка и маркировка',
                icon: 'fa-solid fa-note-sticky'
            },
            safe_service_packing: {
                name: 'Упаковка товара',
                icon: 'fa-solid fa-box'
            },
            safe_service_repacking: {
                name: 'Переупаковка товара',
                icon: 'fa-solid fa-boxes-packing'
            },
            safe_service_co_packing: {
                name: 'Ко-пакинг'
            },
            safe_service_palleting: {
                name: 'Формирование паллет',
                icon: 'fa-solid fa-dolly'
            },
            safe_service_winding: {
                name: 'Обмотка стретч пленка',
                icon: 'fa-solid fa-ring'
            },
            safe_service_repair: {
                name: 'Ремонт упаковки',
                icon: 'fa-solid fa-screwdriver-wrench'
            }
        }
    },
    {
        name: 'Учет и инвентаризация',
        properties: {
            safe_service_managing_stocks: {
                name: 'Управление запасами',
                icon: 'fa-solid fa-cubes-stacked'
            },
            safe_service_packs_counting: {
                name: 'Пересчет по коробкам',
                icon: 'fa-solid fa-calculator'
            },
            safe_service_inventory: {
                name: 'Инвентаризация',
                icon: 'fa-solid fa-boxes-stacked'
            },
            safe_service_accounting_batch: {
                name: 'Партионный учет'
            },
            safe_service_accounting_serials: {
                name: 'Учет серийных номеров',
                icon: 'fa-solid fa-barcode'
            },
            safe_service_accounting_fifo: {
                name: 'Учет в разрезах FIFI, LIFI, FEFO, LEFO',
                icon: 'fa-solid fa-file-waveform'
            }
        }
    },
    {
        name: 'Документооборот',
        properties: {
            safe_service_documents: {
                name: 'Печать сопроводительных документов',
                icon: 'fa-solid fa-file-invoice'
            },
            safe_service_reports: {
                name: 'Предоставление отчетов',
                icon: 'fa-solid fa-clipboard'
            }
        }
    },
    {
        name: 'Комплексные услуги',
        properties: {
            safe_service_cross_docking: {
                name: 'Кросс-докинг',
                icon: 'fa-solid fa-code-fork'
            },
            safe_service_3pl: {
                name: '3PL услуги'
            }
        }
    },
    {
        name: 'Транспортировка/доставка',
        properties: {
            safe_service_delivery_town: {
                name: 'Достава товара по городу',
                icon: 'fa-solid fa-truck-fast'
            },
            safe_service_delivery_region: {
                name: 'Достава товара по региону',
                icon: 'fa-solid fa-truck'
            },
            safe_service_delivery_russia: {
                name: 'Достава товара по России',
                icon: 'fa-solid fa-truck-plane'
            }
        }
    },
    {
        name: 'Прочее',
        properties: {
            safe_service_handling: {
                name: 'Погрузочные работы',
                icon: 'fa-solid fa-people-carry-box'
            },
            safe_service_culling: {
                name: 'Выбраковка товара',
                icon: 'fa-solid fa-heart-crack'
            },
            safe_service_selection: {
                name: 'Подбор товаров',
                icon: 'fa-solid fa-magnifying-glass'
            },
            safe_service_give_pallets: {
                name: 'Предоставление паллет',
                icon: 'fa-solid fa-pallet'
            },
            safe_service_recycling: {
                name: 'Утилизация брака',
                icon: 'fa-solid fa-recycle'
            },
            safe_service_managing_returns: {
                name: 'Приемка возвратов',
                icon: 'fa-solid fa-money-bill-transfer'
            },
            safe_service_archive: {
                name: 'Архивное хранение',
                icon: 'fa-solid fa-box-archive'
            }
        }
    }
];

// Поля объекта "Арендный бизнес"
const rentBusiness = {
    rent_business_fill: {
        name: '% заполняемости объекта',
        unitType: unitTypes.PERCENTS
    },
    rent_business_price: {
        name: 'Средняя ставка аренды',
        unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
    },
    rent_business_long_contracts: {
        name: '% долгих контрактов',
        unitType: unitTypes.PERCENTS
    },
    rent_business_last_repair: {
        name: 'Год последнего кап. ремонта',
        unitType: unitTypes.YEAR
    },
    rent_business_payback: {
        name: 'Срок окупаемости',
        unitType: unitTypes.YEAR
    },
    rent_business_income: {
        name: 'EBITDA',
        unitType: unitTypes.RUB_PER_YEAR
    },
    rent_business_profit: {
        name: 'Чистая прибыль',
        unitType: unitTypes.RUB_PER_YEAR
    }
};

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
            pallet_place: {
                name: 'Кол-во паллет мест',
                range: true,
                unitType: unitTypes.PALLET_PLACE
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
            heating_exists: {
                name: 'Отопление'
            },
            water_exists: {
                name: 'Водоснабжение'
            },
            sewage_exists: {
                name: 'Канализация'
            },
            ventilation: {
                name: 'Вентилация',
                multiple: true,
                types: entityOptions.floor.ventilation
            },
            climate_control_exists: {
                name: 'Климат-контроль'
            },
            gas_exists: {
                name: 'Газ для производства'
            },
            steam_exists: {
                name: 'Пар для производства'
            },
            internet_exists: {
                name: 'Интернет'
            },
            phone_line_exists: {
                name: 'Телекоммуникация'
            }
        }
    },
    {
        id: 'equipment',
        name: 'Оборудование',
        properties: {
            racks_exists: {
                name: 'Стеллажи'
            },
            rack_types: {
                name: 'Типы стеллажей',
                types: entityOptions.part.rack,
                condition: 'racks_exists',
                multiple: true
            },
            safe_type: {
                name: 'Типы хранения',
                types: entityOptions.part.safe,
                multiple: true
            },
            charging_room_exists: {
                name: 'Зарядная комната'
            },
            warehouse_equipment_exists: {
                name: 'Складская техника'
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
            smoke_exhaust_exists: {
                name: 'Дымоудаление'
            },
            video_control_exists: {
                name: 'Видеонаблюдение'
            },
            access_control_exists: {
                name: 'Контроль доступа'
            },
            security_alert_exists: {
                name: 'Охранная сигнализация'
            }
        }
    },
    {
        id: 'lifting',
        name: 'Подъемные устройства',
        properties: {
            elevators: {
                name: 'Лифты/подъемники',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            cranes: {
                name: 'Краны',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            cranes_runways_exists: {
                name: 'Подкрановые пути'
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
                name: 'Доступное электричество',
                count: true,
                unitType: unitTypes.KILOWATT
            },
            lighting: {
                name: 'Освещение',
                multiple: true,
                types: entityOptions.floor.lighting
            },
            water_exists: {
                name: 'Водоснабжение'
            },
            sewage_exists: {
                name: 'Канализация'
            },
            gas_exists: {
                name: 'Газ для производства'
            },
            steam_exists: {
                name: 'Пар для производства'
            },
            internet_exists: {
                name: 'Интернет'
            },
            phone_line_exists: {
                name: 'Телекоммуникация'
            }
        }
    },
    {
        id: 'security',
        name: 'Безопасность',
        properties: {
            video_control_exists: {
                name: 'Видеонаблюдение'
            },
            access_control_exists: {
                name: 'Контроль доступа'
            },
            security_alert_exists: {
                name: 'Охранная сигнализация'
            }
        }
    },
    {
        id: 'lifting',
        name: 'Подъемные устройства',
        properties: {
            elevators: {
                name: 'Лифты/подъемники',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            cranes: {
                name: 'Краны',
                arraySize: true,
                unitType: unitTypes.PIECES
            },
            cranes_runways_exists: {
                name: 'Подкрановые пути'
            }
        }
    }
];

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
            unitType: unitTypes.TON_PER_SQUARE_METER,
            icon: 'fa-solid fa-weight-hanging'
        },
        load_mezzanine: {
            name: 'Нагрузка на мезонин',
            unitType: unitTypes.TON_PER_SQUARE_METER,
            icon: 'fa-solid fa-weight-scale'
        },
        pallet_place: {
            name: 'Количество паллет-мест',
            unitType: unitTypes.PALLET_PLACE,
            icon: 'fa-solid fa-pallet'
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
        internet_exists: {
            name: 'Интернет',
            icon: 'fas fa-wifi'
        },
        water_exists: {
            name: 'Водоснабжение',
            icon: 'fas fa-tint'
        },
        sewage_exists: {
            name: 'Канализация',
            icon: 'fas fa-shower'
        },
        lighting: {
            name: 'Освещение',
            icon: 'fa-solid fa-lightbulb',
            multiple: true,
            types: entityOptions.floor.lighting
        },
        heating_exists: {
            name: 'Отопление',
            icon: 'fa fa-thermometer-full'
        },
        gas_exists: {
            name: 'Газ',
            icon: 'fas fa-fire'
        },
        steam_exists: {
            name: 'Пар',
            icon: 'fa-solid fa-cloud'
        },
        ventilation: {
            name: 'Вентилация',
            icon: 'fa-solid fa-mask-face',
            multiple: true,
            types: entityOptions.floor.ventilation
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
        phone_line_exists: {
            name: 'Телекоммуникация',
            icon: 'fa-solid fa-phone-volume'
        },
        warehouse_equipment_exists: {
            name: 'Складская техника',
            icon: 'fa-solid fa-toolbox'
        },
        rack_types: {
            name: 'Стеллажи',
            icon: 'fa-solid fa-box-archive',
            multiple: true,
            types: entityOptions.part.rack
        },
        climate_control_exists: {
            name: 'Климат-контроль',
            icon: 'fa-solid fa-poo-storm'
        },
        firefighting_type: {
            name: 'Система пожаротушения',
            icon: 'fa-solid fa-fire-extinguisher',
            types: entityOptions.floor.firefighting,
            multiple: true
        },
        smoke_exhaust_exists: {
            name: 'Дымоудаление',
            icon: 'fa-solid fa-smog'
        },
        video_control_exists: {
            name: 'Система видеонаблюдения',
            icon: 'fa-solid fa-video'
        },
        access_control_exists: {
            name: 'Контроль доступа',
            icon: 'fa-solid fa-fingerprint'
        },
        security_alert_exists: {
            name: 'Охранная сигнализация',
            icon: 'fa-solid fa-land-mine-on'
        },
        cranes_runways_exists: {
            name: 'Подкрановые пути'
        }
    },
    count: {
        power: {
            name: 'Электричество',
            icon: 'fas fa-bolt',
            unitType: unitTypes.KILOWATT
        },
        elevators: {
            name: 'Подъемные устройства',
            icon: 'fa-solid fa-elevator',
            unitType: unitTypes.PIECES
        },
        cranes: {
            name: 'Краны',
            icon: 'fa-solid fa-sign-hanging',
            unitType: unitTypes.PIECES
        }
    }
};

const area = {
    area_floor: {
        name: 'S - пола этажей',
        range: true
    },
    area_field: {
        name: 'S - участка',
        range: true
    },
    area_mezzanine: {
        name: 'S - мезонина',
        range: true
    },
    area_office: {
        name: 'S - офисная',
        range: true
    },
    area_tech: {
        name: 'S - техническая',
        range: true
    }
};

// Поля, относящикся к комиссии
const commissionsList = [
    'commission_owner_value',
    'commission_owner',
    'commission_owner_type',
    'commission_client_value',
    'commission_client',
    'commission_agent_value',
    'commission_agent'
];

// Поля, относящиеся к Built To Suit/Rent
const specialsList = [
    'built_to_suit',
    'built_to_suit_time',
    'built_to_suit_plan',
    'built_to_suit_group'
];

export const dealProperties = {
    servicesWithCategories,
    rentBusiness,
    commissionsList,
    specialsList,
    characteristicsWithSections,
    characteristicsWithSectionsForLand,
    parameters,
    area
};
