import { ITradeOffer } from "./tradeOfferTabs.interface";
const tradeOffers: ITradeOffer[] = [
  {
    id: "4867-1",
    active: true,
    lastUpdate: new Date(2019, 8, 28),
    area: {
      sum: {
        valueMin: 12500,
        valueMax: 12500,
      },
      properties: [
        {
          label: "S - пола 1 эт.",
          valueMin: 1000,
          valueMax: 3600,
        },
        {
          label: "S - пола 2 эт.",
          valueMin: 120,
          valueMax: 160,
        },
        {
          label: "S - мезон 1 яр.",
          valueMin: 1000,
          valueMax: 3600,
        },
        {
          label: "S - офисов.",
          valueMin: 120,
          valueMax: 160,
        },
      ],
    },
    price: {
      sum: {
        valueMin: 5000,
        valueMax: 5000,
      },
      properties: [
        {
          label: "E - пола 1 эт.",
          valueMin: 500,
          valueMax: 800,
        },
        {
          label: "E - пола 2 эт.",
          valueMin: 6500,
          valueMax: 12000,
        },
        {
          label: "E - мезон 1 яр.",
          valueMin: 1100000,
          valueMax: 16100000,
        },
        {
          label: "E - офисов.",
          valueMin: 6500,
          valueMax: 12000,
        },
      ],
    },
    status: {
      company: {
        name: "Транзит_СП",
        organization_type: "ООО",
      },
      date: new Date(2020, 3, 14),
      realtor: "Penny Lane Realty",
      consultant: "Отделенцев Александр",
    },
  },
  {
    id: "4867-2",
    lastUpdate: new Date(2019, 8, 28),
    active: true,
    area: {
      sum: {
        valueMin: 12500,
        valueMax: 12500,
      },
      properties: [
        {
          label: "S - пола 1 эт.",
          valueMin: 1000,
          valueMax: 3600,
        },
        {
          label: "S - пола 2 эт.",
          valueMin: 120,
          valueMax: 160,
        },
        {
          label: "S - мезон 1 яр.",
          valueMin: 1000,
          valueMax: 3600,
        },
        {
          label: "S - офисов.",
          valueMin: 120,
          valueMax: 160,
        },
      ],
    },
    price: {
      sum: {
        valueMin: 5000,
        valueMax: 5000,
      },
      properties: [
        {
          label: "E - пола 1 эт.",
          valueMin: 500,
          valueMax: 800,
        },
        {
          label: "E - пола 2 эт.",
          valueMin: 6500,
          valueMax: 12000,
        },
        {
          label: "E - мезон 1 яр.",
          valueMin: 1100000,
          valueMax: 16100000,
        },
        {
          label: "E - офисов.",
          valueMin: 6500,
          valueMax: 12000,
        },
      ],
    },
  },
  {
    id: "4867-3",
    lastUpdate: new Date(2019, 8, 28),
    active: false,
    area: {
      sum: {
        valueMin: 12500,
        valueMax: 12500,
      },
      properties: [
        {
          label: "S - пола 1 эт.",
          valueMin: 1000,
          valueMax: 3600,
        },
        {
          label: "S - пола 2 эт.",
          valueMin: 120,
          valueMax: 160,
        },
        {
          label: "S - мезон 1 яр.",
          valueMin: 1000,
          valueMax: 3600,
        },
        {
          label: "S - офисов.",
          valueMin: 120,
          valueMax: 160,
        },
      ],
    },
    price: {
      sum: {
        valueMin: 5000,
        valueMax: 5000,
      },
      properties: [
        {
          label: "E - пола 1 эт.",
          valueMin: 500,
          valueMax: 800,
        },
        {
          label: "E - пола 2 эт.",
          valueMin: 6500,
          valueMax: 12000,
        },
        {
          label: "E - мезон 1 яр.",
          valueMin: 1100000,
          valueMax: 16100000,
        },
        {
          label: "E - офисов.",
          valueMin: 6500,
          valueMax: 12000,
        },
      ],
    },
    status: {
      company: {
        name: "Транзит_СП",
        organization_type: "ООО",
      },
      date: new Date(2020, 3, 14),
      realtor: "Penny Lane Realty",
      consultant: "Отделенцев Александр",
    },
  },
];

export default tradeOffers;
