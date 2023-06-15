import { unitTypes } from "@/const/unitTypes";
import { IDeal } from "./deal.interface";
import { tradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import { gateTypes } from "@/types/gateTypes.enum";

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
    owner: {
      name: "ОАО Альстом - Атомконстракшн Энергомаш",
      rating: 2,
      contacts: 3,
      requests: 2,
      objects: 16,
      representative: {
        name: "Смолянинов Илья",
        post: "Начальник производства",
      },
      phoneNumbers: ["89161257487", "84997535421", "89267663467"],
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
      parameters: {
        summary: {
          warehouseArea: {
            floor: {
              ...tradeOfferCharacteristics.warehouseArea.floor,
              valueMin: 1000,
              valueMax: 3600,
            },
            office: {
              ...tradeOfferCharacteristics.warehouseArea.office,
              value: "--",
            },
            technical: {
              ...tradeOfferCharacteristics.warehouseArea.technical,
              valueMin: 120,
              valueMax: 260,
            },
            palletPlaces: {
              ...tradeOfferCharacteristics.warehouseArea.palletPlaces,
              valueMin: 16000,
              valueMax: 16000,
            },
          },
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
              ...tradeOfferCharacteristics.securitySystems
                .internalAccessControll,
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
        blocks: [
          {
            title: "1 этаж",
            number: "838-1",
            properties: {
              warehouseArea: {
                floor: {
                  ...tradeOfferCharacteristics.warehouseArea.floor,
                  valueMin: 1000,
                  valueMax: 3600,
                },
                office: {
                  ...tradeOfferCharacteristics.warehouseArea.office,
                  value: "--",
                },
                technical: {
                  ...tradeOfferCharacteristics.warehouseArea.technical,
                  valueMin: 120,
                  valueMax: 260,
                },
                palletPlaces: {
                  ...tradeOfferCharacteristics.warehouseArea.palletPlaces,
                  valueMin: 16000,
                  valueMax: 16000,
                },
              },
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
                  value: "--",
                },
                storageType: {
                  ...tradeOfferCharacteristics.facilities.storageType,
                  value: "--",
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
                  ...tradeOfferCharacteristics.communications
                    .steamForProduction,
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
                  ...tradeOfferCharacteristics.securitySystems
                    .internalAccessControll,
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
            title: "2 этаж",
            number: "838-2",
            properties: {
              warehouseArea: {
                floor: {
                  ...tradeOfferCharacteristics.warehouseArea.floor,
                  valueMin: 1000,
                  valueMax: 3600,
                },
                office: {
                  ...tradeOfferCharacteristics.warehouseArea.office,
                  value: "--",
                },
                technical: {
                  ...tradeOfferCharacteristics.warehouseArea.technical,
                  valueMin: 120,
                  valueMax: 260,
                },
                palletPlaces: {
                  ...tradeOfferCharacteristics.warehouseArea.palletPlaces,
                  valueMin: 16000,
                  valueMax: 16000,
                },
              },
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
                  value: "--",
                },
                storageType: {
                  ...tradeOfferCharacteristics.facilities.storageType,
                  value: "--",
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
                  ...tradeOfferCharacteristics.communications
                    .steamForProduction,
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
                  ...tradeOfferCharacteristics.securitySystems
                    .internalAccessControll,
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
            title: "мезонин 1 ярус",
            number: "838-3",
            properties: {
              warehouseArea: {
                floor: {
                  ...tradeOfferCharacteristics.warehouseArea.floor,
                  valueMin: 1000,
                  valueMax: 3600,
                },
                office: {
                  ...tradeOfferCharacteristics.warehouseArea.office,
                  value: "--",
                },
                technical: {
                  ...tradeOfferCharacteristics.warehouseArea.technical,
                  valueMin: 120,
                  valueMax: 260,
                },
                palletPlaces: {
                  ...tradeOfferCharacteristics.warehouseArea.palletPlaces,
                  valueMin: 16000,
                  valueMax: 16000,
                },
              },
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
                  value: "--",
                },
                storageType: {
                  ...tradeOfferCharacteristics.facilities.storageType,
                  value: "--",
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
                  ...tradeOfferCharacteristics.communications
                    .steamForProduction,
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
                  ...tradeOfferCharacteristics.securitySystems
                    .internalAccessControll,
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
