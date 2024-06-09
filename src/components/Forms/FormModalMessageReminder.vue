<template>
    <Modal
        v-if="opened"
        @close="close"
        width="1200"
        :title="promiseProps ? 'Редактирование напоминания' : 'Создание напоминания'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="loading" center />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <DatePicker v-model="form.notify_at" size="70px" class="mx-auto" />
            </template>
            <template #3>
                <Textarea v-model="form.message" label="Описание" />
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
import Textarea from '@/components/common/Forms/Textarea.vue';

export default {
    name: 'FormModalMessageReminder',
    components: {
        Textarea,
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
            consultants: [],
            form: {
                message: null,
                notify_at: null,
                user_id: null,
                status: 1
            }
        };
    },
    computed: {
        steps() {
            return [
                {
                    name: 'user_id',
                    title: 'Выбор сотрудников'
                },
                {
                    name: 'notify_at',
                    title: 'Выбор даты'
                },
                {
                    name: 'message',
                    title: 'Дополнительное описание'
                }
            ];
        }
    },
    watch: {
        opened(newValue) {
            if (newValue) {
                if (!this.consultants?.length) this.fetchConsultants();

                if (this.promiseProps) {
                    this.form = {
                        user_id: this.promiseProps.user_id,
                        notify_at: this.promiseProps.notify_at,
                        message: this.promiseProps.message ?? null,
                        status: this.promiseProps.status ?? 1
                    };
                }
            } else this.clearForm();
        }
    },
    methods: {
        async fetchConsultants() {
            this.loading = true;

            this.consultants = await this.$store.dispatch('getConsultants');

            this.loading = false;
        },
        clearForm() {
            this.form = {
                message: null,
                notify_at: null,
                user_id: null,
                status: 1
            };
        },
        submit() {
            this.resolve(this.form);
        }
    },
    validations() {
        return {
            form: {
                notify_at: {
                    required: helpers.withMessage('Выберите дату напоминания!', required)
                },
                user_id: {
                    minLength: helpers.withMessage('Выберите сотрудника!', required)
                },
                message: {
                    required: helpers.withMessage('Укажите сообщение к напоминанию', required)
                }
            }
        };
    }
};
</script>
