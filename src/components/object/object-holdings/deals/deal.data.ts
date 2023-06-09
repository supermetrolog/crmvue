import { unitTypes } from "@/const/unitTypes";
import { IDeal } from "./deal.interface";

const dealData: IDeal[] = [
  {
    id: 1,
    type: 1,
    company: { name: "ОАО Арахис Каприз Лук" },
    area: {
      valueMin: 32400,
      valueMax: 125000,
    },
    price: {
      valueMin: 1200,
      valueMax: 1200,
      unitType: unitTypes.RUB_PER_YEAR,
    },
    status: 1,
    floors: [
      {
        name: "Мезонин 2",
        area: {
          valueMin: 5000,
          valueMax: 5000,
        },
        checked: false,
        sections: [
          {
            company: { name: "Сияние Чистоты" },
            area: {
              valueMin: 345,
              valueMax: 345,
            },
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: {
              valueMin: 228,
              valueMax: 228,
            },
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: {
              valueMin: 1000,
              valueMax: 1000,
            },
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
        area: {
          valueMin: 3000,
          valueMax: 3000,
        },
        checked: false,
        sections: [
          {
            company: { name: "Сияние Чистоты" },
            area: {
              valueMin: 345,
              valueMax: 345,
            },
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: {
              valueMin: 228,
              valueMax: 228,
            },
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: {
              valueMin: 1000,
              valueMax: 1000,
            },
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
        area: {
          valueMin: 3500,
          valueMax: 3500,
        },
        checked: false,
        sections: [
          {
            company: { name: "Сияние чистоты" },
            area: {
              valueMin: 345,
              valueMax: 345,
            },
            status: 2,
            checked: true,
          },
          {
            company: null,
            area: {
              valueMin: 1500,
              valueMax: 1500,
            },
            status: 5,
            checked: false,
          },
          {
            company: null,
            area: {
              valueMin: 930,
              valueMax: 930,
            },
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
          valueMin: 890,
          valueMax: 1200,
          unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
        },
        {
          label: "Ком платежи",
          valueMin: 150,
          valueMax: 200,
          unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
        },
      ],
      specialTerms: [
        {
          label: "Каникулы",
          valueMin: 3,
          valueMax: 7,
          unitType: unitTypes.MONTH,
        },
        {
          label: "Депозит",
          valueMin: 2,
          valueMax: 2,
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
            valueMin: 80,
            valueMax: 80,
            unitType: unitTypes.PERCENTS,
          },
          {
            label: "Средняя ставка аренды",
            valueMin: 7800,
            valueMax: 7800,
            unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
          },
          {
            label: "% долгих контрактов",
            valueMin: 80,
            valueMax: 80,
            unitType: unitTypes.PERCENTS,
          },
          {
            label: "Год последнего кап. ремон.",
            value: 2014,
            unitType: unitTypes.YEAR,
          },
          {
            label: "EBITDA",
            valueMin: 47800000,
            valueMax: 47800000,
            unitType: unitTypes.RUB_PER_YEAR,
          },
          {
            label: "Чистая прибыль",
            valueMin: 35800000,
            valueMax: 35800000,
            unitType: unitTypes.RUB_PER_YEAR,
          },
        ],
      },
    },
    buildingInfo: {
      area: {
        sum: {
          valueMin: 2000,
          valueMax: 15000,
        },
        properties: [
          {
            label: "S - пол 1 эт.",
            valueMin: 1000,
            valueMax: 3600,
          },
          {
            label: "S - пол 2 эт.",
            valueMin: 1000,
            valueMax: 3600,
          },
          {
            label: "S - пол 3 эт.",
            valueMin: 1000,
            valueMax: 3600,
          },
          {
            label: "S - пол 6 эт.",
            valueMin: 1920,
            valueMax: 1920,
          },
          {
            label: "S - мезон 1 яр.",
            valueMin: 1000,
            valueMax: 3600,
          },
          {
            label: "S - офисов",
            valueMin: 1200,
            valueMax: 2000,
          },
        ],
      },
      price: {
        sum: {
          valueMin: 1200000,
          valueMax: 16500685,
        },
        properties: [
          {
            label: "E - пол 1 эт.",
            valueMin: 500,
            valueMax: 800,
          },
          {
            label: "E - пол 2 эт.",
            valueMin: 6500,
            valueMax: 1200,
          },
          {
            label: "E - пол 3 эт.",
            valueMin: 1100000,
            valueMax: 16100000,
          },
          {
            label: "E - пол 6 эт.",
            valueMin: 2500,
            valueMax: 4500,
          },
          {
            label: "E - мезон 1 яр.",
            valueMin: 3250,
            valueMax: 3250,
          },
          {
            label: "E - офисов",
            value: null,
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
    area: {
      valueMin: 12000,
      valueMax: 12000,
    },
    price: {
      valueMin: 3500,
      valueMax: 3500,
      unitType: unitTypes.RUB_PER_YEAR,
    },
    status: 1,
    floors: [
      {
        name: "1 этаж",
        area: {
          valueMin: 3500,
          valueMax: 3500,
        },
        checked: false,
        sections: [
          {
            company: { name: "Сияние чистоты" },
            area: {
              valueMin: 345,
              valueMax: 345,
            },
            status: 2,
            checked: true,
          },
          {
            company: null,
            area: {
              valueMin: 1500,
              valueMax: 1500,
            },
            status: 5,
            checked: false,
          },
          {
            company: null,
            area: {
              valueMin: 930,
              valueMax: 930,
            },
            status: 5,
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
    area: {
      valueMin: 45500,
      valueMax: 100000,
    },
    price: {
      valueMin: 1000,
      valueMax: 3500,
      unitType: unitTypes.RUB_PER_YEAR,
    },
    status: 1,
    floors: [
      {
        name: "Мезонин 1",
        area: {
          valueMin: 3000,
          valueMax: 3000,
        },
        checked: false,
        sections: [
          {
            company: { name: "Сияние Чистоты" },
            area: {
              valueMin: 345,
              valueMax: 345,
            },
            status: 2,
            checked: true,
          },
          {
            company: { name: "Портос" },
            area: {
              valueMin: 228,
              valueMax: 228,
            },
            status: 2,
            checked: true,
          },
          {
            company: { name: "Арамис" },
            area: {
              valueMin: 1000,
              valueMax: 1000,
            },
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
        area: {
          valueMin: 3500,
          valueMax: 3500,
        },
        checked: false,
        sections: [
          {
            company: { name: "Сияние чистоты" },
            area: {
              valueMin: 345,
              valueMax: 345,
            },
            status: 2,
            checked: true,
          },
          {
            company: null,
            area: {
              valueMin: 1500,
              valueMax: 1500,
            },
            status: 5,
            checked: false,
          },
          {
            company: null,
            area: {
              valueMin: 930,
              valueMax: 930,
            },
            status: 5,
            checked: true,
          },
        ],
      },
    ],
  },
];

export default dealData;
