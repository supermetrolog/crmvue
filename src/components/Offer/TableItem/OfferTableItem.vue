<template>
    <Tr
        class="offer-table-item"
        :class="{
            passive: isPassive
        }"
    >
        <Td class="offer-table-item__id text-center" :class="{ passive: isPassive }">
            <div class="offer-table-item__aside">
                <p class="mb-1">
                    {{ offer.visual_id }}
                </p>
                <div class="offer-table-item__actions">
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
                <OfferTableItemRelationSelect
                    v-if="offer.type_id !== 3 && offer.object?.offers?.length && !withoutRelations"
                    @open="openRelations"
                    :offers="offer.object.offers"
                    :current="offer.id"
                    :current-tab="currentRelationTab"
                />
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
                <OfferTableItemArea
                    @show-blocks="showBlocks"
                    @hide-blocks="hideBlocks"
                    :offer="offer"
                />
            </div>
        </Td>
        <Td class="offer-table-item__price" sort="price">
            <div class="d-flex justify-content-center">
                <OfferTableItemPrice v-if="offer.offer" :offer="offer" />
                <p v-else>—</p>
            </div>
        </Td>
        <Td class="offer-table-item__company">
            <CompanyElement
                v-if="offer.company"
                :company="offer.company"
                class="offer-table-item__company-element mb-2"
            />
            <CompanyContact
                v-if="contact"
                class="offer-table-item__company-element"
                :contact="contact"
            />
        </Td>
        <Td class="offer-table-item__consultant">
            <div class="d-flex justify-content-center">
                <div v-if="offer.consultant" class="d-flex flex-column align-items-center gap-1">
                    <Avatar
                        v-tippy="offer.consultant.userProfile.full_name"
                        :size="55"
                        :src="offer.consultant.userProfile.avatar"
                    />
                    <div class="d-flex gap-1 align-items-center">
                        <div
                            v-if="offer.object?.agent_visited"
                            v-tippy="'Был на объекте'"
                            class="offer-table-item__icon"
                        >
                            <i class="fa-solid fa-person-walking"></i>
                        </div>
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
                <p v-else>—</p>
            </div>
        </Td>
        <Td class="offer-table-item__advertisement">
            <div class="offer-table-item__advertisements">
                <DashboardChip v-if="offer.ad_realtor" class="dashboard-bg-light">
                    Realtor.ru
                </DashboardChip>
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
            <DashboardChip
                v-if="isPassive"
                class="dashboard-bg-danger offer-table-item__chip text-white"
            >
                Пассив
            </DashboardChip>
            <DashboardChip v-else class="dashboard-bg-success-l offer-table-item__chip">
                Актив
            </DashboardChip>
            <OfferTableItemCall @click="openInSurvey" :call="offer.last_call" />
            <HoverActionsButton
                @click="openInChat"
                class="my-2 mx-auto offer-table-item__chat"
                :label="`У вас ${offer.unread_message_count} непрочитанных сообщений по этому объекту`"
            >
                <div class="d-flex flex-column">
                    <i class="fa-solid fa-comment" />
                    <span>{{ offer.unread_message_count }}</span>
                </div>
            </HoverActionsButton>
            <TableDateBlock class="text-center" :date="updatedAt" label="Обновление" />
        </Td>
    </Tr>
    <DropDown>
        <OfferTableItemDropdown v-if="blocksDropdownIsOpen">
            <Button
                v-tippy="'Свернуть информацию о блоках'"
                @click="hideBlocks"
                class="offer-table-item__close w-100"
                info
            >
                <i class="fas fa-angle-up"></i>
            </Button>
            <Spinner v-if="blocksIsLoading" class="m-4" />
            <OfferMiniList v-else :offers="blockOffers" />
        </OfferTableItemDropdown>
    </DropDown>
    <DropDown>
        <OfferTableItemDropdown v-if="relationDropdownIsOpen">
            <Spinner v-if="relationsIsLoading" class="m-4" />
            <div v-else class="offer-table-item-dropdown__list">
                <OfferTableItem
                    v-for="offer in relatedOffers"
                    :key="offer.id"
                    :offer="offer"
                    without-relations
                />
            </div>
        </OfferTableItemDropdown>
    </DropDown>
</template>
<script setup>
import DropDown from '@/components/common/DropDown.vue';
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import api from '@/api/api.js';
import OfferTableItemDropdown from '@/components/Offer/TableItem/OfferTableItemDropdown.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import OfferTableItemArea from '@/components/Offer/TableItem/OfferTableItemArea.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import Avatar from '@/components/common/Avatar.vue';
import OfferTableItemPreview from '@/components/Offer/TableItem/Preview/OfferTableItemPreview.vue';
import OfferTableItemAddress from '@/components/Offer/TableItem/OfferTableItemAddress.vue';
import OfferTableItemPrice from '@/components/Offer/TableItem/OfferTableItemPrice.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { computed, shallowRef } from 'vue';
import { useStore } from 'vuex';
import OfferTableItemRelationSelect from '@/components/Offer/TableItem/OfferTableItemRelationSelect.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import OfferMiniList from '@/components/Offer/OfferMiniList.vue';
import Button from '@/components/common/Button.vue';
import OfferTableItem from '@/components/Offer/TableItem/OfferTableItem.vue';
import OfferTableItemCall from '@/components/Offer/TableItem/OfferTableItemCall.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { getLinkPDF } from '@/utils/url.js';
import { messenger } from '@/const/messenger.js';

