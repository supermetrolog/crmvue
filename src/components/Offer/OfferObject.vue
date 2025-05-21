<template>
    <AnimationTransition :speed="0.5" :animation="{ enter: 'slideInLeft', leave: 'slideOutLeft' }">
        <div v-if="isShowing" class="object-view scroller">
            <div class="object-view__header">
                <DashboardChip class="dashboard-bg-gray-l w-100 text-center">
                    <span>Просмотр предложений: </span>
                    <span v-if="isLoadingOffers || isLoadingObject">загрузка..</span>
                    <span v-else>{{ offers?.length ?? 0 }}</span>
                </DashboardChip>
                <HoverActionsButton
                    @click="close"
                    label="Закрыть панель"
                    class="object-view__close"
                >
                    <i class="fas fa-times"></i>
                </HoverActionsButton>
            </div>
            <hr />
            <Spinner
                v-if="isLoadingObject || isLoadingOffers"
                class="absolute-center"
                :label="spinnerLabel"
            />
            <div v-else>
                <div class="row no-gutters">
                    <CompanyObjectItemOfferOnly
                        v-for="offer in offers"
                        :key="offer.id"
                        :offer="offer"
                        class="col-12"
                    />
                </div>
            </div>
        </div>
    </AnimationTransition>
</template>

<script setup>
import CompanyObjectItemOfferOnly from '@/components/Company/Object/CompanyObjectItemOfferOnly.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import api from '@/api/api.js';

const props = defineProps({
    offerIds: {
        type: Array,
        default: () => []
    },
    searchType: {
        type: String,
        default: 'offers'
    }
});

const isLoadingOffers = shallowRef(false);
const { isLoading: isLoadingObject } = useDelayedLoader();

const offers = ref([]);
const isShowing = shallowRef(false);

watch(
    () => props.offerIds,
    () => {
        if (props.offerIds?.length) {
            isShowing.value = true;
            fetchOffers();
        }
    }
);

onMounted(() => {
    if (props.offerIds?.length) {
        isShowing.value = true;
        fetchOffers();
    }
});

const close = () => {
    isShowing.value = false;
    offers.value = [];
};

const spinnerLabel = computed(() => {
    if (isLoadingObject.value) return 'Поиск объекта..';
    if (isLoadingOffers.value) return 'Загрузка предложений..';
    return null;
});

const fetchObjects = async () => {
    const response = await api.offers.search({ id: props.offerIds[0] });
    return response.data;
};

const fetchOffers = async () => {
    let objectIds;

    if (props.searchType === 'offers') {
        isLoadingObject.value = true;

        const objects = await fetchObjects();

        isLoadingObject.value = false;

        if (!objects) return;

        objectIds = objects.map(el => el.object_id);
    } else {
        objectIds = props.offerIds;
    }

    isLoadingOffers.value = true;

    const query = {
        object_id: objectIds,
        expand: 'generalOffersMix,contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile'
    };

    const response = await api.offers.search(query);
    offers.value = response.data;

    isLoadingOffers.value = false;
};
</script>
