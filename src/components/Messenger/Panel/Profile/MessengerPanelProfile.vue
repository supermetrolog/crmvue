<template>
    <div class="messenger-panel-consultant">
        <AccountCard :user="user" />
        <div class="messenger-panel-consultant__section">
            <p class="account-section__title">Данные пользователя</p>
            <ul class="messenger-panel-consultant__grid">
                <li class="account-profile__category">
                    <span class="account-profile__property">ФИО</span>
                    <span class="account-profile__value">{{ user.userProfile.full_name }}</span>
                </li>
                <li class="account-profile__category">
                    <span class="account-profile__property">Username</span>
                    <span class="account-profile__value">{{ user.username }}</span>
                </li>
                <li class="account-profile__category">
                    <span class="account-profile__property">Email</span>
                    <p v-if="user.userProfile.emails?.length" class="account-profile__value-list">
                        <span
                            v-for="email in user.userProfile.emails"
                            :key="email.id"
                            class="account-profile__value"
                        >
                            {{ email.email }}
                        </span>
                    </p>
                    <p v-else>Не указан</p>
                </li>
                <li class="account-profile__category">
                    <span class="account-profile__property">Телефон</span>
                    <p v-if="user.userProfile.phones?.length" class="account-profile__value-list">
                        <span
                            v-for="phone in user.userProfile.phones"
                            :key="phone.id"
                            class="account-profile__value"
                        >
                            {{ phone.phone }}
                        </span>
                    </p>
                    <p v-else>Не указан</p>
                </li>
                <li class="account-profile__category">
                    <span class="account-profile__property">Рабочий Email</span>
                    <span class="account-profile__value">{{ user.email }}</span>
                </li>
                <li class="account-profile__category">
                    <span class="account-profile__property">Логин от Email</span>
                    <span class="account-profile__value">{{ user.email_username }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import AccountCard from '@/components/Account/AccountCard.vue';

defineEmits(['edit']);
const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});
</script>
