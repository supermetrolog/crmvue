<template>
    <p v-if="object?.offers?.length" class="messenger-dialog-offer__category">
        <span
            v-for="dealType in preparedOffers"
            :key="dealType.id"
            :class="{ active: dealType.active, deleted: dealType.isDeleted }"
            class="messenger-dialog-offer__deal-type"
        >
            <i v-if="dealType.isDeleted" class="fa-solid fa-ban mr-1"></i>
            <i v-else-if="dealType.active" class="fa-solid fa-up-long mr-1"></i>
            <i v-else class="fa-solid fa-down-long mr-1"></i>
            <span>{{ dealType.label }}</span>
        </span>
    </p>
    <p v-else class="messenger-dialog-offer__category">Без предложений</p>
</template>
<script setup>
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import { objectChatMemberTypes } from '@/const/messenger.js';

const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        default: objectChatMemberTypes.RENT_OR_SALE
    }
});

const filteredTypes = computed(() => {
    if (props.type === objectChatMemberTypes.RENT_OR_SALE) {
        return props.object.offers.filter(
            element =>
                element.deal_type === dealOptions.typeStatement.RENT ||
                element.deal_type === dealOptions.typeStatement.SALE
        );
    }

    if (props.type === objectChatMemberTypes.SUBLEASE) {
        return props.object.offers.filter(
            element => element.deal_type === dealOptions.typeStatement.SUBLEASE
        );
    }

    return props.object.offers.filter(
        element => element.deal_type === dealOptions.typeStatement.STORAGE
    );
});

const preparedOffers = computed(() => {
    return filteredTypes.value.map(offer => ({
        id: offer.id,
        label: dealOptions.type[offer.deal_type],
        active: offer.status === 1 && !offer.is_deleted,
        isDeleted: offer.is_deleted
    }));
});
</script>
