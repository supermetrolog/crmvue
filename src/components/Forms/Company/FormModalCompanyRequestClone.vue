<template>
    <Modal @close="$emit('close')" show width="750" title="Клонирование запроса">
        <Form @submit="onSubmit">
            <Loader v-if="loader" />
            <FormGroup>
                <MultiSelect
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    required
                    label="Консультант"
                    class="col-8 text-center mx-auto"
                    :options="CONSULTANT_LIST"
                />
                <div class="col-12 text-center mt-4">
                    <CompanyBoxRequestsListItem :request="request" read-only />
                </div>
                <Submit class="col-4 mt-2 mx-auto" success>Клонировать</Submit>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Form from '@/components/common/Forms/Form.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import useValidate from '@vuelidate/core';
import { mapActions, mapGetters } from 'vuex';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api.js';

export default {
    name: 'FormModalCompanyRequestClone',
    components: {
        MultiSelect,
        FormGroup,
        CompanyBoxRequestsListItem,
        Loader,
        Form,
        Submit,
        Modal
    },
    emits: ['cloned', 'close'],
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
        ...mapActions(['FETCH_CONSULTANT_LIST']),
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

            const createdRequest = await api.request.create(request);
            if (createdRequest) this.$emit('cloned');

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
