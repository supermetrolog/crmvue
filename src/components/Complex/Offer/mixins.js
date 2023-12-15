import { parameterTypes } from '@/const/parameterTypes';
import { unitTypes } from '@/const/unitTypes';

export const OfferParametersMixin = {
    data() {
        return {
            parameterTypes,
            unitTypes
        };
    },
    methods: {
        formattedParameter(parameter) {
            if (parameter.value !== undefined && typeof parameter.value === 'boolean') {
                return parameter.value ? 'есть' : 'нет';
            }
            if (parameter.value && typeof parameter.value === 'string') return parameter.value;
            return this.$formatter.numberOrRangeNew(parameter.valueMin, parameter.valueMax);
        },
        displayLiftingDevicesWeight(liftingDevicesWeight) {
            return liftingDevicesWeight && liftingDevicesWeight.length > 0;
        }
    }
};

