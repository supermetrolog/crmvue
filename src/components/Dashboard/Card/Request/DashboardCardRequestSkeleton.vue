<template>
    <div class="dashboard-card-request">
        <div class="dashboard-card-request__wrapper skeleton-body">
            <div class="dashboard-card-request__header">
                <span class="dashboard-card-request__date skeleton">
                    Обновлено 11.11.11, 11:11
                </span>
                <div class="dashboard-card-request__functions">
                    <HoverActionsButton class="skeleton">
                        <i class="fa-solid fa-pen"></i>
                    </HoverActionsButton>
                    <HoverActionsButton class="skeleton">
                        <i class="fa-solid fa-pen"></i>
                    </HoverActionsButton>
                </div>
            </div>
            <div class="dashboard-card-request__body">
                <p class="dashboard-card-request__company mb-1 skeleton">Название компании</p>
                <p class="dashboard-card-request__address mb-1 skeleton">Адрес компании</p>
                <div class="dashboard-card-request__parameters">
                    <div class="dashboard-card-request__parameter">
                        <p class="dashboard-card-request__parameter-name skeleton">Статус</p>
                        <span class="skeleton">Статус</span>
                    </div>
                    <div class="dashboard-card-request__parameter">
                        <p class="dashboard-card-request__parameter-name skeleton">Переезд</p>
                        <span class="skeleton">11.11.11, 11:11</span>
                    </div>
                </div>
                <div class="dashboard-card-request__timeline">
                    <p class="skeleton mb-1">Аренда</p>
                    <Progress :percent="100" class="skeleton" />
                </div>
            </div>
            <div class="dashboard-card-request__footer">
                <Avatar size="35" class="skeleton" />
                <span class="dashboard-card-request__date skeleton">
                    Запрос #1, 11.11.11, 11:11
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Avatar from '@/components/common/Avatar.vue';
import Progress from '@/components/common/Progress.vue';

export default {
    name: 'DashboardCardRequestSkeleton',
    components: { Progress, Avatar, HoverActionsButton }
};
</script>
