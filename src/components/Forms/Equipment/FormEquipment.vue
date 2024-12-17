<template>
    <Modal @close="$emit('close')" show width="1000" has-tabs>
        <template #header>
            <Switch
                v-model="form.benefit"
                false-title="Обычное предложение"
                true-title="Выгодное предложение"
                :transform="Number"
                :disabled="isLoading"
            />
        </template>
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <Tabs :options="{ useUrlFragment: false }" always-render>
                <Tab name="Основное">
                    <FormGroup>
                        <Input
                            v-model="form.name"
                            :v="v$.form.name"
                            class="col-sm-6 col-12"
                            label="Название"
                        />
                        <MultiSelect
                            v-model="form.category"
                            :v="v$.form.category"
                            label="Тип оборудования"
                            class="col-sm-6 col-12"
                            required
                            :transform="Number"
                            :options="equipmentOptions.category"
                        />
                        <MultiSelect
                            v-model="form.address"
                            :title="form.address"
                            :v="v$.form.address"
                            required
                            label="Адрес"
                            class="col-sm-6 col-12"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="Boolean(formData)"
                            :delay="600"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                        <MultiSelect
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            required
                            label="Консультант"
                            class="col-sm-6 col-12"
                            :options="consultantList"
                        />
                    </FormGroup>
                    <FormGroup>
                        <MultiSelect
                            v-model="form.company_id"
                            @change="onChangeCompany"
                            extra-classes="long-text"
                            label="Компания"
                            required
                            class="col-sm-6 col-12"
                            :v="v$.form.company_id"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="true"
                            :delay="300"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await searchCompany(query);
                                }
                            "
                        />
                        <MultiSelect
                            v-model="form.contact_id"
                            extra-classes="long-text"
                            label="Контакт"
                            :resolve-on-load="true"
                            required
                            class="col-sm-6 col-12"
                            :disabled="!form.company_id"
                            :v="v$.form.contact_id"
                            :options="contacts"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.state"
                            :v="v$.form.state"
                            required
                            class="col-12"
                            label="Состояние"
                            unselect
                            :options="equipmentOptions.usedStatus"
                        />
                    </FormGroup>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.status"
                            label="Статус"
                            class="col-sm-6 col-12"
                            :options="equipmentOptions.status"
                        />
                        <MultiSelect
                            v-model="form.passive_type"
                            :v="v$.form.passive_type"
                            label="Причина пассива"
                            class="col-sm-6 col-12"
                            required
                            :disabled="form.status !== equipmentOptions.statusStatement.PASSIVE"
                            :options="equipmentOptions.passiveType"
                        />
                        <Textarea
                            v-model="form.passive_comment"
                            label="Ручная причина пассива"
                            :disabled="form.status !== equipmentOptions.statusStatement.PASSIVE"
                            required
                            class="col-12"
                        />
                    </FormGroup>
                    <p class="form__block">Цена и наличие</p>
                    <FormGroup class="align-items-end">
                        <Input
                            v-model="form.count"
                            :v="v$.form.count"
                            class="col-md-4 col-sm-6 col-12"
                            type="number"
                            unit="шт"
                            label="Количество"
                        />
                        <RadioOptions
                            v-model="form.availability"
                            label="Наличие"
                            class="col-md-8 col-sm-6 col-12"
                            :options="equipmentOptions.availability"
                            unselect
                        />
                    </FormGroup>
                    <FormGroup class="align-items-end">
                        <Input
                            v-model="form.price"
                            :v="v$.form.price"
                            class="col-md-4 col-sm-6 col-12"
                            type="number"
                            unit="₽"
                            label="Цена"
                        />
                        <RadioOptions
                            v-model="form.tax"
                            label="Система налогообложения"
                            class="col-md-8 col-sm-6 col-12"
                            :options="equipmentOptions.tax"
                            unselect
                        />
                    </FormGroup>
                    <p class="form__block">Доставка</p>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.delivery"
                            label="Способы получения"
                            class="col-md-8 col-12"
                            :options="equipmentOptions.delivery"
                            unselect
                        />
                        <Input
                            v-model="form.deliveryPrice"
                            :v="v$.form.deliveryPrice"
                            :disabled="!hasDelivery"
                            class="col-md-4 col-12"
                            label="Стоимость доставки"
                            type="number"
                            unit="₽"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Описание">
                    <FormGroup>
                        <VueEditor
                            v-model="form.description"
                            label="Описание оборудования"
                            class="col-12"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <FileInput
                            v-if="false"
                            v-model:native="form.photos"
                            label="Фотографии"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                        <InProgress class="mx-auto" />
                    </div>
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-if="false"
                            v-model:native="form.fileList"
                            v-model:data="form.files"
                            label="Документы"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                        <InProgress class="mx-auto" />
                    </div>
                </Tab>
                <div class="row mt-4 align-self-end">
                    <Submit success class="col-3 mx-auto">
                        {{ formData ? 'Сохранить' : 'Создать' }}
                    </Submit>
                </div>
            </Tabs>
        </Form>
    </Modal>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import useVuelidate from '@vuelidate/core';
