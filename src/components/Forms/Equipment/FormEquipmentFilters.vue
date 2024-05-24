<template>
    <Modal @close="$emit('close')" title="Фильтры" width="1400">
        <Form>
            <FormGroup class="mb-4">
                <MultiSelect
                    v-model="form.category"
                    label="Тип оборудования"
                    class="col-6"
                    mode="multiple"
                    :close-on-select="false"
                    multiple
                    :options="categoryOptions"
                />
                <MultiSelect
                    v-model="form.consultant_id"
                    label="Консультант"
                    class="col-6"
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
                    class="col-md-3 col-6"
                    type="number"
                    unit="₽"
                    reactive
                    :validators="formCountValidators"
                />
                <CheckboxOptions
                    v-model="form.availability"
                    label="Наличие"
                    class="col-3"
                    :options="availabilityOptions"
                />
                <DoubleInput
                    v-model:first="form.minPrice"
                    v-model:second="form.maxPrice"
                    label="Цена"
                    class="col-md-3 col-6"
                    type="number"
                    unit="₽"
                    reactive
                    :validators="formPriceValidators"
                />
                <CheckboxOptions
                    v-model="form.tax"
                    label="Система налогообложения"
                    class="col-3"
                    :options="taxOptions"
                />
            </FormGroup>
            <FormGroup class="mb-4 align-items-end">
                <CheckboxOptions
                    v-model="form.state"
                    class="col-2"
                    label="Состояние"
                    :options="usedOptions"
                />
                <CheckboxChip
                    v-model="form.benefit"
                    class="align-self-end col-4"
                    text="Выгодное предложение"
                    icon="fa-solid fa-sack-dollar"
                />
                <CheckboxOptions
                    v-model="form.delivery"
                    label="Способы получения"
                    class="col-6"
                    :options="deliveryOptions"
                />
            </FormGroup>
            <FormGroup>
                <MultiSelect
                    v-model="form.company_id"
                    @change="onChangeCompany"
                    extra-classes="long-text"
                    label="Компания"
                    class="col-6"
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
                    class="col-6"
                    :disabled="!form.company_id"
                    :options="contactOptions"
                />
            </FormGroup>
        </Form>
    </Modal>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Modal from '@/components/common/Modal.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { multiselectAdapter, multiselectAdapterToObject, optionsToList } from '@/utils/index.js';
import { entityOptions } from '@/const/options/options.js';
import { pricePerFloorValidators } from '@/validators/fields.js';
import { mapGetters } from 'vuex';
import api from '@/api/api.js';
import { max, min } from '@/validators/index.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { WithQueryFiltersMixin } from '@/components/Forms/mixins.js';

export default {
    name: 'FormEquipmentFilters',
    components: {
        CheckboxOptions,
        FormGroup,
        CheckboxChip,
        Modal,
        MultiSelect,
        DoubleInput,
        Form
    },
    mixins: [WithQueryFiltersMixin],
    emits: ['changed'],
    data() {
        return {
            form: {
                minPrice: null,
                maxPrice: null,
                deliveryIncPrice: null,
                delivery: [],
                benefit: null,
                tax: [],
                availability: [],
                minCount: null,
                maxCount: null,
                company_id: null,
                contact_id: null,
                consultant_id: [],
                state: [],
                category: []
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

            const contacts = await api.contacts.searchContacts(query);
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
