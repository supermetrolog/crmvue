<template>
    <div class="messenger-quiz-question-template-offer__preview">
        <OfferTableItemPreviewMotionSlider
            :thumb="offer.thumb"
            :photos="offer.object?.photo ?? []"
        />
        <div class="messenger-quiz-question-template-offer__preview-header">
            <span class="messenger-dialog-offer__id">{{ offer.visual_id }}</span>
            <UiButtonIcon
                @click.stop.prevent="$emit('show-preview')"
                small
                label="Открыть просмотр фото"
                class="bg-white"
                icon="fa-solid fa-image"
            />
        </div>
        <div v-if="offer.consultant" class="messenger-quiz-question-template-offer__chips">
            <Avatar
                :size="30"
                :label="`${offer.consultant.userProfile.medium_name} - консультант`"
                :src="offer.consultant.userProfile.avatar"
                class="messenger-quiz-question-template-offer__avatar"
            />
            <UiButtonIcon
                v-if="offer.object?.agent_visited"
                label="Был на объекте"
                small
                class="bg-white"
                icon="fa-solid fa-person-walking"
            />
            <div class="d-flex gap-1 align-items-center">
                <div
                    v-if="contractIsSigned"
                    v-tippy="contractTippy"
                    class="offer-table-item__icon"
                    :class="{ exclusive: isExclusive }"
                >
                    <i class="pl-2 fa-solid fa-file-signature"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import Avatar from '@/components/common/Avatar.vue';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['show-preview']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

// consultant

const contractIsSigned = computed(
    () => props.offer.offer?.contract_is_signed === dealOptions.contractStatement.SIGNED
);

const contractTippy = computed(
    () => dealOptions.contractType[props.offer.offer.contract_is_signed_type] + ' подписан'
);

const isExclusive = computed(
    () => props.offer.offer.contract_is_signed_type === dealOptions.contractTypeStatement.EXCLUSIVE
);
</script>
