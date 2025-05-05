<template>
    <div class="header-summary-dialogs__list">
        <Spinner v-if="loading" small class="absolute-center" />
        <slot v-else>
            <slot name="empty">
                <UiField class="dashboard-bg-gray-l mt-5 mx-auto">
                    <span>Список пуст</span>
                    <i class="fa-solid fa-comment-slash"></i>
                </UiField>
            </slot>
        </slot>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineProps({
    loading: Boolean
});
</script>
