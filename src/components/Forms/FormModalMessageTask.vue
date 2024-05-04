<template>
    <Modal
        v-if="opened"
        @close="close"
        width="1200"
        :title="promiseProps ? 'Редактирование задачи' : 'Создание задачи'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="loading" center class="spinner--green" />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <DatePicker v-model="form.date.end" size="70px" class="mx-auto" />
            </template>
            <template #3>
                <Textarea v-model="form.message" label="Описание задачи" />
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
    name: 'FormModalMessageTask',
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
                date: {
                    end: null
                },
                user_id: null
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
                    name: 'date',
                    title: 'Выбор даты'
                },
                {
                    name: 'message',
                    title: 'Описание задачи'
                }
            ];
        }
    },
    watch: {
        opened(newValue) {
            if (newValue) {
                if (!this.consultants?.length) this.fetchConsultants();

                this.form = {
                    date: {
                        end: this.promiseProps?.end
                    },
                    user_id: this.promiseProps?.user_id ?? null,
                    message: this.promiseProps?.message
                };
            }
        }
    },
    methods: {
        async fetchConsultants() {
            this.loading = true;

            this.consultants = await this.$store.dispatch('getConsultants');

            this.loading = false;
        },
        submit() {
            this.resolve({
                end: this.form.date.end,
                user_id: this.form.user_id,
                message: this.form.message
            });
        }
    },
    validations() {
        return {
            form: {
                date: {
                    end: {
                        required: helpers.withMessage('Выберите дату истечения задачи!', required)
                    }
                },
                user_id: {
                    minLength: helpers.withMessage('Выберите сотрудника!', required)
                },
                message: {
                    required: helpers.withMessage(
                        'Описание задачи является обязательным!',
                        required
                    )
                }
            }
        };
    }
};
</script>
