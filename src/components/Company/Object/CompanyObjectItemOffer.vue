<template>
    <div
        class="object-offer col-12"
        :class="{ passive: offer.status != 1 }"
        :title="offer.description || 'нет описания'"
    >
        <div class="row no-gutters px-2 object-offer-inf">
            <div class="col-12 text-left">
                <a :href="offerUrl" target="_blank">
                    <span class="object-offer__visual_id">{{ offer.visual_id }}</span>
                    <span>{{ offer.deal_type_name }}</span>
                    <span>
                        <b>
                            {{ offer.calc_area_general }}
                            м<sup>2</sup>
                        </b>
                    </span>
                    <span v-if="offer.deal_type == 1 || offer.deal_type == 4">
                        <b>
                            {{ offer.calc_price_warehouse }}
                            руб за м<sup>2</sup>/г
                        </b>
                    </span>
                    <span v-if="offer.deal_type == 2">
                        <b> {{ offer.calc_price_sale }} руб за м<sup>2</sup> </b>
                    </span>
                    <span v-if="offer.deal_type == 3">
                        <b>{{ offer.calc_price_safe_pallet }} руб за 1 п. м. </b>
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { getLinkOfferByObject } from '@/utils/url.js';

const props = defineProps({
    offer: {
        type: Object
    }
});

const offerUrl = computed(() => getLinkOfferByObject(props.offer));
</script>
