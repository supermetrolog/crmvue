<template>
    <Modal
        @close="close"
        :show="opened"
        width="1200"
        :title="promiseProps ? 'Редактирование уведомления' : 'Создание уведомления'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="loading" center />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <Input
                    v-model="form.description.subject"
                    class="mb-2"
                    type="text"
                    label="Заголовок"
                    required
                />
                <Textarea v-model="form.description.message" label="Описание" required />
            </template>
        </Stepper>
    </Modal>
</template>
<script>
import Spinner from '@/components/common/Spinner.vue';
import Modal from '@/components/common/Modal.vue';
import { AsyncModalMixin } from '@/components/common/mixins';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import Stepper from '@/components/common/Stepper.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Input from '@/components/common/Forms/Input.vue';

export default {
    name: 'FormModalMessageAlert',
    components: {
        Input,
        Textarea,
        Stepper,
        UserPicker,
        Modal,
        Spinner
    },
    mixins: [AsyncModalMixin],
    data() {
        return {
            v$: useValidate(),
            loading: false,
            consultants: [],
            form: {
                user_id: null,
                description: {
                    message: null,
                    subject: null
                }
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
                    name: 'description',
                    title: 'Дополнительное сообщение'
                }
            ];
        }
    },
    watch: {
        opened(newValue) {
            if (newValue) {
                if (!this.consultants?.length) this.fetchConsultants();
                if (this.promiseProps)
                    this.form = {
                        user_id: this.promiseProps.user_id,
                        description: {
                            message: this.promiseProps.message,
                            subject: this.promiseProps.subject
                        }
                    };
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
                user_id: null,
                description: {
                    message: null,
                    subject: null
                }
            };
        },
        submit() {
            this.resolve({
                user_id: this.form.user_id,
                message: this.form.description.message,
                subject: this.form.description.subject
            });
        }
    },
    validations() {
        return {
            form: {
                user_id: {
                    required: helpers.withMessage('Выберите сотрудника!', required)
                },
                description: {
                    message: {
                        required: helpers.withMessage('Укажите заголовок уведомления', required)
                    },
                    subject: {
                        required: helpers.withMessage('Укажите небольшое описание', required)
                    }
                }
            }
        };
    }
};
</script>
