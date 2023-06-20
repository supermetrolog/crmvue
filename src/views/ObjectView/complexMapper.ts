import {
  IAboutComlexProperties,
  aboutComplexProperties,
} from "@/const/aboutComplexProperties";
import { IComplex } from "@/store/modules/complex/state";

export const isNullish = (value: any) => {
  return value === null || value === undefined;
};

const setFieldValue = (
  isExists: boolean | null,
  value: string | number | null = null,
  type: string = ""
) => {
  if (isNullish(isExists)) {
    return null;
  } else if (isExists) {
    if (value) {
      return value;
    } else {
      return type ? "есть, " + type : "есть";
    }
  } else {
    return "нет";
  }
};

export const mapComplexAboutInfo = (
  complex: IComplex
): IAboutComlexProperties => {
  return {
    area: [
      {
        ...aboutComplexProperties.area[0],
        valueMin: complex.area_field_full,
        valueMax: complex.area_field_full,
      },
      {
        ...aboutComplexProperties.area[1],
        valueMin: complex.area_building,
        valueMax: complex.area_building,
      },
      {
        ...aboutComplexProperties.area[2],
        valueMin: complex.area_floor_full,
        valueMax: complex.area_floor_full,
      },
      {
        ...aboutComplexProperties.area[3],
        valueMin: complex.area_office_full,
        valueMax: complex.area_office_full,
      },
      {
        ...aboutComplexProperties.area[4],
        valueMin: complex.area_tech_full,
        valueMax: complex.area_tech_full,
      },
      {
        ...aboutComplexProperties.area[5],
        value: complex.managment_company ? "да" : "нет",
      },
    ],
    communications: [
      {
        ...aboutComplexProperties.communications[0],
        value: setFieldValue(complex.power, complex.power_value),
      },
      {
        ...aboutComplexProperties.communications[1],
        value: setFieldValue(complex.heating),
      },
      {
        ...aboutComplexProperties.communications[2],
        value: setFieldValue(complex.heating_autonomous),
      },
      {
        ...aboutComplexProperties.communications[3],
        value: setFieldValue(
          complex.heating_autonomous || null,
          complex.heating_autonomous_type
        ),
      },
      {
        ...aboutComplexProperties.communications[4],
        value: setFieldValue(complex.water),
      },
      {
        ...aboutComplexProperties.communications[5],
        value: setFieldValue(complex.sewage),
      },
      {
        ...aboutComplexProperties.communications[6],
        value: setFieldValue(complex.sewage_rain),
      },
      {
        ...aboutComplexProperties.communications[7],
        value: setFieldValue(complex.gas, complex.gas_value),
      },
      {
        ...aboutComplexProperties.communications[8],
        value: setFieldValue(complex.steam, complex.steam_value),
      },
      {
        ...aboutComplexProperties.communications[9],
        value: setFieldValue(complex.phone_line),
      },
      {
        ...aboutComplexProperties.communications[10],
        value: setFieldValue(complex.internet, null, "Опто-волокно"),
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
  };
};
