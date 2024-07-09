<template>
    <Modal @close="$emit('close')" class="form-company-deal" :width="1000">
        <template #header>
            <Switch
                v-model="form.is_our"
                @change="changeIsCompetitor"
                :transform="Number"
                :checked="form.is_our"
                false-title="Сделка конкурентов"
                true-title="Наша сделка"
            />
        </template>
        <Loader v-if="isLoading" />
        <Form @submit="onSubmit">
            <FormGroup>
                <MultiSelect
                    v-model="form.competitor_company_id"
                    :disabled="!!form.is_our"
                    :v="v$.form.competitor_company_id"
                    extra-classes="long-text"
                    label="Компания конкурент"
                    :required="!form.is_our"
                    class="col-6"
                    :filterResults="false"
                    :min-chars="1"
                    :resolve-on-load="true"
                    :delay="500"
                    :searchable="true"
                    :options="
                        async query => {
                            if (!query?.length) return [];
                            return await searchCompetitorCompany(query);
                        }
                    "
                />
                <MultiSelect
                    v-model="form.offerHandler"
                    @change="changeOfferHandler"
                    :v="v$.form.object_id"
                    :disabled="!!object_id"
                    extra-classes="long-text"
                    label="Предложение"
                    required
                    class="col-6"
                    :filterResults="false"
                    :min-chars="1"
                    :resolve-on-load="true"
                    :delay="500"
                    :searchable="true"
                    :options="
                        async query => {
                            if (!query?.length) return [];
                            return await searchOffer(query);
                        }
                    "
                >
                    <template #option="{ option }">
                        <div class="form-company-deal__offer">
                            <VLazyImage
                                :src="option.description.thumb"
                                class="form-company-deal__thumb"
                                alt="company deal thumb"
                            />
                            <p>
                                <span>
                                    <b> #{{ option.value.visual_id }} </b>,
                                </span>
                                <span v-if="option.description.deal">
                                    {{ option.description.deal }},
                                </span>
                                <span>{{ option.description.district }}</span>
                            </p>
                        </div>
                    </template>
                </MultiSelect>
            </FormGroup>
            <FormGroup>
                <Input v-model="form.name" label="Название" class="col-6 pr-1" />
                <Input
                    v-model="form.area"
                    label="Площадь сделки"
                    class="col-6"
                    maska="##########"
                />
                <MultiSelect
                    v-model="form.company_id"
                    @change="onChangeCompany"
                    :disabled="!!company_id"
                    extra-classes="long-text"
                    label="Компания"
                    required
                    class="col-6"
                    :v="v$.form.company_id"
                    :filterResults="false"
                    :min-chars="1"
                    :resolve-on-load="true"
                    :delay="500"
                    :searchable="true"
                    :options="
                        async query => {
                            if (!query?.length) return [];
                            return await searchCompany(query);
                        }
                    "
                />
                <MultiSelect
                    :key="requestOptions.length"
                    v-model="form.request_id"
                    :disabled="!form.company_id || !!request_id"
                    extra-classes="long-text"
                    :v="v$.form.request_id"
                    :required="!!request_id"
                    label="Запрос"
                    class="col-6"
                    :options="requestOptions"
                />
            </FormGroup>
            <FormGroup>
                <Input
                    v-model="form.clientLegalEntity"
                    label="Юр. лицо клиента в сделке"
                    class="col-6"
                />
                <MultiSelect
                    v-model="form.formOfOrganization"
                    label="ФО"
                    title="Форма организации"
                    class="col-3"
                    :options="CompanyFormOrganization"
                />
                <Input
                    v-model="form.floorPrice"
                    label="Цена пола"
                    class="col-3"
                    maska="##########"
                />
            </FormGroup>
            <FormGroup>
                <MultiSelect
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    required
                    label="Консультант"
                    class="col-6"
                    :options="CONSULTANT_LIST"
                />
                <Input v-model="form.dealDate" label="Дата сделки" type="date" class="col-3" />
                <Input
                    v-model="form.contractTerm"
                    label="Срок контракта в месяцах"
                    :disabled="!contractTermVisible"
                    class="col-3"
                    maska="####"
                />
            </FormGroup>
            <FormGroup>
                <Textarea v-model="form.description" label="Описание" class="col-12" />
            </FormGroup>
            <Submit success class="col-4 mx-auto">{{ formData ? 'Сохранить' : 'Создать' }}</Submit>
        </Form>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
import useVuelidate from '@vuelidate/core';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import api from '@//api/api.js';
import { CompanyFormOrganization } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import dayjs from 'dayjs';
import { computed, onBeforeMount, reactive, ref, shallowRef } from 'vue';
import { validationRulesForCompanyDeal } from '@/validators/rules.js';
import Switch from '@/components/common/Forms/Switch.vue';
import VLazyImage from 'v-lazy-image';
import axios from 'axios';

const emit = defineEmits(['updated', 'created', 'close']);
const props = defineProps({
    formData: {
        type: Object
    },
    request_id: {
        type: Number
    },
    company_id: {
        type: Number
    },
    object_id: {
        type: Number
    },
    complex_id: {
        type: Number
    },
    type_id: {
        type: Number
    },
    original_id: {
        type: Number
    },
    visual_id: {
        type: String
    },
    isOurDeal: {
        type: Boolean,
        default: false
    },
    dealType: {
        type: Number,
        default: null
    }
});

const store = useStore();

const isLoading = shallowRef(false);
const selectedCompany = ref(null);
const selectedCompetitorCompany = ref(null);
const selectedOffer = ref(null);
const requestOptions = ref([]);

