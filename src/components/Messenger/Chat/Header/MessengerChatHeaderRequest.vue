<template>
    <div class="messenger-chat-header-request">
        <div class="messenger-chat-header__description">
            <p class="messenger-chat-header__title">
                <span>
                    Запрос от {{ $formatter.companyName(company, dialog.model.company_id) }}
                </span>
                <span class="messenger-chat-header__id">, ID{{ dialog.model.id }} </span>
            </p>
            <p class="messenger-chat-header__deals">
                <i v-if="isActive" class="fa-solid fa-up-long"></i>
                <span v-if="dealType" class="messenger-dialog-request__type">{{ dealType }}</span>
                <span v-if="dialog.model.minArea || dialog.model.maxArea">
                    <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                        {{
                            $formatter.numberOrRangeNew(dialog.model.minArea, dialog.model.maxArea)
                        }}
                    </with-unit-type>
                </span>
            </p>
            <p class="messenger-chat-header__address">{{ locationText }}</p>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { locationOptions } from '@/const/options/location.options.js';
import { dealOptions } from '@/const/options/deal.options.js';
import { requestOptions } from '@/const/options/request.options.js';

const props = defineProps({
    dialog: {
        type: Object,
        required: true
    }
});

const store = useStore();

const company = computed(() => store.state.Messenger.currentPanel);

const dealType = computed(() => {
    return dealOptions.type[props.dialog.model.dealType + 1];
});

const isActive = computed(() => {
    return props.dialog.model.status === requestOptions.statusStatement.ACTIVE;
});

const directions = computed(() => {
    if (!props.dialog.model.directions) return [];

    return props.dialog.model.directions.map(
        element => locationOptions.directionWithShort[element.direction].full
    );
});
const districts = computed(() => {
    if (!props.dialog.model.districts) return [];

    return props.dialog.model.districts.map(element => locationOptions.district[element.district]);
});
const regionsText = computed(() => {
    if (!props.dialog.model.regions) return '';

    return props.dialog.model.regions
        .map(element => locationOptions.region[element.region])
        .join(', ');
});

const locationText = computed(() => {
    return [regionsText.value, ...directions.value, ...districts.value].join(', ');
});
</script>
