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
                    {{ object.id }}
                </p>
                <OfferTableItemRelationSelect
                    v-if="object.offers?.length"
                    @open="openRelations"
                    :offers="object.offers"
                    :current-tab="currentRelationTab"
                />
            </div>
        </Td>
        <Td class="offer-table-item__preview">
            <ObjectTableItemPreview
                @show-complex-objects="$emit('show-complex-objects')"
                :is-passive="isPassive"
                :object
            />
        </Td>
        <Td class="offer-table-item__region text-center">
            <a v-if="object.address" :href="objectUrl" target="_blank">
                {{ object.address }}
            </a>
            <p v-else>—</p>
        </Td>
        <Td class="offer-table-item__from-mkad text-center" sort="from_mkad">
            <p v-if="object.from_mkad">{{ object.from_mkad }} <small>км</small></p>
            <p v-else>—</p>
        </Td>
        <Td class="offer-table-item__area" sort="area">
            <div class="d-flex justify-content-center">
                <ObjectTableItemArea :object />
            </div>
        </Td>
        <Td class="offer-table-item__company">
            <CompanyElement
                v-if="object.company"
                :company="object.company"
                class="offer-table-item__company-element mb-2"
            />
            <CompanyContact
                v-if="contact"
                @open-phone="openInSurvey"
                :contact
                class="offer-table-item__company-element"
                hidden
            />
        </Td>
        <Td class="offer-table-item__date" sort="last_update">
            <UiField
                v-if="isPassive"
                color="danger-light"
                class="offer-table-item__chip text-white"
            >
                Пассив
            </UiField>
            <UiField v-else color="success-light" class="offer-table-item__chip">Актив</UiField>
            <TableDateBlock class="mt-1" :date="updatedAt" label="Дата обновления" />
        </Td>
    </Tr>
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
import CompanyContact from '@/components/Company/CompanyContact.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { computed, shallowRef } from 'vue';
import OfferTableItemRelationSelect from '@/components/Offer/TableItem/OfferTableItemRelationSelect.vue';
import OfferTableItem from '@/components/Offer/TableItem/OfferTableItem.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import UiField from '@/components/common/UI/UiField.vue';
import ObjectTableItemPreview from '@/components/ObjectTable/ObjectTableItemPreview.vue';
import { useRouter } from 'vue-router';
import ObjectTableItemArea from '@/components/ObjectTable/ObjectTableItemArea.vue';

defineEmits(['show-complex-objects']);

const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    loader: Boolean,
    sortable: {
        type: Boolean,
        default: true
    }
});

const { isLoading: relationsIsLoading } = useDelayedLoader();

const currentRelationTab = shallowRef(null);
const relatedOffers = shallowRef([]);
const relationDropdownIsOpen = shallowRef(false);

const updatedAt = computed(() => props.object.last_update * 1000);

const contact = computed(() => props.object.contact ?? props.object.company?.mainContact);

const isPassive = computed(() => props.object.status !== 1);

const searchRelatedOffers = async (dealType, withLoading = false) => {
    if (withLoading) relationsIsLoading.value = true;

    const response = await api.offers.search({
        type_id: [2],
        deal_type: dealType - 1,
        status: 3, // Нужно чтобы прилетали и активные и пассивные
        object_id: props.object.id,
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

// survey

const { openSurvey } = useMessenger();

const openInSurvey = () => {
    openSurvey(messenger.dialogTypes.COMPANY, props.object.company_id, props.object.company_id);
};

// url

const router = useRouter();

const objectUrl = computed(
    () =>
        router.resolve({ name: 'complex.view', params: { complex_id: props.object.complex_id } })
            ?.href
);
</script>
