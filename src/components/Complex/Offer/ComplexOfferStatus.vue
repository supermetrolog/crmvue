<template>
    <div class="trade-offer-status">
        <span>{{ status.company }}</span>
        <Tooltip>
            <template #content>
                <div class="trade-offer-status__list">
                    <span class="trade-offer-status__text"> Сделка #{{ status.dealId }} </span>
                    <span class="trade-offer-status__text">
                        {{ offerDate }}
                    </span>
                    <span class="trade-offer-status__text">
                        {{ status.realtor }}
                    </span>
                    <span class="trade-offer-status__text">
                        {{ status.consultant }}
                    </span>
                </div>
            </template>
        </Tooltip>
    </div>
</template>

<script>
import { tradeOfferTypes } from '@/const/types';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'ComplexOfferStatus',
    components: { Tooltip },
    props: {
        status: {
            type: Object,
            required: true
        }
    },
    computed: {
        offerStatus() {
            return tradeOfferTypes[this.status.type];
        },
        offerDate() {
            // return this.$formatter.date(this.status.finish_date);
            return '[Дата совершения сделки]';
        }
    },
    methods: {}
};
</script>
