<template>
    <div class="account-card">
        <Avatar class="account-card__avatar" size="120" :src="user.userProfile?.avatar" />
        <p class="account-card__username">
            {{ user.userProfile?.medium_name }}
        </p>
        <p class="account-card__role">{{ userRole }}</p>
    </div>
</template>
<script>
import Avatar from '@/components/common/Avatar.vue';
import { RoleList } from '@/const/const';

export default {
    name: 'AccountCard',
    components: { Avatar },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        userRole() {
            return RoleList[this.user.role];
        }
    }
};
</script>
