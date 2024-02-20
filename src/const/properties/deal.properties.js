import { unitTypes } from '@/const/unitTypes';

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

const commissionsList = [
    'commission_owner_value',
    'commission_owner',
    'commission_owner_type',
    'commission_client_value',
    'commission_client',
    'commission_agent_value',
    'commission_agent'
];

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
    specialsList
};
