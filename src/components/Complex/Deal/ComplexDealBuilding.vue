<template>
    <div class="building-info">
        <div v-if="hasActiveOffers" class="building-info__content">
            <div class="building-info__tables">
                <ComplexDealArea
                    class="building-info__table"
                    :deal="deal.summaryBlock"
                    :original="deal"
                />
                <ComplexDealPrice class="building-info__table" :deal="deal" />
            </div>
            <ComplexPurposes
                v-if="deal.summaryBlock.purposes_block.length"
                :purposes="deal.summaryBlock.purposes_block"
            />
            <ComplexParameters
                v-model:more="parametersIsVisible"
                with-more
                :parameters="parametersIsVisible ? parameters : mainParameters"
            />
        </div>
        <EmptyData v-else class="building-info__empty">
            Данные о сделке отсутсвуют в связи с отсутствием торговых предложений.
        </EmptyData>
        <div class="building-info__line">
            <ComplexActions class="building-info__buttons" simple :buttons="actionButtons" />
            <ComplexDealTabs
                :has-active-offers="hasActiveOffers"
                :deal="deal"
                :floors="floors"
                class="building-info__tabs"
            />
        </div>
    </div>
</template>

<script setup>
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';
import ComplexActions from '@/components/Complex/ComplexActions.vue';
import ComplexDealTabs from '@/components/Complex/Deal/ComplexDealTabs.vue';
import { mapper } from '@/utils/mapper';
import ComplexDealArea from '@/components/Complex/Deal/ComplexDealArea.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useStore } from 'vuex';
import ComplexDealPrice from '@/components/Complex/Deal/Price/ComplexDealPrice.vue';
import ComplexPurposes from '@/components/Complex/ComplexPurposes.vue';
import { computed, inject, shallowRef } from 'vue';
import { $generatorURL as $url } from '@/plugins/url.js';
import { useRoute } from 'vue-router';
import { notify } from '@kyvg/vue3-notification';
import { dealProperties } from '@/const/properties/deal.properties.js';

const store = useStore();
const route = useRoute();

const dealFloors = inject('dealFloors');
const openDownloader = inject('openDownloader');

const props = defineProps({
    deal: {
        type: Object,
        required: true
    }
});

const parametersIsVisible = shallowRef(false);

const hasActiveOffers = computed(() =>
    props.deal.blocks.some(offer => !offer.deleted && !offer.deal_id)
);

const photos = computed(() => {
    if (!props.deal.summaryBlock) return [];

    const photos =
        props.deal.summaryBlock.photos instanceof Array
            ? props.deal.summaryBlock.photos
            : Object.values(props.deal.summaryBlock.photos);

    return photos.map(el => ({
        src: $url.api.objects() + el
    }));
});

const partsObject = computed(() => {
    return props.deal.blocks.reduce((acc, block) => {
        block.parts.forEach(part => (acc[part] = true));
        return acc;
    }, {});
});

const floors = computed(() => {
    return [...dealFloors].map(floor => ({
        ...floor,
        parts: floor.parts.filter(part => partsObject.value[part.id])
    }));
});

const actionButtons = computed(() => {
    return {
        dislike: {},
        favorite: {},
        notifications: {},
        pdf: {
            disabled: !hasActiveOffers.value,
            handler: () => {
                const urlLink = $url.pdf(
                    { type_id: 2, offer_id: props.deal.id, object_id: props.deal.object_id },
                    store.getters.THIS_USER
                );
                window.open(urlLink, '_blank');
            }
        },
        delete: {},
        copy: {
            handler: async () => {
                const url = $url.offer(route.params.complex_id, props.deal.id);
                await navigator.clipboard.writeText(url);
                notify('Ссылка на сделку скопирована');
            }
        },
        photos: {
            disabled: !photos.value.length || !hasActiveOffers.value,
            handler: () => openDownloader(photos.value)
        }
    };
});

const parameters = computed(() => {
    return mapper.propertiesToParametersFormat(props.deal.summaryBlock, dealProperties.parameters);
});

const mainParameters = computed(() => {
    return mapper.propertiesToParametersFormat(
        props.deal.summaryBlock,
        dealProperties.mainParameters
    );
});
</script>
