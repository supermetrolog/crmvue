<template>
    <div class="settings-form__header">
        <p class="settings-form__title">
            <span>{{ title }}</span>
            <span v-if="size && pagination?.totalCount">
                ({{ size }}/{{ pagination?.totalCount ?? 0 }})
            </span>
        </p>
        <div class="settings-form__actions">
            <slot name="extra" />
            <AnimationTransition :speed="0.3">
                <DashboardChip
                    v-if="pagination?.currentPage < pagination?.pageCount"
                    @click="$emit('load')"
                    class="settings-form__button"
                >
                    <i class="fa-solid fa-rotate" />
                    <span class="ml-1">Загрузить ещё</span>
                </DashboardChip>
            </AnimationTransition>
            <DashboardChip @click="$emit('add')" class="settings-form__button">
                <i class="fa-solid fa-plus" />
                <span class="ml-1">Добавить</span>
            </DashboardChip>
            <DashboardChip
                v-tippy="'Обновить выдачу'"
                @click="$emit('refresh')"
                class="settings-form__button settings-form__button--info"
            >
                <i class="fa-solid fa-rotate" />
            </DashboardChip>
        </div>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

defineEmits(['load', 'add', 'refresh']);
defineProps({
    title: { type: String, default: '' },
    size: { type: Number, default: 0 },
    pagination: { type: Object, default: null }
});
</script>