import { useStore } from 'vuex';
import api from '@//api/api.js';
import Modal from '@/components/common/Modal.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { validationRulesForEquipment } from '@/validators/rules/equipment.js';
import { computed, reactive, shallowRef, toRef } from 'vue';
import { useSearchAddress } from '@/composables/useSearchAddress.js';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import { useSearchContacts } from '@/composables/useSearchContacts.js';
import Switch from '@/components/common/Forms/Switch.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { useNotification } from '@kyvg/vue3-notification';
import Loader from '@/components/common/Loader.vue';
import { equipmentOptions } from '@/const/options/equipment.options.js';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import InProgress from '@/components/common/InProgress.vue';

const store = useStore();

const emit = defineEmits(['close', 'created', 'updated']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    }
});

const { form } = useFormData(
    reactive({
        availability: null,
        delivery: null,
        address: null,
        name: null,
        state: null,
        description: null,
        contact_id: null,
        company_id: null,
        category: null,
        consultant_id: null,
        deliveryPrice: null,
        benefit: 0,
        tax: null,
        price: null,
        count: null,
        files: [],
        fileList: [],
        photos: [],
        status: 1,
        passive_type: null,
        passive_comment: null
    }),
    props.formData
);

const isLoading = shallowRef(false);

const v$ = useVuelidate({ form: validationRulesForEquipment }, { form });

const consultantList = computed(() => store.getters.CONSULTANT_LIST);
const hasDelivery = computed(() => Number(form.delivery) === 1);

const getAddress = useSearchAddress(toRef(() => props.formData?.address));
const searchCompany = useSearchCompany(toRef(() => props.formData?.company_id));
const { searchContacts, contacts } = useSearchContacts(toRef(() => props.form?.company_id));
const { notify } = useNotification();

const onSubmit = () => {
    v$.value.$validate();

    if (!v$.value.form.$error) {
        if (props.formData) updateEquipment();
        else createEquipment();
    }
};
const updateEquipment = async () => {
    isLoading.value = true;
    const equipment = await api.equipment.update(props.formData.id, form);
    isLoading.value = false;

    if (equipment) {
        emit('updated', equipment);
        emit('close');
        notify('Оборудование успешно обновлено');
    }
};
const createEquipment = async () => {
    const equipment = await api.equipment.create(form);

    if (equipment) {
        emit('created');
        emit('close');
        notify('Оборудование успешно добавлено');
    }
};
const onChangeCompany = () => {
    if (contacts.value.length || !props.formData?.contact_id) form.contact_id = null;
    searchContacts(form.company_id);
};

const initialize = async () => {
    const promises = [];

    isLoading.value = true;

    if (props.formData) {
        promises.push(searchContacts(form.company_id));
    }
    if (!consultantList.value.length) promises.push(store.dispatch('FETCH_CONSULTANT_LIST'));

    await Promise.all(promises);

    isLoading.value = false;
};

initialize();
</script>
