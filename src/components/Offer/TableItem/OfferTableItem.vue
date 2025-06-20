<template>
    <Tr
        class="offer-table-item"
        :class="{
            passive: isPassive,
            'fade-out': offer.isDeleting
        }"
    >
        <Td class="offer-table-item__id text-center" :class="{ passive: isPassive }">
            <div class="offer-table-item__aside">
                <p class="mb-1">
                    {{ offer.visual_id }}
                </p>
                <div class="offer-table-item__actions">
                    <template v-if="offer.type_id !== 3">
                        <UiButtonIcon
                            @click="toggleFavorite"
                            :label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
                            :active="isFavorite"
                            icon="fa-solid fa-star"
                        />
                        <UiButtonIcon
                            @click="openPDF"
                            label="Открыть PDF"
                            icon="fa-solid fa-file-pdf"
                        />
                    </template>
                    <UserFoldersDropdown
                        @deleted-from-folder="$emit('deleted-from-folder', $event)"
                        :entity="offer.id"
                        morph="offer_mix"
                        :small="false"
                    />
                    <UiDropdownActions label="Действия над предложением">
                        <template #menu>
                            <UiDropdownActionsButton
                                @handle="$emit('create-task')"
                                icon="fa-solid fa-bolt"
                                label="Создать задачу"
                            />
                            <UiDropdownActionsButton
                                @handle="openInChat"
                                icon="fa-solid fa-comment"
                                label="Открыть в чате"
                            />
                            <UiDropdownActionsButton
                                @handle="openInSurvey"
                                icon="fa-solid fa-square-poll-horizontal"
                                label="Открыть опрос"
                                :disabled="!offer.company_id"
                            />
                        </template>
                    </UiDropdownActions>
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
            <OfferTableItemPreview
                @show-map="$emit('show-map')"
                @show-complex-objects="$emit('show-complex-objects')"
                :is-passive="isPassive"
                :offer="offer"
            />
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
                    @pin-blocks="pinBlocks"
                    :blocks-shown="blocksDropdownIsOpen"
                    :blocks-pinned="blocksDropdownIsPinned"
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
                @open-phone="openInSurvey"
                :contact="contact"
                class="offer-table-item__company-element"
                hidden
            />
        </Td>
        <Td class="offer-table-item__consultant">
            <div class="d-flex justify-content-center">
                <div v-if="offer.consultant" class="d-flex flex-column align-items-center gap-1">
                    <Avatar
                        :label="offer.consultant.userProfile.full_name"
                        :size="55"
                        :src="offer.consultant.userProfile.avatar"
                    />
                    <div class="d-flex gap-1 align-items-center">
                        <UiTooltip
                            v-if="offer.object?.agent_visited"
                            tooltip="Был на объекте"
                            as="div"
                            class="offer-table-item__icon"
                        >
                            <i class="fa-solid fa-person-walking"></i>
                        </UiTooltip>
                        <UiTooltip
                            v-if="contractIsSigned"
                            :tooltip="contractTippy"
                            as="div"
                            class="offer-table-item__icon"
                            :class="{ exclusive: isExclusive }"
                        >
                            <i class="pl-2 fa-solid fa-file-signature"></i>
                        </UiTooltip>
                    </div>
                </div>
                <p v-else>—</p>
            </div>
        </Td>
        <Td class="offer-table-item__advertisement">
            <OfferTableItemAdv :offer />
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
            <OfferTableItemCall
                @to-survey="openInSurvey"
                @to-chat="openInChat"
                :call="offer.last_call"
                :created-at="objectCreatedAt"
                :without-contacts="!hasActiveContact"
                class="mt-1"
            />
            <TableDateBlock class="mt-1" :date="updatedAt" label="Дата обновления" />
        </Td>
    </Tr>
    <DropDown>
        <OfferTableItemDropdown v-if="blocksDropdownIsOpen || blocksDropdownIsPinned">
            <UiButton
                @click="hideBlocks"
                class="offer-table-item__close w-100"
                color="light"
                center
            >
                <i class="fas fa-angle-up"></i>
            </UiButton>
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
import { computed, ref, shallowRef } from 'vue';
import { useStore } from 'vuex';
import OfferTableItemRelationSelect from '@/components/Offer/TableItem/OfferTableItemRelationSelect.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import OfferMiniList from '@/components/Offer/OfferMiniList.vue';
import OfferTableItem from '@/components/Offer/TableItem/OfferTableItem.vue';
import OfferTableItemCall from '@/components/Offer/TableItem/OfferTableItemCall.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { getLinkPDF } from '@/utils/url.js';
import { messenger } from '@/const/messenger.js';
import OfferTableItemAdv from '@/components/Offer/TableItem/OfferTableItemAdv.vue';
import UiTooltip from '@/components/common/UI/UiTooltip.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';

const emit = defineEmits([
    'favorite-deleted',
    'open-survey',
    'deleted-from-folder',
    'show-complex-objects',
    'show-map',
    'create-task'
]);

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
const { openChat } = useMessenger();

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
            'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.active_requests_count,company.active_contacts_count,' +
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

const blocksDropdownIsPinned = ref(false);

const showBlocks = () => {
    blocksDropdownIsOpen.value = true;
    if (!blockOffers.value.length) searchBlockOffers();
};

const pinBlocks = () => {
    blocksDropdownIsPinned.value = true;
    blocksDropdownIsOpen.value = false;
};

const hideBlocks = () => {
    blocksDropdownIsOpen.value = false;
    blocksDropdownIsPinned.value = false;
};

const openInChat = () =>
    openChat(props.offer.company_id, props.offer.object_id, messenger.dialogTypes.OBJECT);

const { openSurvey } = useSurveyForm();

const openInSurvey = () => {
    openSurvey(props.offer.company_id);
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

const hasActiveContact = computed(() => {
    if (!props.offer.company) return false;
    return props.offer.company.active_contacts_count > 0;
});

const objectCreatedAt = computed(() => props.offer.object.publ_time * 1000);
</script>
