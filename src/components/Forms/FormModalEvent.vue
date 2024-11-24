<template>
    <Modal @close="$emit('close')" show title="Создание события" width="600">
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup class="mb-2">
                <Input v-model="form.title" class="col-12" label="Название" :v="v$.form.title" />
                <Input
                    v-model="form.startDate"
                    class="col-12"
                    :v="v$.form.startDate"
                    type="datetime-local"
                    label="Начало события"
                />
                <Input
                    v-model="form.endDate"
                    class="col-12"
                    type="datetime-local"
                    label="Конец события"
                />
            </FormGroup>
            <FormGroup>
                <div class="col-12">
                    <Submit class="w-100" success>Создать</Submit>
                </div>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import Form from '@/components/common/Forms/Form.vue';
import Loader from '@/components/common/Loader.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import { helpers, required } from '@vuelidate/validators';
import useValidate from '@vuelidate/core';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import api from '@/api/api.js';

export default {
    name: 'FormModalEvent',
    components: {
        Submit,
        Input,
        FormGroup,
        Loader,
        Form,
        Modal
    },
    emits: ['close', 'updated', 'created'],
    props: {
        formdata: {
            type: Object
        },
        forUpdate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            v$: useValidate(),
            isLoading: false,
            form: {
                title: null,
                startDate: null,
                endDate: null,
                consultant_id: null
            }
        };
    },
    validations() {
        return {
            form: {
                title: {
                    required: helpers.withMessage('Заполните название', required)
                },
                startDate: {
                    required: helpers.withMessage('Выберите дату начала события', required)
                }
            }
        };
    },
    methods: {
        async onSubmit() {
            this.v$.$validate();

            if (!this.v$.form.$error) {
                this.isLoading = true;

                if (this.forUpdate) await this.update();
                else await this.create();

                this.isLoading = false;
            }
        },
        async create() {
            const createdEvent = await api.calendar.createEvent(this.form);
            if (createdEvent) this.$emit('created', this.form);
        },
        async update() {
            const updatedEvent = await api.calendar.updateEvent(this.form);
            if (updatedEvent) this.$emit('updated', this.form);
        }
    },
    mounted() {
        if (this.formdata) {
            this.form = { ...this.form, ...this.formdata };
        }
    }
};
</script>

<style></style>
