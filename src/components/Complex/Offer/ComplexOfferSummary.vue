<template>
    <div class="trade-offer-summary">
        <div class="trade-offer-summary__content">
            <div class="trade-offer-summary__column">
                <PropertyList
                    v-for="parameter in Object.keys(parameters)"
                    :key="parameter"
                    :title="parameterTypes[parameter]"
                    class="trade-offer-summary__table"
                >
                    <PropertyListItem
                        v-for="(subparameter, idx) of parameters[parameter]"
                        :key="subparameter.name + idx"
                        class="trade-offer-summary__item"
                        :value="formattedParameter(subparameter)"
                        :value-details="
                            subparameter.floorType || subparameter.gateType || subparameter.liftingDevicesWeight
                        "
                        :name="subparameter.name"
                        :unit-type="subparameter.unitType"
                    />
                </PropertyList>
            </div>
            <div class="trade-offer-summary__column">
                <div class="trade-offer-summary__description">
                    <p class="trade-offer-summary__title">Описание</p>
                    <p class="trade-offer-summary__text">{{ offerDesciption }}</p>
                </div>
                <div v-if="plan_scheme && plan_scheme.length > 0" class="trade-offer-summary__scheme">
                    <p class="trade-offer-summary__title">На планировках</p>
                    <img
                        v-for="(imgSrc, idx) in plan_scheme"
                        :key="idx"
                        :src="imgSrc"
                        alt="схема"
                        class="trade-offer-summary__image"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { OfferParametersMixin } from '@/components/Complex/Offer/mixins';
import PropertyListItem from '@/components/common/Property/PropertyListItem.vue';
import PropertyList from '@/components/common/Property/PropertyList.vue';

export default {
    name: 'ComplexOfferSummary',
    components: {
        PropertyList,
        PropertyListItem
    },
    mixins: [OfferParametersMixin],
    props: {
        parameters: {
            type: Object,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        plan_scheme: {
            type: Array
        }
    },
    data() {
        return {};
    },
    computed: {
        offerDesciption() {
            return this.description || 'нет описания';
        }
    }
};
</script>
