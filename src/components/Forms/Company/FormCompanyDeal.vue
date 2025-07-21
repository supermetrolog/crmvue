<template>
    <UiModal
        @close="$emit('close')"
        title="Оформление сделки"
        show
        custom-close
        :width="1200"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <UiInput v-model="form.name" label="Название" class="col-12" />
                <MultiSelect
                    v-model="form.offerHandler"
                    @change="changeOfferHandler"
                    :v="v$.form.object_id"
                    :disabled="!!object_id"
                    extra-classes="long-text"
                    label="Предложение"
                    required
                    class="col-12"
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
                        <div class="d-flex gap-2">
                            <LazyImage
                                :src="option.description.thumb"
                                style="height: 50px; min-width: 90px; max-width: 90px"
                            />
                            <div>
                                <p class="font-weight-semi">#{{ option.value.visual_id }},</p>
                                <p v-if="option.description.deal" class="fs-2">
                                    {{ option.description.deal }}
                                </p>
                                <p class="fs-2">
                                    {{ option.description.address }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #after>
                        <Switch
                            v-model="form.is_our"
                            @change="changeIsCompetitor"
                            :transform="Number"
                            :checked="form.is_our"
                            false-title="Сделка конкурентов"
                            true-title="Наша сделка"
                        />
                    </template>
                </MultiSelect>
                <AnimationTransition :speed="0.45">
                    <UiCol v-if="!form.is_our" :cols="12">
                        <div class="dashboard-bg-light py-2 br-1">
                            <MultiSelect
                                v-model="form.competitor_company_id"
                                :v="v$.form.competitor_company_id"
                                extra-classes="long-text"
                                label="Компания конкурент"
                                :required="!form.is_our"
                                class="col-12"
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
                        </div>
                    </UiCol>
                </AnimationTransition>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <MultiSelect
                    v-if="!company_id"
                    v-model="form.company_id"
                    @change="onChangeCompany"
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
                <UiInput
                    v-model="form.clientLegalEntity"
                    label="Юр. лицо клиента в сделке"
                    class="col-3"
                />
                <MultiSelect
                    v-model="form.formOfOrganization"
                    label="Форма организации"
                    title="Форма организации"
                    class="col-3"
                    :options="CompanyFormOrganization"
                />
            </UiFormGroup>
            <UiFormGroup>
                <MultiSelect
                    v-if="!request_id"
                    :key="requestOptions.length"
                    v-model="form.request_id"
                    :disabled="!form.company_id"
                    extra-classes="long-text"
                    :v="v$.form.request_id"
                    :required="!!request_id"
                    label="Запрос"
                    class="col-12"
                    :options="requestOptions"
                >
                    <template v-if="!formData" #after>
                        <UiCheckbox
                            v-model="form.complete_request"
                            :true-value="1"
                            :false-value="0"
                        >
                            Завершить запрос
                        </UiCheckbox>
                    </template>
                </MultiSelect>
            </UiFormGroup>
            <UiFormGroup>
                <UiInput
                    v-model="form.area"
                    label="Площадь сделки"
                    class="col-6"
                    type="number"
                    unit="м<sup>2</sup>"
                />
                <UiInput v-model="form.floorPrice" label="Цена пола" class="col-6" />
            </UiFormGroup>
            <UiFormGroup>
                <MultiSelect
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    required
                    label="Консультант"
                    class="col-5"
                    :options="CONSULTANT_LIST"
                />
                <UiDateInput v-model="form.dealDate" label="Дата сделки" class="col-4" />
                <UiInput
                    v-model="form.contractTerm"
                    label="Срок контракта"
                    :disabled="!contractTermVisible"
                    class="col-3"
                    type="number"
                    unit="мес."
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiTextarea
                    v-model="form.description"
                    :min-height="50"
                    auto-height
                    :max-height="150"
                    label="Описание"
                    class="col-12"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" icon="fa-solid fa-check" color="success-light">
                Сохранить
            </UiButton>
            <UiButton @click="close" icon="fa-solid fa-ban" color="light">Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { useStore } from 'vuex';

import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import api from '@//api/api.js';
import { CompanyFormOrganization } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { validationRulesForCompanyDeal } from '@/validators/rules.js';
import Switch from '@/components/common/Forms/Switch.vue';
import LazyImage from '@/components/common/LazyImage.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { useFormData } from '@/utils/use/useFormData.js';
import { captureException } from '@sentry/vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';

const emit = defineEmits(['updated', 'created', 'close']);
const props = defineProps({
    formData: Object,
    request_id: Number,
    company_id: Number,
    object_id: Number,
    complex_id: Number,
    type_id: Number,
    original_id: Number,
    visual_id: Number,
    isOurDeal: Boolean,
    dealType: Number
});

const store = useStore();

const isLoading = ref(false);

const selectedCompany = ref(null);
const selectedCompetitorCompany = ref(null);
const selectedOffer = ref(null);
const requestOptions = ref([]);

const { form, isEditMode } = useFormData(
    reactive({
        request_id: null,
        company_id: null,
        consultant_id: null,
        name: null,
        area: null,
        floorPrice: null,
        clientLegalEntity: null,
        description: null,
        dealDate: new Date(),
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
        visual_id: null,
        complete_request: 1
    }),
    props.formData
);

const { v$, validate } = useValidation({ form: validationRulesForCompanyDeal }, { form });

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
    const updatedDeal = await api.deal.update(form.id, form);

    if (updatedDeal) {
        emit('updated', form);
        emit('close');
    }

    isLoading.value = false;
};

const create = async () => {
    const createdDeal = await api.deal.createForRequest(form.request_id, form);

    if (createdDeal) {
        emit('created', form);
        emit('close');
    }

    isLoading.value = false;
};

async function submit() {
    if (!form.clientLegalEntity) form.formOfOrganization = null;

    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        if (isEditMode.value) await update();
        else await create();
    } catch (e) {
        captureException(e);
    } finally {
        isLoading.value = false;
    }
}

const onChangeCompany = async () => {
    if (props.request_id) return;

    form.request_id = null;
    requestOptions.value = [];

    if (!form.company_id) return;

    const requestList = await api.request.search({
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

            requestList = await api.request.search({
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
                address: item.address
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
    form.request_id = props.request_id ?? props.formData?.request_id;
    form.company_id = props.company_id ?? props.formData?.company_id;
    form.consultant_id = props.consultant_id ?? props.formData?.consultant_id;
    form.object_id = props.object_id ?? props.formData?.object_id;
    form.original_id = props.original_id ?? props.formData?.original_id;
    form.complex_id = props.complex_id ?? props.formData?.complex_id;
    form.type_id = props.type_id ?? props.formData?.type_id;
    form.visual_id = props.visual_id ?? props.formData?.visual_id;

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
