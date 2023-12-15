<template>
    <div class="company-request-clone-form">
        <div class="row no-gutters">
            <div class="col-12 text-center">
                <Form @submit="onSubmit" class="autosize">
                    <Loader v-if="loader" class="center" />
                    <FormGroup>
                        <MultiSelect
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            required
                            label="Консультант"
                            class="col-6 text-center mx-auto"
                            :options="CONSULTANT_LIST"
                        />
                        <div class="col-12 text-center mt-4">
                            <CompanyBoxRequestsListItem :request="request" :reedOnly="true" />
                        </div>
                        <Submit class="col-4 mt-2 mx-auto" buttonClasses="btn-success"> Клонировать </Submit>
                    </FormGroup>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/Submit.vue';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';

export default {
    name: 'FormCompanyRequestClone',
    components: {
        CompanyBoxRequestsListItem,
        Loader,
        Form,
        FormGroup,
        MultiSelect,
        Submit
    },
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            form: {
                consultant_id: null
            }
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST'])
    },
    validations() {
        return {
            form: {
                consultant_id: {
                    required: helpers.withMessage('выберите консультанта', required)
                }
            }
        };
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST', 'CREATE_REQUEST']),
        async onSubmit() {
            this.v$.$validate();
            if (this.v$.form.$error) {
                return;
            }

            this.loader = true;
            const request = {
                ...this.request,
                consultant_id: this.form.consultant_id
            };
            delete request.id;
            delete request.created_at;
            delete request.updated_at;
            request.status = 1;
            if (await this.CREATE_REQUEST(request)) {
                this.$emit('cloned');
            }
            this.loader = false;
        }
    },

    async created() {
        this.loader = true;
        await this.FETCH_CONSULTANT_LIST();
        this.loader = false;
    }
};
</script>

<style></style>