<template>
    <div class="trade-offer-summary">
        <PropertyGrid :template="gridTemplate" :sections="parameters" />
    </div>
</template>

<script setup>
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import PropertyGrid from '@/components/common/Property/PropertyGrid.vue';
import { computed, inject } from 'vue';

const objectIsLand = inject('objectIsLand');
const props = defineProps({
    summary: {
        type: Object,
        required: true
    }
});

const gridTemplate = objectIsLand
    ? [
          ['characteristics', 'communications'],
          ['security', 'lifting']
      ]
    : [
          ['characteristics', 'security', 'lifting'],
          ['communications', 'equipment']
      ];

const parameters = computed(() => {
    const currentProperties = objectIsLand
        ? entityProperties.deal.characteristicsWithSectionsForLand
        : entityProperties.deal.characteristicsWithSections;

    return mapper.propertiesToTableFormatWithSections(props.summary, currentProperties);
});
</script>
