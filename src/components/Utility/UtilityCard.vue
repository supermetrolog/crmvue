<template>
    <DashboardCard>
        <p class="font-weight-semi">
            <i v-if="icon" :class="icon" class="mr-1 fs-4" />
            <span>{{ title }}</span>
        </p>
        <p class="text-grey">Описание:</p>
        <p>{{ description }}</p>
        <div class="d-flex gap-1 flex-wrap mt-2">
            <slot name="actions" :run="run">
                <UiButton @click="run" color="light">Использовать</UiButton>
                <slot name="after-actions" :run="run" />
            </slot>
        </div>
    </DashboardCard>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';

const emit = defineEmits<{ (e: 'run'): void }>();

defineProps<{ title: string; description: string; icon?: string }>();

function run() {
    emit('run');
}
</script>
