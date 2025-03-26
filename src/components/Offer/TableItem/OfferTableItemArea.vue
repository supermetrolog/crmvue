<template>
    <div class="offer-table-item-area">
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS" class="offer-table-item-area__title">
            {{ offer.calc_area_general }}
        </with-unit-type>
        <div class="offer-table-item-area__additional">
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_mezzanine }}
                </with-unit-type>
                <span> - мезонин</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_office }}
                </with-unit-type>
                <span> - офисы</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_tech }}
                </with-unit-type>
                <span> - технич.</span>
            </p>
        </div>
        <div
            v-if="offer.blocks?.length > 1"
            v-tippy="
                blocksPinned ? 'Нажмите, чтобы скрыть блоки' : 'Нажмите, чтобы закрепить блоки'
            "
            v-element-hover="[onHover, { delayEnter: 300, delayLeave: 500 }]"
            @click="toggleBlocks"
            class="offer-table-item-area__label mt-1"
            :class="{ active: blocksShown || blocksPinned }"
        >
            *собрано из блоков
        </div>
    </div>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { ref } from 'vue';
import { vElementHover } from '@vueuse/components';

const emit = defineEmits(['show-blocks', 'hide-blocks', 'pin-blocks']);
const props = defineProps({
    offer: {
        type: Object,
        required: true
    },
    blocksShown: Boolean,
    blocksPinned: Boolean
});

const isHovered = ref(false);

const toggleBlocks = () => {
    if (props.blocksPinned) emit('hide-blocks');
    else emit('pin-blocks');
};

const onHover = hovered => {
    isHovered.value = hovered;

    if (props.blocksPinned) return;

    emit(isHovered.value ? 'show-blocks' : 'hide-blocks');
};
</script>
