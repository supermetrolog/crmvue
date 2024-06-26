<template>
    <Form @submit="onSubmit">
        <Loader v-if="loader" />
        <FormGroup>
            <MultiSelect
                v-model="form.passive_why"
                :v="v$.form.passive_why"
                required
                label="Причина"
                class="col-12"
                :options="passiveWhyOptions"
            />
            <Textarea
                v-model="form.passive_why_comment"
                :v="v$.form.passive_why_comment"
                required
                label="Комментарий"
                class="col-12 mt-2"
            />
            <Submit class="col-12 mt-2" button-classes="btn-danger"> Завершить</Submit>
        </FormGroup>
    </Form>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/Submit.vue';
import useValidate from '@vuelidate/core';
import { PassiveWhyRequest } from '@/const/const.js';
import { helpers, required } from '@vuelidate/validators';
import api from '@//api/api.js';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'FormCompanyRequestDisable',
    components: {
        Loader,
        Form,
        FormGroup,
        Textarea,
        MultiSelect,
        Submit
    },
    props: {
        request_id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            form: {
                passive_why: null,
                passive_why_comment: null
            }
        };
    },
    computed: {
        passiveWhyOptions: () => PassiveWhyRequest
    },
    validations() {
        return {
            form: {
                passive_why: {
                    required: helpers.withMessage('Выберите причину', required)
                },
                passive_why_comment: {
                    required: helpers.withMessage('Укажите комментарий', required)
                }
            }
        };
    },
    methods: {
        async onSubmit() {
            this.v$.$validate();
            if (this.v$.form.$error) {
                return;
            }

            this.loader = true;
            if (await api.request.disable(this.request_id, this.form))
                this.$emit('disabled', this.form);
            this.loader = false;
        }
    }
};
</script>

<style></style>
