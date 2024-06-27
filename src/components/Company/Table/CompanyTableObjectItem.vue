<template>
    <div class="company-objects-list__item company-table-object-item">
        <div class="company-table-object-item__wrapper row">
            <div class="company-table-object-item__preview col-3">
                <a
                    :href="$url.complexOld(object.complex_id)"
                    class="button button--small w-100 mb-2"
                    target="_blank"
                >
                    Старая версия
                </a>
                <a
                    v-tippy="object.description_auto"
                    :href="$url.complex(object.complex_id)"
                    target="_blank"
                    class="company-table-object-item__thumb"
                >
                    <VLazyImage
                        :src="object.thumb"
                        class="company-table-object-item__image"
                        alt="complex image"
                    />
                </a>
            </div>
            <div class="col-9">
                <div class="row">
                    <div class="col-8">
                        <div class="company-table-object-item__scroller">
                            <div class="company-table-object-item__title mb-2">
                                <DashboardChip class="dashboard-bg-light">
                                    ID-{{ object.id }}
                                </DashboardChip>
                                <DashboardChip class="dashboard-bg-light">
                                    <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                        {{ $formatter.number(object.area_building) }}
                                    </WithUnitType>
                                </DashboardChip>
                                <DashboardChip v-tippy="'Класс объекта'" class="dashboard-bg-light">
                                    {{ objectClass }}
                                </DashboardChip>
                            </div>
                            <p>{{ object.address }}</p>
                            <p v-if="object.from_mkad">{{ object.from_mkad }} км от МКАД</p>
                        </div>
                    </div>
                    <div class="col-4">
                        <div
                            v-if="activeOfferMix.length"
                            class="company-table-object-item__scroller"
                        >
                            <CompanyTableObjectOffer
                                v-for="offer in activeOfferMix"
                                :key="offer.id"
                                class="text-center mb-1"
                                :offer="offer"
                            />
                        </div>
                        <EmptyLabel v-else>Нет активных</EmptyLabel>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CompanyTableObjectOffer from './CompanyTableObjectOffer.vue';
import VLazyImage from 'v-lazy-image';
import WithUnitType from '@/components/common/WithUnitType.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { unitTypes } from '@/const/unitTypes.js';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { entityOptions } from '@/const/options/options.js';
import { computed } from 'vue';

const props = defineProps({
    object: {
        type: Object
    },
    col: {
        type: String,
        default: 'col-6'
    }
});

const objectClass = computed(() => entityOptions.object.class[props.object.object_class]);
const activeOfferMix = computed(() =>
    props.object.offerMix.filter(offer => offer.status === 1 && offer.type_id === 2)
);
</script>