const form = reactive({
    request_id: null,
    company_id: null,
    consultant_id: null,
    name: null,
    area: null,
    floorPrice: null,
    clientLegalEntity: null,
    description: null,
    dealDate: dayjs(new Date()).format('YYYY-MM-DD'),
    contractTerm: null,
    is_our: 1,
    is_competitor: 0,
    competitor_company_id: null,
    complex_id: null,
    object_id: null,
    type_id: null,
    formOfOrganization: null,
    offerHandler: null,
    original_id: null,
    visual_id: null
});

const v$ = useVuelidate({ form: validationRulesForCompanyDeal }, { form });

const CONSULTANT_LIST = computed(() => store.getters.CONSULTANT_LIST);

const changeIsCompetitor = () => {
    form.is_competitor = Number(!form.is_our);
};
const contractTermVisible = () => {
    if (!requestOptions.value.length || !form.request_id) return false;

    const currentRequestOption = requestOptions.value.find(item => item.value == form.request_id);

    return (
        (currentRequestOption && currentRequestOption.label.indexOf('аренда') !== -1) ||
        currentRequestOption.label.indexOf('ответ-хранение') !== -1
    );
};

const update = async () => {
    const updated = store.dispatch('UPDATE_DEAL', form);

    if (updated) {
        emit('updated', form);
        emit('close');
    }

    isLoading.value = false;
};

const create = async () => {
    const created = store.dispatch('CREATE_DEAL', form);

    if (created) {
        emit('created', form);
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = () => {
    v$.value.$validate();

    if (!form.clientLegalEntity) form.formOfOrganization = null;

    if (!v$.value.form.$error) {
        isLoading.value = true;

        if (props.formData) update();
        else create();
    }
};

const onChangeCompany = async () => {
    if (props.request_id) return;

    form.request_id = null;
    requestOptions.value = [];

    if (!form.company_id) return;

    const requestList = await api.request.searchRequests({
        company_id: form.company_id,
        status: [1, 0]
    });

    requestList.data.forEach(item => {
        requestOptions.value.push({
            value: item.id,
            label: item.format_name + '^2'
        });
    });
};

const searchCompany = async query => {
    let array = [];
    let requestList = null;

    requestOptions.value = [];

    if (props.formData || props.company_id) {
        if (!selectedCompany.value) {
            selectedCompany.value = await api.companies.getCompany(
                props.formData ? props.formData.company_id : props.company_id
            );

            requestList = await api.request.searchRequests({
                company_id: props.formData ? props.formData.company_id : props.company_id
            });
        }

        if (requestList && Array.isArray(requestList.data)) {
            requestList.data.forEach(item => {
                requestOptions.value.push({
                    value: item.id,
                    label: item.format_name + '^2'
                });
            });
        }

        array.push({
            value: selectedCompany.value.id,
            label: selectedCompany.value.full_name
        });
    }

    const result = await api.companies.searchCompanies({ all: query });
    result.data.forEach(item => {
        array.push({ value: item.id, label: item.full_name });
    });

    return array;
};

const searchCompetitorCompany = async query => {
    const array = [];

    if (props.formData || props.competitor_company_id) {
        if (!selectedCompetitorCompany.value)
            selectedCompetitorCompany.value = await api.companies.getCompany(
                props.formData ? props.formData.company_id : props.company_id
            );
        array.push({
            value: selectedCompetitorCompany.value.id,
            label: selectedCompetitorCompany.value.full_name
        });
    }

    const result = await api.companies.searchCompanies({ all: query });
    result.data.forEach(item => {
        array.push({ value: item.id, label: item.full_name });
    });

    return array;
};

const searchOffer = async query => {
    let array = [];

    if (props.formData || props.object_id) {
        if (!selectedOffer.value) {
            const params = {
                original_id: props.formData ? props.formData.offer?.original_id : props.original_id,
                object_id: props.formData ? props.formData.offer.object_id : props.object_id,
                type_id: props.formData ? props.formData.offer.type_id : props.type_id,
                'per-page': 1
            };

            let data = await api.companyObjects.searchOffers(params);
            if (data?.data?.length) selectedOffer.value = data.data[0];
        }

        array.push({
            value: {
                original_id: selectedOffer.value.original_id,
                object_id: selectedOffer.value.object_id,
                type_id: selectedOffer.value.type_id,
                visual_id: selectedOffer.value.visual_id,
                complex_id: selectedOffer.value.complex_id
            },
            label: selectedOffer.value.visual_id
        });
    }

    const result = await api.companyObjects.searchOffers({
        all: query,
        type_id: [1, 2, 3],
        'per-page': 10
    });

    result.data.forEach(item => {
        array.push({
            value: {
                original_id: item.original_id,
                object_id: item.object_id,
                type_id: item.type_id,
                visual_id: item.visual_id,
                complex_id: item.complex_id
            },
            description: {
                thumb: item.thumb,
                deal: item.deal_type_name,
                area: item.calc_area_floor,
                district: item.district_name
            },
            label: item.visual_id
        });
    });

    return array;
};

const changeOfferHandler = () => {
    Object.assign(form, form.offerHandler);
};

const setForm = () => {
    form.request_id = props.request_id;
    form.company_id = props.company_id;
    form.consultant_id = props.consultant_id;
    form.object_id = props.object_id;
    form.original_id = props.original_id;
    form.complex_id = props.complex_id;
    form.type_id = props.type_id;
    form.visual_id = props.visual_id;

    if (props.formData) Object.assign(form, props.formData);

    form.offerHandler = {
        object_id: form.object_id,
        original_id: form.original_id,
        complex_id: form.complex_id,
        type_id: form.type_id,
        visual_id: form.visual_id
    };
};

onBeforeMount(async () => {
    isLoading.value = true;

    setForm();
    await store.dispatch('FETCH_CONSULTANT_LIST');

    isLoading.value = false;
});
</script>
