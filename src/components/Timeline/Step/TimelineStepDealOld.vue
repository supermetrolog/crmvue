<template>
    <div class="col mb-2">
        <Loader v-if="loader" class="center" />
        <Form v-if="data" @submit="onSubmit" class="center">
            <FormGroup class="mb-1">
                <Input v-model="form.name" label="Название" class="col-6 pr-1" />
                <Input v-model="form.area" label="Площадь сделки" class="col-6" />
            </FormGroup>
            <FormGroup class="mb-1">
                <Input v-model="form.clientLegalEntity" label="Юр. лицо клиента в сделке" class="col-6 pr-1" />
                <Input v-model="form.floorPrice" label="Цена пола" class="col-6" />
            </FormGroup>
            <FormGroup class="mb-1">
                <MultiSelect
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    required
                    label="Консультант"
                    class="col-6 pr-1"
                    :options="CONSULTANT_LIST"
                />
                <Textarea v-model="form.description" label="Описание" class="col-6" />
            </FormGroup>
            <FormGroup class="mb-1">
                <Input v-model="form.startEventTime" label="Время начала события" type="date" class="col-6 pr-1" />
                <Input v-model="form.endEventTime" label="Время завершения события" type="date" class="col-6" />
            </FormGroup>
            <FormGroup class="mt-4">
                <Submit class="col-4 mx-auto">
                    {{ deal ? 'Сохранить' : 'Создать' }}
                </Submit>
            </FormGroup>
        </Form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Submit from '@/components/common/Forms/Submit.vue';
import { MixinSteps } from '@/components/Timeline/mixins.js';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'TimelineStepDealOld',
    components: {
        Loader,
        Form,
        FormGroup,
        Input,
        Textarea,
        MultiSelect,
        Submit
    },
    mixins: [MixinSteps],
    props: {
        request_id: {
            type: Number
        },
        loaderForStep: {
            type: [Number, Boolean]
        }
    },
    data() {
        return {
            loader: this.loaderForStep,
            v$: useValidate(),
            form: {
                request_id: null,
                consultant_id: null,
                name: null,
                area: null,
                floorPrice: null,
                clientLegalEntity: null,
                description: null,
                startEventTime: null,
                endEventTime: null
            }
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST', 'COMPANY_REQUESTS']),
        deal() {
            return this.COMPANY_REQUESTS.find(item => item.id == this.request_id).deal;
        }
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
        ...mapActions(['FETCH_CONSULTANT_LIST', 'FETCH_COMPANY_REQUESTS']),
        onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.data.requestDealData = this.form;
                this.$emit('updateItem', this.data, false, () => {
                    this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
                });
            }
        },
        setData() {
            if (this.deal) {
                this.form = { ...this.deal };
                this.form.object_id = this.data.timelineStepObjects[0].object_id;
                this.form.complex_id = this.data.timelineStepObjects[0].complex_id;
            } else {
                this.form.request_id = this.request_id;
                this.form.object_id = this.data.timelineStepObjects[0].object_id;
                this.form.complex_id = this.data.timelineStepObjects[0].complex_id;
            }
        }
    },
    async mounted() {
        this.loader = true;
        await this.FETCH_CONSULTANT_LIST();
        this.setData();
        this.loader = this.loaderForStep;
    },
    watch: {
        deal() {
            this.setData();
        },
        loaderForStep() {
            this.loader = this.loaderForStep;
        }
    }
};
</script>

<style></style>
