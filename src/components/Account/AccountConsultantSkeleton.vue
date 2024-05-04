<template>
    <div class="account-consultant account-section skeleton-body">
        <Avatar class="account-consultant__avatar skeleton" size="120" />
        <div class="account-consultant__body">
            <p class="account-consultant__title">
                <span class="skeleton">Иван Иванов</span>
                <span class="skeleton">Консультант</span>
            </p>
            <p class="account-consultant__contacts skeleton">
                <span>Email не указан, </span>
                <span>телефон не указан</span>
            </p>
            <div class="account-consultant__actions">
                <button class="skeleton">Активность</button>
                <button class="skeleton">Написать</button>
            </div>
        </div>
    </div>
</template>
<script>
import Avatar from '@/components/common/Avatar.vue';

export default {
    name: 'AccountConsultantSkeleton',
    components: { Avatar }
};
</script>
