<template>
    <div class="notification-form">
        <Form @submit="onSubmit" class="autosize">
            <Loader v-if="loader" class="center" />
            <FormGroup class="mb-2">
                <Input v-model="form.title" class="col-12" label="Название" :v="v$.form.title" />
                <Input
                    v-model="form.startDate"
                    class="col-12"
                    :v="v$.form.startDate"
                    type="datetime-local"
                    label="Начало события"
                />
                <Input v-model="form.endDate" class="col-12" type="datetime-local" label="Конец события" />
            </FormGroup>
            <FormGroup>
                <button class="btn btn-success">Создать</button>
            </FormGroup>
        </Form>
    </div>
</template>

<script>
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { mapActions } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import { FormMixin } from '@/components/Forms/mixins.js';

export default {
    name: 'FormEvent',
    components: {
        Loader
    },
    mixins: [FormMixin],
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
            loader: false,
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
        ...mapActions(['CREATE_CALENDAR_EVENT', 'UPDATE_CALENDAR_EVENT']),
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.loader = true;
                if (this.forUpdate) {
                    await this.update();
                } else {
                    await this.create();
                }
                this.loader = false;
            }
        },

        async create() {
            if (await this.CREATE_CALENDAR_EVENT(this.form)) {
                this.$emit('created', this.form);
            }
        },
        async update() {
            if (await this.UPDATE_CALENDAR_EVENT(this.form)) {
                this.$emit('updated', this.form);
            }
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