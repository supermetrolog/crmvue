<template>
    <div class="account-consultant account-section">
        <Avatar class="account-consultant__avatar" size="120" :src="user.userProfile.avatar" />
        <div class="account-consultant__body">
            <p class="account-consultant__title">
                <span class="account-consultant__username">{{ user.userProfile.medium_name }}</span>
                <span class="account-consultant__role">{{ userRole }}</span>
            </p>
            <p class="account-consultant__contacts">
                <span v-if="user.userProfile.emails?.length">{{ emails }}, </span>
                <span v-else class="account-consultant__helper">Email не указан, </span>
                <span v-if="user.userProfile.phones?.length">{{ phones }}</span>
                <span v-else class="account-consultant__helper">телефон не указан</span>
            </p>
            <div class="account-consultant__actions">
                <Button v-tippy="`В разработке..`" small success>Активность</Button>
                <Button v-tippy="`В разработке..`" small success>Написать</Button>
            </div>
        </div>
    </div>
</template>
<script>
import Avatar from '@/components/common/Avatar.vue';
import { RoleList } from '@/const/const';
import Button from '@/components/common/Button.vue';

export default {
    name: 'AccountConsultant',
    components: { Button, Avatar },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        userRole() {
            return RoleList[this.user.role];
        },
        emails() {
            return this.user.userProfile.emails.map(email => email.email).join(', ');
        },
        phones() {
            return this.user.userProfile.phones.map(phone => phone.phone).join(', ');
        }
    }
};
</script>
