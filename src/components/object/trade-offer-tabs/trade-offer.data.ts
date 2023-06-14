import { tradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import { ITradeOffer } from "./tradeOfferTabs.interface";
import { gateTypes } from "@/types/gateTypes.enum";
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
    parameters: {
      summary: {
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
      blocks: [
        {
          title: "1 этаж",
          number: "838-1",
          properties: {
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
        },
        {
          title: "2 этаж",
          number: "838-2",
          properties: {
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
        },
        {
          title: "мезонин 1 ярус",
          number: "838-3",
          properties: {
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
        },
      ],
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
    parameters: {
      summary: {
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
      blocks: [
        {
          title: "1 этаж",
          number: "838-1",
          properties: {
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
    parameters: {
      summary: {
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
      blocks: [
        {
          title: "1 этаж",
          number: "838-1",
          properties: {
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
        },
      ],
    },
  },
];

export default tradeOffers;
