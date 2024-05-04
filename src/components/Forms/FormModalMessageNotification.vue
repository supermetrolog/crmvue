<template>
    <Modal
        v-if="opened"
        @close="close"
        width="1200"
        :title="promiseProps ? 'Редактирование уведомления' : 'Создание уведомления'"
    >
        <div class="mb-3">
            <Spinner v-if="loading" center class="spinner--green" />
            <UserPicker v-else v-model="form.users" :users="users" />
        </div>
        <div>
            <MessengerButton @click="submit" color="success mx-auto" :disabled="!form.users.length">
                Создать
            </MessengerButton>
        </div>
    </Modal>
</template>
<script>
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import { AsyncModalMixin } from '@/components/common/mixins';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';

export default {
    name: 'FormModalMessageNotification',
    components: {
        MessengerButton,
        UserPicker,
        Modal,
        Spinner
    },
    mixins: [AsyncModalMixin],
    data() {
        return {
            loading: false,
            users: [],
            form: {
                users: []
            }
        };
    },
    watch: {
        opened(newValue) {
            if (newValue) {
                this.fetchUsers();

                this.form = {
                    users: this.promiseProps?.users ?? []
                };
            } else this.users = [];
        }
    },
    methods: {
        async fetchUsers() {
            this.loading = true;

            this.users = await this.$store.dispatch('getConsultants');

            this.loading = false;
        },
        submit() {
            this.resolve(this.form.users.length === this.users.length ? true : this.form.users);
        }
    }
};
</script>
