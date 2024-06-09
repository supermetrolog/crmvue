<template>
    <Modal
        v-if="opened"
        @close="close"
        width="1200"
        :title="promiseProps ? 'Редактирование уведомления' : 'Создание уведомления'"
    >
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <Spinner v-if="loading" center />
                <UserPicker v-else v-model="form.user_id" single :users="consultants" />
            </template>
            <template #2>
                <Textarea v-model="form.message" label="Описание" />
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

export default {
    name: 'FormModalMessageAlert',
    components: {
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
                message: null,
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
                    name: 'message',
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
                        message: this.promiseProps.message
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
                message: null,
                user_id: null
            };
        },
        submit() {
            this.resolve({
                user_id: this.form.user_id,
                message: this.form.message
            });
        }
    },
    validations() {
        return {
            form: {
                user_id: {
                    minLength: helpers.withMessage('Выберите сотрудника!', required)
                }
            }
        };
    }
};
</script>
