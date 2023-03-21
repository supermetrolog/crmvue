<template>
    <div class="UserProfile">
        <div class="UserProfile-logout">
            <button class="btn btn-danger" @click="clickLogout">Выйти</button>
        </div>
        <p class="UserProfile-name">
            {{ user.userProfile.full_name }}
        </p>
        <hr />
        <div class="UserProfile-table">
            <div class="UserProfile-row">
                <span class="label">Юзернейм</span>
                <div class="data">
                    <span>{{ user.username }}</span>
                </div>
            </div>
            <div class="UserProfile-row">
                <span class="label">Дата регистрации</span>
                <div class="data">
                    <span>{{ user.created_at_format }}</span>
                </div>
            </div>
            <div class="UserProfile-row">
                <span class="label">Номер телефона</span>
                <div class="data">
                    <template v-if="userPhones.length > 0">
                        <span v-for="phone in userPhones" :key="phone.id">
                            {{ phone.phone }}
                        </span>
                    </template>
                    <template v-else>
                        <span>Не указано</span>
                    </template>
                </div>
            </div>
            <div class="UserProfile-row">
                <span class="label">Почта</span>
                <div class="data">
                    <template v-if="userEmails.length > 0">
                        <span v-for="email in userEmails" :key="email.id">
                            {{ email.email }}
                        </span>
                    </template>
                    <template v-else>
                        <span>Не указано</span>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import './styles.scss';

export default {
    name: 'UserProfile',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {}
    },
    computed: {
        userPhones() {
            return this.user.userProfile.phones;
        },
        userEmails() {
            return this.user.userProfile.emails;
        }
    },
    methods: {
        clickLogout() {
            this.$emit('logOut');
        }
    }
}
</script>
