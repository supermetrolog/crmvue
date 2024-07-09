<template>
    <div class="deal-item">
        <HoverActionsButton
            v-if="!readOnly"
            @click="$emit('update')"
            label="Редактировать"
            class="deal-item__edit"
        >
            <i class="fa-solid fa-pen"></i>
        </HoverActionsButton>
        <HoverActionsButton
            v-if="!readOnly"
            @click="$emit('delete')"
            label="Удалить"
            class="deal-item__delete"
        >
            <i class="fa-solid fa-times"></i>
        </HoverActionsButton>
        <div class="row">
            <div class="col-4 text-center align-self-center">
                <i class="fas fa-handshake deal-item__icon"></i>
            </div>
            <div class="col-8 pl-0">
                <div class="row no-gutters">
                    <DealListItemRow label="Название">{{ deal.name || '—' }}</DealListItemRow>
                    <DealListItemRow label="Объект">
                        <a :href="offerUrl" target="_blank">
                            {{ deal.offer ? deal.offer.visual_id : deal.object_id }}
                        </a>
                    </DealListItemRow>
                    <DealListItemRow label="Площадь">
                        <WithUnitType v-if="deal.area" :unit-type="unitTypes.SQUARE_METERS">
                            {{ $formatter.number(deal.area) }}
                        </WithUnitType>
                    </DealListItemRow>
                    <DealListItemRow label="Цена пола">
                        <WithUnitType v-if="deal.floorPrice" :unit-type="unitTypes.RUB">
                            {{ $formatter.number(deal.floorPrice) }}
                        </WithUnitType>
                    </DealListItemRow>
                    <DealListItemRow label="Юр. лицо">
                        {{ deal.clientLegalEntity_full_name || '—' }}
                    </DealListItemRow>
                    <DealListItemRow v-if="deal.is_competitor" label="Конкурент">
                        <router-link :to="competitorUrl">
                            {{ deal.competitor.full_name || '—' }}
                        </router-link>
                    </DealListItemRow>
                    <DealListItemRow label="Дата сделки">
                        {{ deal.dealDate_format || '—' }}
                    </DealListItemRow>
                    <DealListItemRow label="Консультант">
                        {{ deal.consultant?.userProfile?.short_name || '—' }}
                    </DealListItemRow>
                    <DealListItemRow label="Срок">
                        {{ deal.contractTerm || '—' }}
                    </DealListItemRow>
                    <DealListItemRow label="Описание">
                        {{ deal.description || '—' }}
                    </DealListItemRow>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed } from 'vue';
import { $generatorURL as $url } from '@/plugins/url.js';
import DealListItemRow from '@/components/Deal/DealListItemRow.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineEmits(['update', 'delete']);
const props = defineProps({
    deal: {
        type: Object
    },
    readOnly: {
        type: Boolean,
        default: false
    }
});

const offerUrl = computed(() =>
    $url.offerByObject(props.deal.offer ? props.deal.offer : props.deal)
);
const competitorUrl = computed(() => $url.company(props.deal.competitor.id));
</script>
