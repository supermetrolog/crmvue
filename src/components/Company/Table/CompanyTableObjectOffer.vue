<template>
    <div class="company-table-object-offer">
        <b>
            <span>{{ dealType }},</span>
            <WithUnitType class="ml-1" :unit-type="unitTypes.SQUARE_METERS">
                {{ offer.calc_area_general }}
            </WithUnitType>
        </b>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { entityOptions } from '@/const/options/options.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

const props = defineProps({ offer: { type: Object, required: true } });

const dealType = computed(() => entityOptions.deal.type[props.offer.deal_type]);
</script>
