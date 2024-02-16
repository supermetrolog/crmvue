<template>
    <li class="object-equipment">
        <span v-if="crane.state && crane.state.id > 1" class="object-equipment__info"></span>
        <Tooltip>
            <template #trigger>
                <IconCrane class="object-equipment__icon" />
                <p v-if="crane.crane_type" class="object-equipment__header">
                    {{ crane.type.title }}
                </p>
                <p v-if="crane.crane_capacity" class="object-equipment__header">
                    {{ crane.crane_capacity }} тонн
                </p>
            </template>
            <template #content>
                <span v-if="status" class="object-equipment__status">{{ status }}</span>
                <p v-if="crane.crane_type" class="object-equipment__title">
                    {{ crane.type.title }}
                </p>
                <p
                    v-for="(property, key) in properties"
                    :key="key"
                    class="object-equipment__element"
                >
                    <span class="object-equipment__category">{{ property.label }}:</span>
                    <with-unit-type v-if="property.unitType" :unit-type="property.unitType">
                        {{ property.value }}
                    </with-unit-type>
                    <span v-else>{{ property.value }}</span>
                </p>
            </template>
        </Tooltip>
    </li>
</template>

<script>
import Tooltip from '@/components/common/Tooltip.vue';
import { craneProperties } from '@/const/properties';
import { alg } from '@/utils/alg';
import WithUnitType from '@/components/common/WithUnitType.vue';
import IconCrane from '@/components/common/Icons/IconCrane.vue';

export default {
    name: 'ComplexHoldingParametersCrane',
    components: { IconCrane, WithUnitType, Tooltip },
    props: {
        crane: {
            type: Object,
            required: true
        }
    },
    computed: {
        properties() {
            const properties = Object.keys(craneProperties).map(key => {
                const propertiesObject = {
                    ...craneProperties[key]
                };

                if (craneProperties[key].condition) {
                    propertiesObject.value = this.crane[craneProperties[key].condition]
                        ? alg.extractDeepProperty(this.crane, key)[0]
                        : null;

                    return propertiesObject;
                }

                if (craneProperties[key].unitType) {
                    propertiesObject.value = this.crane[key];
                } else {
                    propertiesObject.value =
                        this.crane[key] === 1 ? 'Да/есть' : this.crane[key] === 0 ? 'Нет' : null;
                }

                return propertiesObject;
            });

            return alg.deleteObjectsWithUndueProperties(properties, 'value', 0);
        },
        status() {
            if (this.crane.state && this.crane.state.id > 1) {
                return this.crane.state.title;
            }

            return null;
        }
    }
};
</script>
