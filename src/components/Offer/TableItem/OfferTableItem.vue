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
                    <HoverActionsButton
                        @click="toggleDescriptionVisible"
                        label="Подробнее о блоках"
                    >
                        <i v-if="!dropdownIsOpen" class="fa-solid fa-chevron-down"></i>
                        <i v-else class="fa-solid fa-chevron-up"></i>
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
                <div v-if="offer.consultant">
                    <div class="d-flex gap-2 align-items-center offer-table-item__avatar">
                        <Avatar
                            v-tippy="offer.consultant.userProfile.full_name"
                            size="40"
                            :src="offer.consultant.userProfile.avatar"
                        />
                        <div
                            v-if="offer.object?.agent_visited"
                            v-tippy="'Был на объекте'"
                            class="offer-table-item__visited"
                        >
                            <i class="fa-solid fa-person-walking"></i>
                        </div>
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
                    <TableDateBlock class="mt-1" :date="updatedAt" label="Обновление" />
                    <TableDateBlock
                        v-if="offer.last_call"
                        class="mt-1"
                        :date="offer.last_call.created_at"
                        label="Звонок"
                    />
                </div>
            </div>
        </Td>
    </Tr>
    <tr v-if="dropdownIsOpen && isLoading" class="offer-table-item__loader">
        <Spinner class="absolute-center" />
    </tr>
    <DropDown>
        <OfferTableItemDropdown
            v-if="dropdownIsOpen && !isLoading"
            @toggle-avito="handleAvitoToggle"
            :offer="offer"
            :mini-offers="miniOffers"
        />
    </DropDown>
</template>

<script>
import DropDown from '@/components/common/DropDown.vue';
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import api from '@/api/api.js';
import { MixinOfferItem } from '@/components/Offer/mixins.js';
import OfferTableItemDropdown from '@/components/Offer/TableItem/OfferTableItemDropdown.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import OfferTableItemArea from '@/components/Offer/TableItem/OfferTableItemArea.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import Avatar from '@/components/common/Avatar.vue';
import OfferTableItemPreview from '@/components/Offer/TableItem/OfferTableItemPreview.vue';
import OfferTableItemAddress from '@/components/Offer/TableItem/OfferTableItemAddress.vue';
import OfferTableItemPrice from '@/components/Offer/TableItem/OfferTableItemPrice.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/useNotify.js';

export default {
    name: 'OfferTableItem',
    components: {
        TableDateBlock,
        Spinner,
        OfferTableItemPrice,
        OfferTableItemAddress,
        OfferTableItemPreview,
        Avatar,
        CompanyElement,
        CompanyContact,
        OfferTableItemArea,
        DashboardChip,
        HoverActionsButton,
        OfferTableItemDropdown,
        Tr,
        Td,
        DropDown
    },
    mixins: [MixinOfferItem],
    props: {
        loader: {
            type: Boolean,
            default: false
        },
        sortable: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const { isLoading } = useDelayedLoader();
        const { confirm } = useConfirm();
        const notify = useNotify();

        return { isLoading, confirm, notify };
    },
    data() {
        return {
            miniOffers: []
        };
    },
    computed: {
        updatedAt() {
            return this.offer.last_update * 1000;
        }
    },
    methods: {
        async searchMiniOffers(withLoading = false) {
            if (withLoading) this.isLoading = true;

            const response = await api.offers.search({
                type_id: [1],
                status: 3, // Нужно чтобы прилетали и активные и пассивные
                object_id: this.offer.object_id
            });

            if (response) this.miniOffers = response.data;
            if (withLoading) this.isLoading = false;
        },
        async handleAvitoToggle() {
            await this.searchMiniOffers();
        },
        toggleDescriptionVisible() {
            if (this.dropdownIsOpen) {
                this.miniOffers = [];
                this.dropdownIsOpen = false;
                return;
            }

            this.dropdownIsOpen = true;
            this.searchMiniOffers(true);
        }
    }
};
</script>
