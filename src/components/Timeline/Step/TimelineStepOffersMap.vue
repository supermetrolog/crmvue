<template>
    <div>
        <div class="d-flex align-items-end gap-3 mb-1">
            <UiField color="danger" class="fs-3">Функция в активной разработке!</UiField>
            <UiButton
                @click="$emit('to-list')"
                class="ml-auto"
                icon="fa-solid fa-list-ul"
                :loading
                color="light"
            >
                Показать списком ({{ counts ?? 0 }})
            </UiButton>
            <UiButton @click="$emit('refresh')" icon="fa-solid fa-refresh" :loading color="light">
                Обновить
            </UiButton>
        </div>
        <OfferMap :list="objects" :styles="yandexMapStyles" :loading />
    </div>
</template>

<script setup>
import { shallowReactive } from 'vue';
import OfferMap from '@/components/Offer/OfferMap.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['refresh', 'to-list']);
defineProps({
    counts: Number,
    objects: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});

const yandexMapStyles = shallowReactive({
    width: '100%',
    height: '60vh'
});

// TODO: Добавить фильтры
</script>