const emit = defineEmits(['favorite-deleted', 'open-survey']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    loader: {
        type: Boolean,
        default: false
    },
    sortable: {
        type: Boolean,
        default: true
    },
    withoutRelations: {
        type: Boolean,
        default: false
    }
});

const { isLoading: blocksIsLoading } = useDelayedLoader();
const { isLoading: relationsIsLoading } = useDelayedLoader();
const store = useStore();
const { openChat, openSurvey } = useMessenger();

const currentRelationTab = shallowRef(null);
const relatedOffers = shallowRef([]);
const blockOffers = shallowRef([]);
const blocksDropdownIsOpen = shallowRef(false);
const relationDropdownIsOpen = shallowRef(false);

const updatedAt = computed(() => props.offer.last_update * 1000);
const currentUser = computed(() => store.getters.THIS_USER);
const contact = computed(() => props.offer.contact || props.offer.company?.mainContact);
const isFavorite = computed(() => store.state.Offers.favoritesOffersCache[props.offer.original_id]);
const isPassive = computed(() => props.offer.status !== 1);
const isExclusive = computed(
    () => props.offer.offer.contract_is_signed_type === dealOptions.contractTypeStatement.EXCLUSIVE
);
const contractIsSigned = computed(
    () => props.offer.offer?.contract_is_signed === dealOptions.contractStatement.SIGNED
);
const contractTippy = computed(
    () => dealOptions.contractType[props.offer.offer.contract_is_signed_type] + ' подписан'
);

const searchRelatedOffers = async (dealType, withLoading = false) => {
    if (withLoading) relationsIsLoading.value = true;

    const response = await api.offers.search({
        type_id: [2],
        deal_type: dealType - 1,
        status: 3, // Нужно чтобы прилетали и активные и пассивные
        object_id: props.offer.object_id,
        expand:
            'contact.emails,contact.phones,' +
            'object,' +
            'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.requests_count,company.contacts_count,' +
            'offer,' +
            'consultant.userProfile'
    });

    if (response) relatedOffers.value = response.data;
    if (withLoading) relationsIsLoading.value = false;
};

const searchBlockOffers = async () => {
    blocksIsLoading.value = true;

    const response = await api.offers.search({
        type_id: [1],
        status: 3, // Нужно чтобы прилетали и активные и пассивные
        object_id: props.offer.object_id,
        parent_id: props.offer.original_id
    });

    if (response) blockOffers.value = response.data;
    blocksIsLoading.value = false;
};

const openRelations = type => {
    if (currentRelationTab.value === type) {
        relationDropdownIsOpen.value = false;
        currentRelationTab.value = null;
        return;
    }

    relatedOffers.value = [];
    relationDropdownIsOpen.value = true;
    currentRelationTab.value = type;
    searchRelatedOffers(type, true);
};

const showBlocks = () => {
    blocksDropdownIsOpen.value = true;
    if (!blockOffers.value.length) searchBlockOffers();
};

const hideBlocks = () => {
    blocksDropdownIsOpen.value = false;
};

const openInChat = () =>
    openChat(props.offer.company_id, props.offer.object_id, messenger.dialogTypes.OBJECT);

const openInSurvey = () => {
    let surveyType;
    const dealType = props.offer.deal_type ?? dealOptions.typeStatement.RENT;

    if (
        dealType === dealOptions.typeStatement.RENT ||
        dealType === dealOptions.typeStatement.SALE
    ) {
        surveyType = messenger.surveyType.OBJECT;
    } else {
        surveyType = messenger.surveyType.COMPANY;
    }

    openSurvey(
        messenger.dialogTypes.OBJECT,
        surveyType,
        props.offer.object_id,
        props.offer.company_id
    );
};

const openPDF = () => {
    window.open(
        getLinkPDF(
            {
                type_id: 2,
                offer_id: props.offer.original_id,
                object_id: props.offer.object_id
            },
            currentUser.value.id
        ),
        '_blank'
    );
};

const toggleFavorite = async () => {
    if (!isFavorite.value) return store.dispatch('ADD_FAVORITES_OFFER', props.offer);

    await store.dispatch('DELETE_FAVORITES_OFFERS', props.offer);
    emit('favorite-deleted', props.offer);
};
</script>
