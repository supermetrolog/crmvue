<template>
    <div class="dashboard-card-message skeleton-body">
        <Avatar :size="35" />
        <span class="dashboard-card-message__text skeleton">
            Aboba aboba aboba aboba Aboba aboba aboba aboba
        </span>
        <span class="dashboard-card-message__date skeleton"> 11.11.1111, 11:11 </span>
    </div>
</template>

<script>
import Avatar from '@/components/common/Avatar.vue';
export default {
    name: 'DashboardCardMessage',
    components: { Avatar }
};
</script>
