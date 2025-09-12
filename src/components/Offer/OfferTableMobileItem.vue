<template>
    <div>
        <DashboardCard class="offer-table-item-mobile" :class="{ passive: isPassive }">
            <OfferTableItemPreview :is-passive="isPassive" :offer="offer" class="mb-1" />
            <div class="offer-table-item-mobile__header">
                <DashboardChip class="dashboard-bg-light">
                    {{ offer.visual_id }}
                </DashboardChip>
                <div class="offer-table-item-mobile__actions">
                    <HoverActionsButton @click="openInChat" label="Открыть в чате">
                        <i class="fa-solid fa-comment" />
                    </HoverActionsButton>
                    <template v-if="offer.type_id !== 3">
                        <HoverActionsButton
                            @click="toggleFavorite"
                            :label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
                            :active="isFavorite"
                        >
                            <i class="fa-solid fa-star" />
                        </HoverActionsButton>
                        <HoverActionsButton @click="openPDF" label="Открыть PDF">
                            <i class="fa-solid fa-file-pdf" />
                        </HoverActionsButton>
                    </template>
                </div>
            </div>
            <p class="offer-table-item-mobile__address my-1">{{ offer.address }}</p>
            <div class="row">
                <div class="col-6">
                    <OfferTableItemArea :offer="offer" />
                </div>
                <div class="col-6">
                    <OfferTableItemPrice v-if="offer.offer" :offer="offer" />
                    <p v-else>—</p>
                </div>
            </div>
            <AccordionSimple without-render class="mt-1">
                <template #title>
                    <AccordionSimpleTrigger>
                        <DashboardChip class="offer-table-item-mobile__dropdown dashboard-bg-light">
                            <div class="d-flex justify-content-center gap-2">
                                <span>Подробнее</span>
                                <AccordionSimpleTriggerIcon />
                            </div>
                        </DashboardChip>
                    </AccordionSimpleTrigger>
                </template>
                <template #body>
                    <div class="py-1">
                        <OfferTableItemMobileAddress :offer="offer" class="mb-1" />
                        <DashboardChip
                            v-if="offer.from_mkad"
                            class="dashboard-bg-light w-100 text-center"
                        >
                            {{ offer.from_mkad }} <small>км от МКАД</small>
                        </DashboardChip>
                        <hr />
                        <CompanyElement
                            v-if="offer.company"
                            :company="offer.company"
                            class="offer-table-item__company-element my-2"
                        />
                        <p v-else class="error-message">Компания не заполнена</p>
                        <CompanyContact
                            v-if="contact"
                            class="offer-table-item__company-element my-2"
                            :contact="contact"
                        />
                        <p v-else class="error-message">Контакт не заполнен</p>
                        <hr />
                        <p class="offer-table-item-mobile__label">Статус</p>
                        <DashboardChip
                            v-if="offer.status === 1"
                            class="dashboard-bg-success-l w-100 text-center my-1"
                        >
                            Актив
                        </DashboardChip>
                        <DashboardChip
                            v-else
                            class="dashboard-bg-danger text-white w-100 text-center my-1"
                        >
                            Пассив
                        </DashboardChip>
                        <p class="offer-table-item-mobile__label">Консультант</p>
                        <DashboardChip
                            v-if="offer.object?.agent_visited"
                            class="dashboard-bg-danger-l w-100 text-center my-1"
                        >
                            Был на объекте
                        </DashboardChip>
                        <DashboardChip class="w-100 dashboard-bg-light text-center my-1">
                            <span v-if="offer.consultant">
                                {{ offer.consultant.userProfile.full_name }}
                            </span>
                            <span v-else>—</span>
                        </DashboardChip>
                        <p class="offer-table-item-mobile__label">Реклама</p>
                        <div class="offer-table-item-mobile__advertisements my-1">
                            <DashboardChip class="dashboard-bg-light">Realtor.ru</DashboardChip>
                            <DashboardChip v-if="offer.ad_cian" class="dashboard-bg-light">
                                Циан
                            </DashboardChip>
                            <DashboardChip v-if="offer.ad_yandex" class="dashboard-bg-light">
                                Яндекс
                            </DashboardChip>
                            <DashboardChip v-if="offer.ad_avito" class="dashboard-bg-light">
                                Авито
                            </DashboardChip>
                            <DashboardChip v-if="offer.ad_free" class="dashboard-bg-light">
                                Бесплатные
                            </DashboardChip>
                        </div>
                    </div>
                </template>
            </AccordionSimple>
            <p class="text-right mt-1 text-grey">Обновление: {{ updatedAt }}</p>
        </DashboardCard>
    </div>
</template>

<script setup>
import OfferTableItemPrice from '@/components/Offer/TableItem/OfferTableItemPrice.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import OfferTableItemPreview from '@/components/Offer/TableItem/Preview/OfferTableItemPreview.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';
import OfferTableItemMobileAddress from '@/components/Offer/TableItem/OfferTableItemMobileAddress.vue';
import OfferTableItemArea from '@/components/Offer/TableItem/OfferTableItemArea.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAuth } from '@/composables/useAuth';
import { getLinkPDF } from '@/utils/url.js';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const emit = defineEmits(['favorite-deleted']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const { openChat } = useMessenger();
const { currentUserId } = useAuth();
const store = useStore();

const contact = computed(() => {
    return props.offer.contact || props.offer.company?.mainContact;
});
const isFavorite = computed(() => {
    return store.state.Offers.favoritesOffersCache[props.offer.original_id];
});
const isPassive = computed(() => {
    return props.offer.status !== 1;
});
const toggleFavorite = async () => {
    if (!isFavorite.value) return store.dispatch('ADD_FAVORITES_OFFER', props.offer);

    await store.dispatch('DELETE_FAVORITES_OFFERS', props.offer);
    emit('favorite-deleted', props.offer);
};

const openInChat = () => {
    openChat(props.offer.company_id, props.offer.object_id, 'object');
};

const openPDF = () => {
    window.open(
        getLinkPDF(
            {
                type_id: 2,
                offer_id: props.offer.original_id,
                object_id: props.offer.object_id
            },
            currentUserId.value
        ),
        '_blank'
    );
};

const updatedAt = computed(() => {
    if (isNotNullish(props.offer.last_update)) return toDateFormat(props.offer.last_update * 1000);
    return null;
});
</script>
