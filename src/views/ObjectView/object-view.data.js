import { aboutComplexProperties } from "@/const/aboutComplexProperties";
import { unitTypes } from "../../const/unitTypes";

export default {
  area: [
    {
      ...aboutComplexProperties.area[0],
      value: 449750,
    },
    {
      ...aboutComplexProperties.area[1],
      value: 250000,
    },
    {
      ...aboutComplexProperties.area[2],
      value: "да",
    },
  ],
  communications: [
    {
      ...aboutComplexProperties.communications[0],
      value: "3 000",
    },
    {
      ...aboutComplexProperties.communications[1],
      value: "центрально",
    },
    {
      ...aboutComplexProperties.communications[2],
      value: "газовое",
    },
    {
      ...aboutComplexProperties.communications[3],
      value: "центр., 3 000",
    },
    {
      ...aboutComplexProperties.communications[4],
      value: "септик",
    },
    {
      ...aboutComplexProperties.communications[5],
      value: "есть",
    },
    {
      ...aboutComplexProperties.communications[6],
      value: "приточно-вытяжная",
    },
    {
      ...aboutComplexProperties.communications[7],
      value: "есть, 1 000",
    },
    {
      ...aboutComplexProperties.communications[8],
      value: "есть, 700",
    },
    {
      ...aboutComplexProperties.communications[9],
      value: "есть",
    },
  ],
  safety: [
    {
      ...aboutComplexProperties.safety[0],
      value: "местная",
    },
    {
      ...aboutComplexProperties.safety[1],
      value: "сприклерное",
    },
    {
      ...aboutComplexProperties.safety[2],
      value: "есть",
    },
    {
      ...aboutComplexProperties.safety[3],
      value: "есть",
    },
    {
      ...aboutComplexProperties.safety[4],
      value: "есть",
    },
    {
      ...aboutComplexProperties.safety[5],
      value: "нет",
    },
  ],
  railway: [
    {
      ...aboutComplexProperties.railway[0],
      value: "есть, 200",
    },
  ],
  infrastructure: [
    {
      ...aboutComplexProperties.infrastructure[0],
      value: "платный",
    },
    {
      ...aboutComplexProperties.infrastructure[1],
      value: "есть, 2 500",
    },
    {
      ...aboutComplexProperties.infrastructure[2],
      value: "есть, бесплатная",
    },
    {
      ...aboutComplexProperties.infrastructure[3],
      value: "нет",
    },
    {
      ...aboutComplexProperties.infrastructure[4],
      value: "есть",
    },
    {
      ...aboutComplexProperties.infrastructure[5],
      value: "нет",
    },
  ],
  holdings: [
    {
      id: 1488,
      type: 1,
      owners: [
        {
          name: "ОАО Матье Бал",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 1,
          contacts: [1, 2, 3],
          requests: [1, 2, 3],
          objects: [1],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 5,
          contacts: [1, 2, 3, 4, 5],
          requests: [1],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3, 4, 5],
          objects: [1, 2, 3],
        },
      ],
      types: [
        { id: 644760, request_id: 9520, object_type: 4 },
        { id: 644761, request_id: 9520, object_type: 0 },
        { id: 644762, request_id: 9520, object_type: 6 },
        { id: 644763, request_id: 9520, object_type: 7 },
        { id: 644764, request_id: 9520, object_type: 21 },
        { id: 644765, request_id: 9520, object_type: 23 },
        { id: 644766, request_id: 9520, object_type: 25 },
        { id: 644767, request_id: 9520, object_type: 27 },
      ],
      typesGeneral: [
        { id: 21074, request_id: 9520, type: 0 },
        { id: 21075, request_id: 9520, type: 1 },
        { id: 21076, request_id: 9520, type: 2 },
      ],
      floors: [
        { number: -1, danger: true },
        { number: 1, danger: false },
        { number: 2, danger: false },
      ],
      properties: [
        [
          { name: "Общая площадь", value: 2974, unitType: 1 },
          { name: "S - пола", value: 449750, unitType: 1 },
          { name: "S - мезонина", value: 449750, unitType: 1 },
        ],
        [
          { name: "S - офисов", value: 2974, unitType: 1 },
          { name: "S - техническая", value: 449750, unitType: 1 },
          { name: "Этажность склада", value: 1, unitType: 7 },
          { name: "Класс объекта", value: "B" },
        ],
        [
          { name: "Внешняя отделка", value: "Сендвич-панели" },
          { name: "Год постройки", value: null },
          { name: "Год последнего ремонта", value: null },
        ],
        [
          { name: "Кадастровый номер", value: 1 },
          { name: "Правовой статус строения", value: "Бетонная залупа" },
          { name: "Ограничения", value: "Запрещено срать" },
        ],
      ],
    },
    {
      id: 1337,
      type: 2,
      owners: [
        {
          name: "ОАО Матье Бал",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 1,
          contacts: [1, 2, 3],
          requests: [1, 2, 3],
          objects: [1],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 5,
          contacts: [1, 2, 3, 4, 5],
          requests: [1],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3, 4, 5],
          objects: [1, 2, 3],
        },
      ],
      types: [
        { id: 644760, request_id: 9520, object_type: 4 },
        { id: 644761, request_id: 9520, object_type: 0 },
        { id: 644762, request_id: 9520, object_type: 6 },
        { id: 644763, request_id: 9520, object_type: 7 },
        { id: 644764, request_id: 9520, object_type: 21 },
        { id: 644765, request_id: 9520, object_type: 23 },
        { id: 644766, request_id: 9520, object_type: 25 },
        { id: 644767, request_id: 9520, object_type: 27 },
      ],
      typesGeneral: [
        { id: 21074, request_id: 9520, type: 0 },
        { id: 21075, request_id: 9520, type: 1 },
        { id: 21076, request_id: 9520, type: 2 },
      ],
      floors: [
        { number: -1, danger: true },
        { number: 1, danger: false },
        { number: 2, danger: false },
      ],
      properties: [
        [
          { name: "Площадь участка", value: 2974, unitType: 1 },
          { name: "Габариты участка", value: 123 },
          { name: "Кадастровый номер участка", value: 123 },
          { name: "Правовой статус участка", value: "Собственность" },
          { name: "Категория земли", value: "Земли промышленности" },
          { name: "Рельеф участка", value: "ровный" },
          { name: "Ограничения", value: "есть" },
        ],
      ],
    },
    {
      id: 228,
      type: 1,
      owners: [
        {
          name: "ОАО Матье Бал",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 1,
          contacts: [1, 2, 3],
          requests: [1, 2, 3],
          objects: [1],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 5,
          contacts: [1, 2, 3, 4, 5],
          requests: [1],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ЗАО Тсослю Бойво Pros.",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3, 4, 5],
          objects: [1, 2, 3],
        },
      ],
      types: [
        { id: 644760, request_id: 9520, object_type: 4 },
        { id: 644761, request_id: 9520, object_type: 0 },
        { id: 644762, request_id: 9520, object_type: 6 },
        { id: 644763, request_id: 9520, object_type: 7 },
        { id: 644764, request_id: 9520, object_type: 21 },
        { id: 644765, request_id: 9520, object_type: 23 },
        { id: 644766, request_id: 9520, object_type: 25 },
        { id: 644767, request_id: 9520, object_type: 27 },
      ],
      typesGeneral: [
        { id: 21074, request_id: 9520, type: 0 },
        { id: 21075, request_id: 9520, type: 1 },
        { id: 21076, request_id: 9520, type: 2 },
      ],
      floors: [
        { number: -1, danger: true },
        { number: 1, danger: false },
        { number: 2, danger: false },
      ],
      properties: [
        [
          {
            name: "Общая площадь",
            value: 2974,
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            name: "S - пола",
            value: 449750,
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            name: "S - мезонина",
            value: 449750,
            unitType: unitTypes.SQUARE_METERS,
          },
        ],
        [
          {
            name: "S - офисов",
            value: 2974,
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            name: "S - техническая",
            value: 449750,
            unitType: unitTypes.SQUARE_METERS,
          },
          {
            name: "Этажность склада",
            value: 1,
            unitType: unitTypes.FLOORS,
          },
          { name: "Класс объекта", value: "B" },
        ],
        [
          { name: "Внешняя отделка", value: "Сендвич-панели" },
          { name: "Год постройки", value: null },
          { name: "Год последнего ремонта", value: null },
        ],
        [
          { name: "Кадастровый номер", value: 1 },
          { name: "Правовой статус строения", value: "Бетонная залупа" },
          { name: "Ограничения", value: "Запрещено срать" },
        ],
      ],
    },
  ],
};
