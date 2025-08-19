<template>
    <Modal @close="$emit('close')" show title="Фильтры" width="1400">
        <UiForm>
            <FormGroup class="mb-4">
                <MultiSelect
                    v-model="form.category"
                    label="Тип оборудования"
                    class="col-12 col-md-6"
                    mode="multiple"
                    :close-on-select="false"
                    multiple
                    :options="categoryOptions"
                />
                <MultiSelect
                    v-model="form.consultant_id"
                    placeholder="Выберите консультанта.."
                    label="Консультант"
                    class="col-12 col-md-6"
                    mode="multiple"
                    multiple
                    :close-on-select="false"
                    :options="consultantListOptions"
                />
            </FormGroup>
            <FormGroup class="mb-4">
                <DoubleInput
                    v-model:first="form.minCount"
                    v-model:second="form.maxCount"
                    label="Количество"
                    class="col-md-3 col-12"
                    type="number"
                    unit="шт"
                    reactive
                    :validators="formCountValidators"
                />
                <RadioOptions
                    v-model="form.availability"
                    label="Наличие"
                    class="col-md-3 col-6"
                    :options="availabilityOptions"
                    unselect
                />
                <DoubleInput
                    v-model:first="form.minPrice"
                    v-model:second="form.maxPrice"
                    label="Цена"
                    class="col-md-3 col-12"
                    type="number"
                    unit="₽"
                    reactive
                    :validators="formPriceValidators"
                />
                <RadioOptions
                    v-model="form.tax"
                    label="Система налогообложения"
                    class="col-md-3 col-12"
                    :options="taxOptions"
                    unselect
                />
            </FormGroup>
            <FormGroup class="mb-4 align-items-end">
                <RadioOptions
                    v-model="form.state"
                    class="col-md-4 col-12"
                    label="Состояние"
                    :options="usedOptions"
                    unselect
                />
                <RadioOptions
                    v-model="form.status"
                    label="Статус"
                    class="col-md-2 col-12"
                    :options="statusOptions"
                    unselect
                />
                <CheckboxOptions
                    v-model="form.delivery"
                    label="Способы получения"
                    class="col-md-6 col-12"
                    :options="deliveryOptions"
                />
            </FormGroup>
            <FormGroup>
                <Switch
                    v-model="form.benefit"
                    :transform="Number"
                    only-true
                    class="col-12"
                    true-title="Выгодное предложение"
                    false-title="Любое предложение"
                />
            </FormGroup>
            <FormGroup>
                <MultiSelect
                    v-model="form.company_id"
                    @change="onChangeCompany"
                    placeholder="Введите название компании или ID.."
                    extra-classes="long-text"
                    label="Компания"
                    class="col-md-6 col-12"
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
                    placeholder="Выберите контакт из списка.."
                    extra-classes="long-text"
                    label="Контакт"
                    class="col-md-6 col-12"
                    :disabled="!form.company_id"
                    :options="contactOptions"
                />
            </FormGroup>
        </UiForm>
    </Modal>
</template>

<script>
import UiForm from '@/components/common/Forms/UiForm.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Modal from '@/components/common/Modal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { optionsToList } from '@/utils/helpers/forms/optionsToList.js';
import { multiselectAdapter, multiselectAdapterToObject } from '@/utils/adapters.js';
import { entityOptions } from '@/const/options/options.js';
import { pricePerFloorValidators } from '@/validators/fields.js';
import { mapGetters } from 'vuex';
import api from '@/api/api.js';
import { max, min } from '@/validators/index.js';
import { WithQueryFiltersMixin } from '@/components/Forms/mixins.js';
import Switch from '@/components/common/Forms/Switch.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';

export default {
    name: 'FormEquipmentFilters',
    components: {
        UiForm,
        CheckboxOptions,
        RadioOptions,
        Switch,
        FormGroup: UiFormGroup,
        Modal,
        MultiSelect,
        DoubleInput
    },
    mixins: [WithQueryFiltersMixin],
    emits: ['changed', 'close'],
    data() {
        return {
            form: {
                minPrice: null,
                maxPrice: null,
                deliveryIncPrice: null,
                delivery: [],
                benefit: null,
                tax: null,
                availability: null,
                minCount: null,
                maxCount: null,
                company_id: null,
                contact_id: null,
                consultant_id: null,
                state: null,
                category: null
            },
            contactOptions: {}
        };
    },
    computed: {
        taxOptions: () => optionsToList(entityOptions.equipment.tax),
        availabilityOptions: () => optionsToList(entityOptions.equipment.availability),
        deliveryOptions: () => optionsToList(entityOptions.equipment.delivery),
        usedOptions: () => optionsToList(entityOptions.equipment.usedStatus),
        categoryOptions: () => entityOptions.equipment.category,
        statusOptions: () => entityOptions.equipment.status,
        formPriceValidators() {
            return pricePerFloorValidators(this.form.maxPrice);
        },
        formCountValidators() {
            return [
                {
                    func: max(this.form.maxCount),
                    message: 'Минимальное количество превышает максимальное',
                    property: 'first'
                },
                {
                    func: min(0),
                    message: 'Некорректное отрицательное количество'
                }
            ];
        },
        ...mapGetters({ consultantList: 'CONSULTANT_LIST' }),
        deliveryIncPrice() {
            return this.form.delivery.includes(1);
        },
        consultantListOptions() {
            return multiselectAdapterToObject(this.consultantList, 'value', 'label');
        }
    },
    methods: {
        onChangeCompany() {
            this.form.contact_id = [];
            this.searchContacts(this.form.company_id);
        },
        async searchCompany(query) {
            if (this.form.company_id && query === null) {
                query = {
                    id: this.form.company_id
                };

                this.searchContacts(query.id);
            } else {
                query = { all: query };
            }

            const companies = await api.companies.searchCompanies(query);
            return multiselectAdapter(companies.data, 'id', 'full_name');
        },
        async searchContacts(query) {
            if (query == null) {
                query = {
                    id: this.form.company_id
                };
            } else {
                query = { company_id: query };
            }

            const contacts = await api.contacts.search(query);
            this.contactOptions = multiselectAdapterToObject(contacts.data, 'id', contact =>
                contact.type === 1 ? 'Основной контакт' : contact.first_and_last_name
            );
        }
    },
    created() {
        if (!this.consultantList?.length) this.$store.dispatch('FETCH_CONSULTANT_LIST');
    }
};
</script>
