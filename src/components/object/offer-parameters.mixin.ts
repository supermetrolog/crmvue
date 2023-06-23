import { parameterTypes } from "@/const/parameterTypes";
import { ICharacterictic } from "@/const/tradeOfferCharacteristics";
import { unitTypes } from "@/const/unitTypes";

export const OfferParametersMixin = {
  data() {
    return {
      parameterTypes,
      unitTypes,
    };
  },
  methods: {
    formattedParameter(parameter: ICharacterictic): string {
      if (
        parameter.value !== undefined &&
        typeof parameter.value === "boolean"
      ) {
        return parameter.value ? "есть" : "нет";
      }
      if (parameter.value && typeof parameter.value === "string")
        return parameter.value;
      // @ts-ignore
      return this.$formatter.numberOrRangeNew(
        parameter.valueMin,
        parameter.valueMax
      );
    },
    displayLiftingDevicesWeight(liftingDevicesWeight?: number[]) {
      return liftingDevicesWeight && liftingDevicesWeight.length > 0;
    },
  },
};
