import { unitTypes } from "@/const/unitTypes";

export default [
  {
    id: 1,
    type: 1,
    company: { name: "ОАО Арахис Каприз Лук" },
    area: "32400 - 125000",
    price: { value: 1200, type: 8 },
    status: 1,
    floors: [
      {
        name: "Мезонин 2",
        area: 5000,
        checked: false,
        sections: [
          {
            company: { name: "Сияние Чистоты" },
            area: 345,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: 228,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: 1000,
            status: 3,
            checked: true,
          },
          {
            company: { name: "MEGA GROUP" },
            area: null,
            status: 2,
            checked: null,
          },
          {
            company: { name: "ИП Пушкин" },
            area: null,
            status: 2,
            checked: null,
          },
        ],
      },
      {
        name: "Мезонин 1",
        area: 3000,
        checked: false,
        sections: [
          {
            company: { name: "Сияние Чистоты" },
            area: 345,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: 228,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: 1000,
            status: 3,
            checked: true,
          },
          {
            company: { name: "MEGA GROUP" },
            area: null,
            status: 2,
            checked: null,
          },
          {
            company: { name: "ИП Пушкин" },
            area: null,
            status: 2,
            checked: null,
          },
        ],
      },
      {
        name: "1 этаж",
        area: 3500,
        checked: false,
        sections: [
          {
            company: { name: "Сияние чистоты" },
            area: 345,
            status: 2,
            checked: true,
          },
          {
            company: null,
            area: 1500,
            status: 5,
            checked: false,
          },
          {
            company: null,
            area: 930,
            status: 5,
            checked: true,
          },
        ],
      },
    ],
    builder: {
      name: "BTS",
      duration: "36 мес.",
      projectAvailability: true,
    },
    consultant: {
      name: "Артур Мандрыка",
      visitType: "Личное посещение",
    },
    additionalDetails: {
      taxForm: 1,
      exploitation: true,
      communal: false,
      extraCosts: [
        {
          label: "Орех",
          value: "890-1200",
          unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
        },
        {
          label: "Ком платежи",
          value: "150-200",
          unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
        },
      ],
      specialTerms: [
        {
          label: "Каникулы",
          value: "3-7",
          unitType: unitTypes.MONTH,
        },
        {
          label: "Депозит",
          value: "2",
          unitType: unitTypes.MONTH,
        },
        {
          label: "Залоговый пл.",
          value: "нет",
        },
      ],
      business: {
        type: "Арендный",
        info: [
          {
            label: "% заполняемости объекта",
            value: 80,
            unitType: unitTypes.PERCENTS,
          },
          {
            label: "Средняя ставка аренды",
            value: 7800,
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
            addRub: true,
          },
          {
            label: "% долгих контрактов",
            value: 80,
            unitType: unitTypes.PERCENTS,
          },
          {
            label: "Год последнего кап. ремон.",
            value: 2014,
            unitType: unitTypes.YEAR,
          },
          {
            label: "EBITDA",
            value: 47800000,
            unitType: unitTypes.PER_YEAR,
          },
          {
            label: "Чистая прибыль",
            value: 35800000,
            unitType: unitTypes.PER_YEAR,
          },
        ],
      },
    },
    buildingInfo: {
      area: {
        sum: {
          value: "2000 - 15000",
          unitType: unitTypes.SQUARE_METERS,
        },
        list: [
          {
            label: "S - пол 1 эт.",
            value: "1000-3600",
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            label: "S - пол 2 эт.",
            value: "1000-3600",
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            label: "S - пол 3 эт.",
            value: "1000-3600",
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            label: "S - пол 6 эт.",
            value: "1920",
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            label: "S - мезон 1 яр.",
            value: "1000-3600",
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            label: "S - офисов",
            value: "1200-2000",
            unitType: unitTypes.SQUARE_METERS,
          },
        ],
      },
      price: {
        sum: {
          value: "1200000 - 16500685",
          unitType: unitTypes.RUB,
        },
        list: [
          {
            label: "E - пол 1 эт.",
            value: "500-800",
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
          {
            label: "E - пол 2 эт.",
            value: "6500-12000",
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
          {
            label: "E - пол 3 эт.",
            value: "1100000-16100000",
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
          {
            label: "E - пол 6 эт.",
            value: "2500-4500",
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
          {
            label: "E - мезон 1 яр.",
            value: "3250",
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
          {
            label: "E - офисов",
            value: null,
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
        ],
      },
    },
  },
  {
    id: 2,
    type: 2,
    company: {
      name: "ООО БелТрастИнвестТТТТТТТТТТТТТТТТТТТТТТТТТТТТТТТТ",
    },
    area: "12000",
    price: { value: 3500 },
    status: 2,
    floors: [
      {
        name: "Мезонин 1",
        area: 3000,
        checked: false,
        sections: [
          {
            company: { name: "Объебос" },
            area: 345,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: 228,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: 1000,
            status: 3,
            checked: true,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    type: 1,
    company: null,
    area: "45500 - 100000",
    price: { value: null, type: 1 },
    status: 3,
    floors: [
      {
        name: "Мезонин 1",
        area: 2000,
        checked: false,
        sections: [
          {
            company: { name: "Объебос" },
            area: 345,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: 228,
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: 1000,
            status: 3,
            checked: true,
          },
        ],
      },
    ],
  },
];
