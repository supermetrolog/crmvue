<template>
    <div class="trade-offer-summary">
        <PropertyGrid :template="gridTemplate" :sections="parameters" />
    </div>
</template>

<script>
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import PropertyGrid from '@/components/common/Property/PropertyGrid.vue';

export default {
    name: 'ComplexDealSummary',
    components: { PropertyGrid },
    inject: ['objectIsLand'],
    props: {
        summary: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        parameters() {
            const currentProperties = this.objectIsLand
                ? entityProperties.deal.characteristicsWithSectionsForLand
                : entityProperties.deal.characteristicsWithSections;

            return mapper.propertiesToTableFormatWithSections(this.summary, currentProperties);
        },
        gridTemplate() {
            if (this.objectIsLand) {
                return [
                    ['characteristics', 'communications'],
                    ['security', 'lifting']
                ];
            }

            return [
                ['characteristics', 'security', 'lifting'],
                ['communications', 'equipment']
            ];
        }
    }
};
</script>
