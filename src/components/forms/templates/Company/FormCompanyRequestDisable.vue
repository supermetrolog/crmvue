<template>
    <Form class="autosize" @submit="onSubmit">
        <Loader class="center" v-if="loader"/>
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
                label="Комментарий"
                class="col-12"
            />
            <Submit class="col-12 mt-2" buttonClasses="btn-danger">
                Завершить
            </Submit>
        </FormGroup>
    </Form>
</template>

<script>
import Form from "@/components/forms/Form.vue";
import FormGroup from "@/components/forms/FormGroup.vue";
import Textarea from "@/components/forms/Textarea.vue";
import MultiSelect from "@/components/forms/MultiSelect.vue";
import Submit from "@/components/forms/Submit.vue";
import useValidate from "@vuelidate/core";
import {PassiveWhyRequest} from "@/const/const.js";
import {helpers, required} from "@vuelidate/validators";
import api from "@/api/api.js";
import Loader from "@/components/common/Loader.vue";

export default {
    name: "FormCompanyRequestDisable",
    components: {
        Loader,
        Form,
        FormGroup,
        Textarea,
        MultiSelect,
        Submit,
    },
    data() {
        return {
            v$: useValidate(),
            passiveWhyOptions: PassiveWhyRequest.get("param"),
            loader: false,
            form: {
                passive_why: null,
                passive_why_comment: null,
            },
        };
    },
    props: {
        request_id: {
            type: Number,
            required: true,
        },
    },
    validations() {
        return {
            form: {
                passive_why: {
                    required: helpers.withMessage("выберите причину", required),
                },
            },
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
                this.$emit("disabled", this.form);
            this.loader = false;
        },
    },
};
</script>

<style>
</style>