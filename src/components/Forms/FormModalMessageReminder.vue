<template>
    <Modal
        v-if="opened"
        @close="close"
        width="1200"
        :title="promiseProps ? 'Редактирование напоминания' : 'Создание напоминания'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="loading" center class="spinner--green" />
                <UserPicker v-else v-model="form.users" :users="users" />
            </template>
            <template #2>
                <DatePicker v-model="form.date.reminder" size="70px" class="mx-auto" />
            </template>
        </Stepper>
    </Modal>
</template>
<script>
import Stepper from '@/components/common/Stepper.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import { AsyncModalMixin } from '@/components/common/mixins';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import { helpers, required } from '@vuelidate/validators';
import useValidate from '@vuelidate/core';

export default {
    name: 'FormModalMessageReminder',
    components: {
        UserPicker,
        Modal,
        Spinner,
        DatePicker,
        Stepper
    },
    mixins: [AsyncModalMixin],
    data() {
        return {
            v$: useValidate(),
            loading: false,
            users: [],
            form: {
                date: {
                    reminder: null
                },
                users: []
            }
        };
    },
    computed: {
        steps() {
            return [
                {
                    name: 'users',
                    title: 'Выбор сотрудников'
                },
                {
                    name: 'date',
                    title: 'Выбор даты'
                }
            ];
        }
    },
    watch: {
        opened(newValue) {
            if (newValue) {
                this.form = {
                    date: {
                        reminder: this.promiseProps?.reminder
                    },
                    users: this.promiseProps?.users ?? []
                };

                this.fetchUsers();
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
            this.resolve({
                reminder: this.form.date.reminder,
                users: this.form.users.length === this.users.length ? true : this.form.users
            });
        }
    },
    validations() {
        return {
            form: {
                date: {
                    reminder: {
                        required: helpers.withMessage('Выберите дату напоминания!', required)
                    }
                },
                users: {
                    minLength: helpers.withMessage('Выберите хотя бы одного сотрудника!', required)
                }
            }
        };
    }
};
</script>
