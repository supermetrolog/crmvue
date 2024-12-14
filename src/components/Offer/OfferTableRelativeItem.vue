<template>
    <Tr
        class="offer-table-item"
        :class="{
            passive: isPassive
        }"
    >
        <Td class="offer-table-item__id text-center" :class="{ passive: isPassive }">
            <p class="mb-1">
                {{ offer.visual_id }}
            </p>
            <div class="offer-table-item__actions">
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
        </Td>
        <Td class="offer-table-item__preview">
            <OfferTableItemPreview :is-passive="isPassive" :offer="offer" />
        </Td>
        <Td class="offer-table-item__region text-center">
            <OfferTableItemAddress :offer="offer" />
        </Td>
        <Td class="offer-table-item__from-mkad text-center" sort="from_mkad">
            <p v-if="offer.from_mkad">{{ offer.from_mkad }} <small>км</small></p>
            <p v-else>—</p>
        </Td>
        <Td class="offer-table-item__area" sort="area">
            <div class="d-flex justify-content-center">
                <OfferTableItemArea :offer="offer" />
            </div>
        </Td>
        <Td class="offer-table-item__price" sort="price">
            <div class="d-flex justify-content-center">
                <OfferTableRelativeItemPrice :offer="offer" />
            </div>
        </Td>
        <Td class="offer-table-item__company">
            <CompanyElement
                v-if="offer.company"
                :company="offer.company"
                class="offer-table-item__company-element mb-2"
            />
        </Td>
        <Td class="offer-table-item__consultant">
            <div class="d-flex justify-content-center">
                <div v-if="offer.agent_id">
                    <div class="d-flex gap-2 align-items-center offer-table-item__avatar">
                        <AvatarEmpty :contact="offer.agent_name" />
                    </div>
                </div>
                <p v-else>—</p>
            </div>
        </Td>
        <Td class="offer-table-item__advertisement">
            <div class="offer-table-item__advertisements">
                <DashboardChip class="dashboard-bg-light">Realtor.ru</DashboardChip>
                <DashboardChip v-if="offer.ad_cian" class="dashboard-bg-light">Циан</DashboardChip>
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
        </Td>
        <Td class="offer-table-item__date" sort="last_update">
            <div class="d-flex justify-content-center">
                <div>
                    <DashboardChip v-if="offer.status === 1" class="dashboard-bg-success-l">
                        Актив
                    </DashboardChip>
                    <DashboardChip v-else class="dashboard-bg-danger text-white">
                        Пассив
                    </DashboardChip>
                    <TableDateBlock class="mt-1" :date="updatedAt" label="Дата обновления" />
                    <TableDateBlock
                        v-if="offer.last_call"
                        class="mt-1"
                        :date="offer.last_call.created_at"
                        label="Дата последнего звонка"
                    />
                </div>
            </div>
        </Td>
    </Tr>
</template>

<script setup>
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import OfferTableItemArea from '@/components/Offer/TableItem/OfferTableItemArea.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import OfferTableItemPreview from '@/components/Offer/TableItem/Preview/OfferTableItemPreview.vue';
import OfferTableItemAddress from '@/components/Offer/TableItem/OfferTableItemAddress.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import OfferTableRelativeItemPrice from '@/components/Offer/OfferTableRelativeItemPrice.vue';
import AvatarEmpty from '@/components/common/AvatarEmpty.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { getLinkPDF } from '@/utils/url.js';

const emit = defineEmits(['favorite-deleted']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const store = useStore();
const { openChat } = useMessenger();

const updatedAt = computed(() => {
    return props.offer.last_update * 1000;
});

const isFavorite = computed(() => store.state.Offers.favoritesOffersCache[props.offer.original_id]);
const isPassive = computed(() => props.offer.status !== 1);

const toggleFavorite = async () => {
    if (!isFavorite.value) return await store.dispatch('ADD_FAVORITES_OFFER', props.offer);

    const deleted = await store.dispatch('DELETE_FAVORITES_OFFERS', props.offer);
    if (deleted) emit('favorite-deleted', props.offer);
};

const openPDF = () => {
    window.open(
        getLinkPDF(
            {
                type_id: 2,
                offer_id: props.offer.original_id,
                object_id: props.offer.object_id
            },
            store.getters.THIS_USER.id
        ),
        '_blank'
    );
};

const openInChat = () => {
    openChat(props.offer.company_id, props.offer.object_id, 'object');
};
</script>
