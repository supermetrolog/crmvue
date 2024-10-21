<template>
    <div class="messenger-dialog-object-preview-commission messenger-dialog-preview-tippy">
        <p class="messenger-dialog-preview-tippy__title mb-2">Информация о комиссии:</p>
        <p class="mb-1">
            <span class="messenger-dialog-preview-tippy__label">% от собственника: </span>
            <span v-if="offer.commission_owner">
                <span>{{ offer.commission_owner === 1 ? 'да' : 'нет' }}, </span>
                <span v-if="offer.commission_owner_value">
                    {{ Number(offer.commission_owner_value) }}%,
                </span>
                <span v-else class="messenger-warning">процент не указан,</span>
                <span v-if="offer.commission_owner_sale">
                    {{ commissionOwnerType }}
                </span>
                <span v-else class="messenger-warning">метод оплаты не заполнен</span>
            </span>
            <span v-else class="messenger-warning">не заполнено</span>
        </p>
        <p class="mb-1">
            <span class="messenger-dialog-preview-tippy__label">% от клиента: </span>
            <span v-if="offer.commission_client">
                <span>{{ offer.commission_client === 1 ? 'да' : 'нет' }}, </span>
                <span v-if="offer.commission_client_value">
                    {{ Number(offer.commission_client_value) }}%
                </span>
                <span v-else class="messenger-warning">процент не указан</span>
            </span>
            <span v-else class="messenger-warning">не заполнено</span>
        </p>
        <p class="mb-1">
            <span class="messenger-dialog-preview-tippy__label">% агенту: </span>
            <span v-if="offer.commission_agent">
                <span>{{ offer.commission_agent === 1 ? 'да' : 'нет' }}, </span>
                <span v-if="offer.commission_agent_value">
                    {{ Number(offer.commission_agent_value) }}%
                </span>
                <span v-else class="messenger-warning">процент не указан</span>
            </span>
            <span v-else class="messenger-warning">не заполнено</span>
        </p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const commissionOwnerType = computed(
    () => dealOptions.commissionOwner[props.offer.commission_owner_type]
);
</script>
