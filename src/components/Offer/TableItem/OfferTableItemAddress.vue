<template>
    <a :href target="_blank" class="offer-table-item-address">
        <p v-if="offer.region_name" class="font-weight-bold">
            {{ offer.region_name }}
        </p>
        <p v-if="offer.district_name">
            {{ offer.district_name }}
        </p>
        <p v-if="offer.district_moscow_name">
            {{ offer.district_moscow_name }}
        </p>
        <p v-if="offer.direction_name">
            {{ offer.direction_name }}
        </p>
        <p v-if="offer.town_name">
            {{ offer.town_name }}
        </p>
        <p v-if="offer.highway_name">{{ offer.highway_name }} шоссе</p>
        <p v-if="offer.highway_moscow_name">{{ offer.highway_moscow_name }} шоссе</p>
        <hr />
        <p v-if="offer.address">
            {{ offer.address }}
        </p>
        <UiButton
            v-if="hasAddress"
            @click.stop.prevent="copyAddress"
            mini
            color="light"
            :icon="alreadyCopied ? 'fa-solid fa-check' : 'fa-solid fa-copy'"
            :disabled="alreadyCopied"
            class="offer-table-item-address__copy"
        >
            {{ alreadyCopied ? 'Скопировано' : 'Копировать адрес' }}
        </UiButton>
    </a>
</template>

<script setup>
import { computed } from 'vue';
import { getLinkOfferByObject } from '@/utils/url.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useClipboard } from '@vueuse/core';
import { useNotify } from '@/utils/use/useNotify';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const href = computed(() => getLinkOfferByObject(props.offer));

// copy

const { copy, text: clipboardText } = useClipboard();
const notify = useNotify();

const hasAddress = computed(
    () => isNotNullish(props.offer.address) && props.offer.address.length > 0
);

const alreadyCopied = computed(
    () => hasAddress.value && props.offer.address === clipboardText.value
);

function copyAddress() {
    copy(props.offer.address);
    notify.info('Адрес скопирован в буфер обмена');
}
</script>
