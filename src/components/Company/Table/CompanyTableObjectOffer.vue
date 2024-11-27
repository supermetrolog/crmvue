<template>
    <div class="company-table-object-offer">
        <b>
            <span>{{ dealType }},</span>
            <WithUnitType class="ml-1" :unit-type="unitTypes.SQUARE_METERS">
                {{ toNumberOrRangeFormat(offer.area_min, offer.area_max) }}
            </WithUnitType>
        </b>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { entityOptions } from '@/const/options/options.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';

const props = defineProps({ offer: { type: Object, required: true } });

const dealType = computed(() => entityOptions.deal.type[props.offer.deal_type]);
</script>
