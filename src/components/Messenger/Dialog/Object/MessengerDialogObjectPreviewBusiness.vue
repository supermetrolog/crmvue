<template>
    <div class="messenger-dialog-object-preview-business messenger-dialog-preview-tippy">
        <p class="messenger-dialog-preview-tippy__title mb-2">Арендный бизнес:</p>
        <MessengerDialogPreviewTippyRow label="% заполняемости объекта">
            <span v-if="offer.rent_business_fill">{{ offer.rent_business_fill }}%</span>
        </MessengerDialogPreviewTippyRow>
        <MessengerDialogPreviewTippyRow label="Средняя ставка аренды">
            <WithUnitType
                v-if="offer.rent_business_price"
                :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
            >
                {{ toNumberFormat(offer.rent_business_price) }}
            </WithUnitType>
        </MessengerDialogPreviewTippyRow>
        <MessengerDialogPreviewTippyRow label="% долгих контрактов">
            <span v-if="offer.rent_business_long_contracts">
                {{ offer.rent_business_long_contracts }}%
            </span>
        </MessengerDialogPreviewTippyRow>
        <MessengerDialogPreviewTippyRow label="Год последнего ремонта">
            <span v-if="offer.rent_business_last_repair">
                {{ offer.rent_business_last_repair }}
            </span>
        </MessengerDialogPreviewTippyRow>
        <MessengerDialogPreviewTippyRow label="Срок окупаемости">
            <span v-if="offer.rent_business_payback">{{ offer.rent_business_payback }} лет</span>
        </MessengerDialogPreviewTippyRow>
        <MessengerDialogPreviewTippyRow label="EBITDA">
            <WithUnitType v-if="offer.rent_business_income" :unit-type="unitTypes.RUB_PER_YEAR">
                {{ toNumberFormat(offer.rent_business_income) }}
            </WithUnitType>
        </MessengerDialogPreviewTippyRow>
        <MessengerDialogPreviewTippyRow label="Чистая прибыль">
            <WithUnitType v-if="offer.rent_business_profit" :unit-type="unitTypes.RUB_PER_YEAR">
                {{ toNumberFormat(offer.rent_business_profit) }}
            </WithUnitType>
        </MessengerDialogPreviewTippyRow>
    </div>
</template>
<script setup>
import MessengerDialogPreviewTippyRow from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewTippyRow.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { unitTypes } from '@/const/unitTypes.js';

defineProps({
    offer: {
        type: [String, Array],
        required: true
    }
});
</script>
