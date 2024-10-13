<template>
    <Tr class="offer-mini-list-item">
        <Td>
            <div class="offer-mini-list-item__functions">
                <HoverActionsButton
                    @click="$emit('open-pdf')"
                    :disabled="loading"
                    label="Открыть PDF"
                >
                    <i class="fa-solid fa-file-pdf" />
                </HoverActionsButton>
                <HoverActionsButton
                    @click="$emit('toggle-favorite', !isFavorite)"
                    :disabled="loading"
                    :active="isFavorite"
                    :label="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
                >
                    <i class="fa-solid fa-star" />
                </HoverActionsButton>
            </div>
        </Td>
        <Td>{{ offer.visual_id }}</Td>
        <Td>{{ offer.calc_floors }} эт.</Td>
        <Td>
            <WithUnitType class="font-weight-bold" :unit-type="unitTypes.SQUARE_METERS">
                {{ offer.calc_area_general }}
            </WithUnitType>
        </Td>
        <Td>
            <WithUnitType :unit-type="unitTypes.METERS">
                {{ ceilingHeight }}
            </WithUnitType>
        </Td>
        <Td>{{ floorType }}</Td>
        <Td>
            <p>{{ offer.gate_num }} шт./{{ offer.gate_type }}</p>
        </Td>
        <Td>
            <div class="d-flex">
                <span>{{ offer.heated ? 'Теплый' : 'Холодный' }}</span>
                <WithUnitType
                    v-if="offer.temperature_min || offer.temperature_max"
                    class="ml-1"
                    :unit-type="unitTypes.CELCIUS"
                >
                    {{ offer.calc_temperature }}
                </WithUnitType>
            </div>
        </Td>
        <Td>
            <WithUnitType
                class="font-weight-bold"
                :unit-type="
                    offer.deal_type === 2 ? unitTypes.RUB : unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
                "
            >
                {{ offer.calc_price_general }}
            </WithUnitType>
        </Td>
        <Td>
            <div v-if="!isPassive" class="offer-mini__advertisement">
                <DashboardChip
                    v-if="offer.ad_cian"
                    class="offer-mini-list-item__chip dashboard-bg-gray-l"
                >
                    Циан
                </DashboardChip>
                <DashboardChip
                    v-if="offer.ad_yandex"
                    class="offer-mini-list-item__chip dashboard-bg-gray-l"
                >
                    Яндекс
                </DashboardChip>
                <DashboardChip
                    v-if="offer.ad_realtor"
                    class="offer-mini-list-item__chip dashboard-bg-gray-l"
                >
                    Readys.ru
                </DashboardChip>
                <DashboardChip
                    v-if="offer.ad_free"
                    class="offer-mini-list-item__chip dashboard-bg-gray-l"
                >
                    Бесплатная
                </DashboardChip>
                <DashboardChip class="offer-mini-list-item__chip dashboard-bg-gray-l">
                    <div class="d-flex gap-1 align-items-center">
                        <span>Авито</span>
                        <Switch
                            @change="toggleAvito"
                            :checked="offer.ad_avito"
                            label="Авито"
                            :disabled="avitoIsLoading"
                        />
                    </div>
                </DashboardChip>
            </div>
            <p v-else>—</p>
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { useStore } from 'vuex';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import Switch from '@/components/common/Forms/Switch.vue';
import { computed, shallowRef } from 'vue';
import api from '@/api/api.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { toNumberOrRangeFormat, ucFirst } from '@/utils/formatter.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

const emit = defineEmits(['toggle-avito', 'open-pdf', 'toggle-favorite']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const store = useStore();

const avitoIsLoading = shallowRef(false);

const isFavorite = computed(() => store.state.Offers.favoritesOffersCache[props.offer.original_id]);
const ceilingHeight = computed(() =>
    toNumberOrRangeFormat(props.offer.ceiling_height_min, props.offer.ceiling_height_max)
);
const isPassive = computed(() => props.offer.status === 2);

const toggleAvito = async () => {
    avitoIsLoading.value = true;

    const status = await api.offers.toggleAvitoAd(props.offer.original_id);
    if (status) emit('toggle-avito');

    avitoIsLoading.value = false;
};

const floorType = ucFirst(props.offer.floor_type);
</script>
