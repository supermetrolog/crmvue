import { unitTypes } from "../../const/unitTypes";
import { tradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import { gateTypes } from "@/types/gateTypes.enum";
import {aboutComplexProperties} from "@/const/aboutComplexProperties";

export default {
  parameters: {
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
  },
  holdings: [
    {
      id: 1488,
      type: 1,
      area: {
        valueMin: 22000,
        valueMax: 22000,
      },
      floorArea: {
        valueMin: 22000,
        valueMax: 22000,
      },
      address: {
        district: "Московская область",
        city: "Фрязино",
        street: "Свидетельская",
        houseNumber: 34,
      },
      owners: [
        {
          name: "ОАО Альстом - Атомконстракшн Энергомаш",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ООО Севертранс",
          rating: 1,
          contacts: [1, 2, 3],
          requests: [1, 2, 3],
          objects: [1],
        },
        {
          name: "ГК ФораФарм",
          rating: 5,
          contacts: [1, 2, 3, 4, 5],
          requests: [1],
          objects: [1, 2, 3, 4, 5],
        },
        {
          name: "ООО Севертранс",
          rating: 3,
          contacts: [1],
          requests: [1, 2, 3, 4, 5],
          objects: [1, 2, 3],
        },
        {
          name: "ОАО Альстом - Атомконстракшн Энергомаш",
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
      parameters: {
        characteristics: {
          height: {
            ...tradeOfferCharacteristics.characteristics.height,
            valueMin: 1,
            valueMax: 15,
          },
          floorType: {
            ...tradeOfferCharacteristics.characteristics.floorType,
            value: "Антипыль",
          },
          floorLoad: {
            ...tradeOfferCharacteristics.characteristics.floorLoad,
            valueMin: 6,
            valueMax: 6,
          },
          columnGrid: {
            ...tradeOfferCharacteristics.characteristics.columnGrid,
            value: "12x18",
          },
          gatesNumber: {
            ...tradeOfferCharacteristics.characteristics.gatesNumber,
            valueMin: 5,
            valueMax: 5,
            gateType: gateTypes.DOCK_TYPE,
          },
          temperature: {
            ...tradeOfferCharacteristics.characteristics.temperature,
            valueMin: 10,
            valueMax: 12,
          },
          entry: {
            ...tradeOfferCharacteristics.characteristics.entry,
            value: "собственный",
          },
        },
        facilities: {
          shelving: {
            ...tradeOfferCharacteristics.facilities.shelving,
            value: true,
          },
          shelvingType: {
            ...tradeOfferCharacteristics.facilities.shelvingType,
            value: "мезанинные",
          },
          storageType: {
            ...tradeOfferCharacteristics.facilities.storageType,
            value: "напольное",
          },
          chargingRoom: {
            ...tradeOfferCharacteristics.facilities.chargingRoom,
            value: false,
          },
          warehouseEquipment: {
            ...tradeOfferCharacteristics.facilities.warehouseEquipment,
            value: true,
          },
        },
        communications: {
          electricity: {
            ...tradeOfferCharacteristics.communications.electricity,
            valueMin: 500,
            valueMax: 500,
          },
          lighting: {
            ...tradeOfferCharacteristics.communications.lighting,
            value: true,
          },
          heating: {
            ...tradeOfferCharacteristics.communications.heating,
            value: true,
          },
          heatingType: {
            ...tradeOfferCharacteristics.communications.heatingType,
            value: "дровяное",
          },
          waterSupply: {
            ...tradeOfferCharacteristics.communications.waterSupply,
            value: "центральное",
          },
          sewage: {
            ...tradeOfferCharacteristics.communications.sewage,
            value: true,
          },
          ventilation: {
            ...tradeOfferCharacteristics.communications.ventilation,
            value: "приточно-вытяжн.",
          },
          climatControl: {
            ...tradeOfferCharacteristics.communications.climatControl,
            value: true,
          },
          gasForProduction: {
            ...tradeOfferCharacteristics.communications.gasForProduction,
            value: false,
          },
          steamForProduction: {
            ...tradeOfferCharacteristics.communications.steamForProduction,
            value: false,
          },
          internet: {
            ...tradeOfferCharacteristics.communications.internet,
            value: true,
          },
          telephony: {
            ...tradeOfferCharacteristics.communications.telephony,
            value: true,
          },
        },
        securitySystems: {
          firefighting: {
            ...tradeOfferCharacteristics.securitySystems.firefighting,
            value: "спринклерное",
          },
          smokeКemoval: {
            ...tradeOfferCharacteristics.securitySystems.smokeКemoval,
            value: true,
          },
          internalVideoSurveillance: {
            ...tradeOfferCharacteristics.securitySystems
              .internalVideoSurveillance,
            value: true,
          },
          internalAccessControll: {
            ...tradeOfferCharacteristics.securitySystems.internalAccessControll,
            value: true,
          },
          securityAlarm: {
            ...tradeOfferCharacteristics.securitySystems.securityAlarm,
            value: true,
          },
          fireAlarm: {
            ...tradeOfferCharacteristics.securitySystems.fireAlarm,
            value: true,
          },
        },
        liftingDevices: {
          lifts: {
            ...tradeOfferCharacteristics.liftingDevices.lifts,
            valueMin: 2,
            valueMax: 2,
            liftingDevicesWeight: [5, 3],
          },
          bridgeCranes: {
            ...tradeOfferCharacteristics.liftingDevices.bridgeCranes,
            valueMin: 1,
            valueMax: 1,
            liftingDevicesWeight: [10],
          },
          beamCranes: {
            ...tradeOfferCharacteristics.liftingDevices.beamCranes,
            valueMin: 2,
            valueMax: 2,
            liftingDevicesWeight: [20],
          },
          telphers: {
            ...tradeOfferCharacteristics.liftingDevices.telphers,
            valueMin: 3,
            valueMax: 3,
            liftingDevicesWeight: [1],
          },
          craneRunways: {
            ...tradeOfferCharacteristics.liftingDevices.craneRunways,
            value: true,
          },
        },
      },
    },
    {
      id: 1337,
      type: 2,
      area: {
        valueMin: 22000,
        valueMax: 22000,
      },
      floorArea: {
        valueMin: 22000,
        valueMax: 22000,
      },
      address: {
        district: "Московская область",
        city: "Фрязино",
        street: "Свидетельская",
        houseNumber: 34,
      },
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
      parameters: {
        characteristics: {
          height: {
            ...tradeOfferCharacteristics.characteristics.height,
            valueMin: 1,
            valueMax: 15,
          },
          floorType: {
            ...tradeOfferCharacteristics.characteristics.floorType,
            value: "Антипыль",
          },
          floorLoad: {
            ...tradeOfferCharacteristics.characteristics.floorLoad,
            valueMin: 6,
            valueMax: 6,
          },
          columnGrid: {
            ...tradeOfferCharacteristics.characteristics.columnGrid,
            value: "12x18",
          },
          gatesNumber: {
            ...tradeOfferCharacteristics.characteristics.gatesNumber,
            valueMin: 5,
            valueMax: 5,
            gateType: gateTypes.DOCK_TYPE,
          },
          temperature: {
            ...tradeOfferCharacteristics.characteristics.temperature,
            valueMin: 10,
            valueMax: 12,
          },
          entry: {
            ...tradeOfferCharacteristics.characteristics.entry,
            value: "собственный",
          },
        },
        facilities: {
          shelving: {
            ...tradeOfferCharacteristics.facilities.shelving,
            value: true,
          },
          shelvingType: {
            ...tradeOfferCharacteristics.facilities.shelvingType,
            value: "мезанинные",
          },
          storageType: {
            ...tradeOfferCharacteristics.facilities.storageType,
            value: "напольное",
          },
          chargingRoom: {
            ...tradeOfferCharacteristics.facilities.chargingRoom,
            value: false,
          },
          warehouseEquipment: {
            ...tradeOfferCharacteristics.facilities.warehouseEquipment,
            value: true,
          },
        },
        communications: {
          electricity: {
            ...tradeOfferCharacteristics.communications.electricity,
            valueMin: 500,
            valueMax: 500,
          },
          lighting: {
            ...tradeOfferCharacteristics.communications.lighting,
            value: true,
          },
          heating: {
            ...tradeOfferCharacteristics.communications.heating,
            value: true,
          },
          heatingType: {
            ...tradeOfferCharacteristics.communications.heatingType,
            value: "дровяное",
          },
          waterSupply: {
            ...tradeOfferCharacteristics.communications.waterSupply,
            value: "центральное",
          },
          sewage: {
            ...tradeOfferCharacteristics.communications.sewage,
            value: true,
          },
          ventilation: {
            ...tradeOfferCharacteristics.communications.ventilation,
            value: "приточно-вытяжн.",
          },
          climatControl: {
            ...tradeOfferCharacteristics.communications.climatControl,
            value: true,
          },
          gasForProduction: {
            ...tradeOfferCharacteristics.communications.gasForProduction,
            value: false,
          },
          steamForProduction: {
            ...tradeOfferCharacteristics.communications.steamForProduction,
            value: false,
          },
          internet: {
            ...tradeOfferCharacteristics.communications.internet,
            value: true,
          },
          telephony: {
            ...tradeOfferCharacteristics.communications.telephony,
            value: true,
          },
        },
        securitySystems: {
          firefighting: {
            ...tradeOfferCharacteristics.securitySystems.firefighting,
            value: "спринклерное",
          },
          smokeКemoval: {
            ...tradeOfferCharacteristics.securitySystems.smokeКemoval,
            value: true,
          },
          internalVideoSurveillance: {
            ...tradeOfferCharacteristics.securitySystems
              .internalVideoSurveillance,
            value: true,
          },
          internalAccessControll: {
            ...tradeOfferCharacteristics.securitySystems.internalAccessControll,
            value: true,
          },
          securityAlarm: {
            ...tradeOfferCharacteristics.securitySystems.securityAlarm,
            value: true,
          },
          fireAlarm: {
            ...tradeOfferCharacteristics.securitySystems.fireAlarm,
            value: true,
          },
        },
        liftingDevices: {
          lifts: {
            ...tradeOfferCharacteristics.liftingDevices.lifts,
            valueMin: 2,
            valueMax: 2,
            liftingDevicesWeight: [5, 3],
          },
          bridgeCranes: {
            ...tradeOfferCharacteristics.liftingDevices.bridgeCranes,
            valueMin: 1,
            valueMax: 1,
            liftingDevicesWeight: [10],
          },
          beamCranes: {
            ...tradeOfferCharacteristics.liftingDevices.beamCranes,
            valueMin: 2,
            valueMax: 2,
            liftingDevicesWeight: [20],
          },
          telphers: {
            ...tradeOfferCharacteristics.liftingDevices.telphers,
            valueMin: 3,
            valueMax: 3,
            liftingDevicesWeight: [1],
          },
          craneRunways: {
            ...tradeOfferCharacteristics.liftingDevices.craneRunways,
            value: true,
          },
        },
      },
    },
    {
      id: 228,
      type: 1,
      area: {
        valueMin: 22000,
        valueMax: 22000,
      },
      floorArea: {
        valueMin: 22000,
        valueMax: 22000,
      },
      address: {
        district: "Московская область",
        city: "Фрязино",
        street: "Свидетельская",
        houseNumber: 34,
      },
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
      parameters: {
        characteristics: {
          height: {
            ...tradeOfferCharacteristics.characteristics.height,
            valueMin: 1,
            valueMax: 15,
          },
          floorType: {
            ...tradeOfferCharacteristics.characteristics.floorType,
            value: "Антипыль",
          },
          floorLoad: {
            ...tradeOfferCharacteristics.characteristics.floorLoad,
            valueMin: 6,
            valueMax: 6,
          },
          columnGrid: {
            ...tradeOfferCharacteristics.characteristics.columnGrid,
            value: "12x18",
          },
          gatesNumber: {
            ...tradeOfferCharacteristics.characteristics.gatesNumber,
            valueMin: 5,
            valueMax: 5,
            gateType: gateTypes.DOCK_TYPE,
          },
          temperature: {
            ...tradeOfferCharacteristics.characteristics.temperature,
            valueMin: 10,
            valueMax: 12,
          },
          entry: {
            ...tradeOfferCharacteristics.characteristics.entry,
            value: "собственный",
          },
        },
        facilities: {
          shelving: {
            ...tradeOfferCharacteristics.facilities.shelving,
            value: true,
          },
          shelvingType: {
            ...tradeOfferCharacteristics.facilities.shelvingType,
            value: "мезанинные",
          },
          storageType: {
            ...tradeOfferCharacteristics.facilities.storageType,
            value: "напольное",
          },
          chargingRoom: {
            ...tradeOfferCharacteristics.facilities.chargingRoom,
            value: false,
          },
          warehouseEquipment: {
            ...tradeOfferCharacteristics.facilities.warehouseEquipment,
            value: true,
          },
        },
        communications: {
          electricity: {
            ...tradeOfferCharacteristics.communications.electricity,
            valueMin: 500,
            valueMax: 500,
          },
          lighting: {
            ...tradeOfferCharacteristics.communications.lighting,
            value: true,
          },
          heating: {
            ...tradeOfferCharacteristics.communications.heating,
            value: true,
          },
          heatingType: {
            ...tradeOfferCharacteristics.communications.heatingType,
            value: "дровяное",
          },
          waterSupply: {
            ...tradeOfferCharacteristics.communications.waterSupply,
            value: "центральное",
          },
          sewage: {
            ...tradeOfferCharacteristics.communications.sewage,
            value: true,
          },
          ventilation: {
            ...tradeOfferCharacteristics.communications.ventilation,
            value: "приточно-вытяжн.",
          },
          climatControl: {
            ...tradeOfferCharacteristics.communications.climatControl,
            value: true,
          },
          gasForProduction: {
            ...tradeOfferCharacteristics.communications.gasForProduction,
            value: false,
          },
          steamForProduction: {
            ...tradeOfferCharacteristics.communications.steamForProduction,
            value: false,
          },
          internet: {
            ...tradeOfferCharacteristics.communications.internet,
            value: true,
          },
          telephony: {
            ...tradeOfferCharacteristics.communications.telephony,
            value: true,
          },
        },
        securitySystems: {
          firefighting: {
            ...tradeOfferCharacteristics.securitySystems.firefighting,
            value: "спринклерное",
          },
          smokeКemoval: {
            ...tradeOfferCharacteristics.securitySystems.smokeКemoval,
            value: true,
          },
          internalVideoSurveillance: {
            ...tradeOfferCharacteristics.securitySystems
              .internalVideoSurveillance,
            value: true,
          },
          internalAccessControll: {
            ...tradeOfferCharacteristics.securitySystems.internalAccessControll,
            value: true,
          },
          securityAlarm: {
            ...tradeOfferCharacteristics.securitySystems.securityAlarm,
            value: true,
          },
          fireAlarm: {
            ...tradeOfferCharacteristics.securitySystems.fireAlarm,
            value: true,
          },
        },
        liftingDevices: {
          lifts: {
            ...tradeOfferCharacteristics.liftingDevices.lifts,
            valueMin: 2,
            valueMax: 2,
            liftingDevicesWeight: [5, 3],
          },
          bridgeCranes: {
            ...tradeOfferCharacteristics.liftingDevices.bridgeCranes,
            valueMin: 1,
            valueMax: 1,
            liftingDevicesWeight: [10],
          },
          beamCranes: {
            ...tradeOfferCharacteristics.liftingDevices.beamCranes,
            valueMin: 2,
            valueMax: 2,
            liftingDevicesWeight: [20],
          },
          telphers: {
            ...tradeOfferCharacteristics.liftingDevices.telphers,
            valueMin: 3,
            valueMax: 3,
            liftingDevicesWeight: [1],
          },
          craneRunways: {
            ...tradeOfferCharacteristics.liftingDevices.craneRunways,
            value: true,
          },
        },
      },
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
