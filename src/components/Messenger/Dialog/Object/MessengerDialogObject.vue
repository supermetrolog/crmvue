<template>
    <div class="messenger-dialog messenger-dialog-offer" :class="{ current: current }">
        <div class="messenger-dialog__body messenger-dialog-offer__body">
            <div class="messenger-dialog-offer__preview">
                <OfferTableItemPreviewMotionSlider
                    v-if="motionSlider"
                    :thumb="model.object.thumb"
                    :photos="model.object.photos ?? []"
                />
                <LazyImage
                    v-else
                    :src="model.object.thumb"
                    class="messenger-dialog-offer__image"
                    alt="file image"
                />
                <div class="messenger-dialog-offer__preview-header">
                    <span class="messenger-dialog-offer__id">{{ model.object.id }}</span>
                    <UiButtonIcon
                        v-if="hasModalPreview"
                        @click.stop.prevent="$emit('show-preview')"
                        small
                        label="Открыть просмотр фото"
                        class="messenger-dialog-offer__preview-button bg-white ml-auto"
                        icon="fa-solid fa-image"
                    />
                    <UiButtonIcon
                        v-if="showMap"
                        @click.stop.prevent="$emit('show-map')"
                        small
                        label="Показать на карте"
                        class="messenger-dialog-offer__preview-button bg-white"
                        icon="fa-solid fa-map-location-dot"
                    />
                </div>
                <Avatar
                    v-if="model.object.consultant"
                    :size="30"
                    :label="`${model.object.consultant.userProfile.medium_name} - консультант`"
                    :src="model.object.consultant.userProfile.avatar"
                    class="messenger-dialog__avatar"
                />
            </div>
            <div class="messenger-dialog-offer__description">
                <p
                    v-if="showCompany && model.object.company"
                    class="messenger-dialog-offer__company"
                >
                    {{ companyName }}
                </p>
                <p
                    class="messenger-dialog-offer__area"
                    :class="{ 'font-weight-semi': !showCompany }"
                >
                    <WithUnitType :unit-type="unitTypes.SQUARE_METERS" :value="currentArea" />
                    <template v-if="!model.object.is_land && model.object.floors_count">
                        | {{ floorsPluralLabel }}
                    </template>
                </p>
                <MessengerDialogObjectDealType :type="model.type" :offers="model.object.offers" />
                <p class="messenger-dialog-offer__address">
                    <Tooltip :text="model.object.address" icon="fa-solid fa-earth-americas" />
                    <span>{{ model.object.address }}</span>
                </p>
            </div>
        </div>
        <div v-if="!short" class="messenger-dialog__footer">
            <MessengerDialogPhone
                @click.stop="$emit('update-call')"
                :last-call="lastCall"
                :updated-at="updatedAt"
                :disabled="isDisabled"
            />
            <MessengerDialogFunctions v-if="statistic" :counts="statistic" />
        </div>
        <MessengerDialogLastMessage v-if="lastMessage" :last-message />
    </div>
</template>
<script setup>
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import Tooltip from '@/components/common/Tooltip.vue';
import { computed } from 'vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { useStore } from 'vuex';
import MessengerDialogObjectDealType from '@/components/Messenger/Dialog/Object/MessengerDialogObjectDealType.vue';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import Avatar from '@/components/common/Avatar.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { plural } from '@/utils/plural.js';

defineEmits(['update-call', 'show-preview', 'show-map']);
const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: Boolean,
    lastCall: Object,
    lastMessage: Object,
    statistic: Object,
    allDealTypes: Boolean,
    motionSlider: Boolean,
    hasModalPreview: Boolean,
    short: Boolean,
    showCompany: Boolean,
    showMap: Boolean
});

const store = useStore();

const isDisabled = computed(
    () => props.model.object.agent_id !== store.getters.THIS_USER.user_id_old
);
const updatedAt = computed(() => props.model.object.updated_at * 1000);
const companyName = computed(() =>
    getCompanyName(props.model.object.company, props.model.object.company.id)
);

const currentArea = computed(() => {
    return toNumberFormat(
        props.model.object.is_land
            ? props.model.object.area_field_full
            : props.model.object.area_building
    );
});

const floorsPluralLabel = computed(() =>
    plural(props.model.object.floors_count, '%d этаж', '%d этажа', '%d этажей')
);
</script>
