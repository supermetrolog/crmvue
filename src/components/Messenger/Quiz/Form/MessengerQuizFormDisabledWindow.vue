<template>
    <div class="messenger-quiz__disabled">
        <DashboardChip class="dashboard-bg-primary"> Отсутствуют активные контакты </DashboardChip>
        <Button @click="$emit('suggest-contact')" small icon class="dashboard-bg-primary">
            <i class="fa-solid fa-user-plus" />
            <span>Создать контакт</span>
        </Button>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';
defineEmits(['suggest-contact']);
</script>
