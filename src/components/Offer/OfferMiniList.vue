<template>
    <Table v-if="offers.length" class="offer-mini-list">
        <template #thead>
            <Tr>
                <Th>Действия</Th>
                <Th>ID блока</Th>
                <Th>Этаж</Th>
                <Th>Площадь</Th>
                <Th>Высота</Th>
                <Th>Тип пола</Th>
                <Th>Ворота</Th>
                <Th>Температура</Th>
                <Th>Цена блока</Th>
                <Th>Реклама</Th>
            </Tr>
        </template>
        <template #tbody>
            <OfferMiniListItem
                v-for="offer in activeOffers"
                :key="offer.id"
                @toggle-avito="$emit('toggle-avito')"
                @toggle-favorite="toggleFavorite(offer, $event)"
                @open-pdf="openPDF(offer)"
                :loading="offersLoadingCache[offer.id]"
                :offer="offer"
            />
            <OfferMiniListItem
                v-for="offer in archivedOffers"
                :key="offer.id"
                @toggle-avito="$emit('toggle-avito')"
                @toggle-favorite="toggleFavorite(offer, $event)"
                @open-pdf="openPDF(offer)"
                :loading="offersLoadingCache[offer.id]"
                :offer="offer"
                class="archived"
            />
        </template>
    </Table>
</template>

<script setup>
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import OfferMiniListItem from '@/components/Offer/OfferMiniListItem.vue';
import { computed, shallowReactive } from 'vue';
import { predicate } from '@/utils/predicate.js';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/useNotify.js';
import { getLinkPDF } from '@/utils/url.js';

defineEmits(['toggle-avito']);
const props = defineProps({
    offers: {
        type: Array,
        default: () => []
    }
});

const store = useStore();
const notify = useNotify();

const sortedOffers = computed(() => props.offers.toSorted(predicate.compareByProperty('id')));
const archivedOffers = computed(() => sortedOffers.value.filter(element => element.status === 2));
const activeOffers = computed(() => sortedOffers.value.filter(element => element.status === 1));

const offersLoadingCache = shallowReactive({});

const openPDF = offer => {
    window.open(
        getLinkPDF(
            {
                type_id: 1,
                offer_id: offer.original_id,
                object_id: offer.object_id
            },
            store.getters.THIS_USER.id
        ),
        '_blank'
    );
};

const toggleFavorite = async (offer, state) => {
    offersLoadingCache[offer.id] = true;

    if (state) {
        await store.dispatch('ADD_FAVORITES_OFFER', offer);
        notify.success('Блок успешно добавлен в избранное.');
    } else {
        await store.dispatch('DELETE_FAVORITES_OFFERS', offer);
        notify.success('Блок удален из избранного.');
    }

    offersLoadingCache[offer.id] = false;
};
</script>
