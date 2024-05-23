<template>
    <Modal
        @close="$emit('close')"
        :title="formData ? 'Редактирование оборудования' : 'Создание оборудования для продажи'"
        width="1000"
        has-tabs
    >
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false }">
                <Tab name="Основное">
                    <FormGroup>
                        <Input
                            v-model.trim="form.name"
                            class="col-4"
                            :v="v$.form.name"
                            label="Название"
                        />
                        <MultiSelect
                            v-model="form.category"
                            required
                            :v="v$.form.category"
                            label="Тип оборудования"
                            class="col-4"
                            :options="categoryOptions"
                        />
                        <RadioOptions
                            v-model="form.state"
                            class="col-3"
                            label="Состояние"
                            unselect
                            :options="usedOptions"
                        />
                        <MultiSelect
                            v-model="form.address"
                            :title="form.address"
                            :v="v$.form.address"
                            required
                            label="Адрес"
                            class="col-6"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="Boolean(formData)"
                            :delay="0"
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
                            class="col-6"
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
                            class="col-6"
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
                            required
                            class="col-6"
                            :disabled="!form.company_id"
                            :v="v$.form.contact_id"
                            :options="contactOptions"
                        />
                    </FormGroup>
                    <p class="form__block">Цена и наличие</p>
                    <FormGroup class="align-items-end">
                        <Input
                            v-model="form.count"
                            :v="v$.form.count"
                            class="col-4"
                            type="number"
                            unit="шт"
                            label="Количество"
                        />
                        <RadioOptions
                            v-model="form.availability"
                            label="Наличие"
                            class="col-4"
                            :options="availabilityOptions"
                            unselect
                        />
                    </FormGroup>
                    <FormGroup class="align-items-end">
                        <Input
                            v-model="form.price"
                            :v="v$.form.price"
                            class="col-4"
                            type="number"
                            unit="₽"
                            label="Цена"
                        />
                        <RadioOptions
                            v-model="form.tax"
                            label="Система налогообложения"
                            class="col-3"
                            :options="taxOptions"
                            unselect
                        />
                        <CheckboxChip
                            v-model="form.benefit"
                            class="col-4"
                            text="Выгодное предложение"
                            icon="fa-solid fa-sack-dollar"
                        />
                    </FormGroup>
                    <p class="form__block">Доставка</p>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.delivery"
                            label="Способы получения"
                            class="col-8"
                            :options="deliveryOptions"
                            unselect
                        />
                        <Input
                            v-model="form.deliveryPrice"
                            :v="v$.form.deliveryPrice"
                            :disabled="!hasDelivery"
                            class="col-4"
                            label="Стоимость доставки"
                            type="number"
                            unit="₽"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Описание">
                    <FormGroup>
                        <Textarea
                            v-model="form.description"
                            label="Описание оборудования"
                            class="col-12"
                        ></Textarea>
                    </FormGroup>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <FileInput
                            v-model:native="form.photoList"
                            v-model:data="form.photos"
                            label="Фотографии"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-model:native="form.fileList"
                            v-model:data="form.files"
                            label="Документы"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
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

<script>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import useValidate from '@vuelidate/core';
import { helpers, maxLength, minLength, minValue, required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import { multiselectAdapter, optionsToList, yandexmap } from '@/utils';
import api from '@//api/api.js';
import Modal from '@/components/common/Modal.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Submit from '@/components/common/Forms/Submit.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { entityOptions } from '@/const/options/options.js';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';

export default {
    name: 'FormEquipment',
    components: {
        RadioOptions,
        FormGroup,
        Submit,
        CheckboxChip,
        Modal,
        Form,
        Input,
        Textarea,
        MultiSelect,
        FileInput
    },
    emits: ['close', 'created', 'updated'],
    props: {
        formData: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            v$: useValidate(),
            form: {
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
                benefit: null,
                tax: null,
                price: null,
                count: null,
                files: [],
                fileList: [],
                photos: [],
                photoList: []
            },
            contactOptions: []
        };
    },
    computed: {
        ...mapGetters({ consultantList: 'CONSULTANT_LIST' }),
        taxOptions: () => optionsToList(entityOptions.equipment.tax),
        availabilityOptions: () => optionsToList(entityOptions.equipment.availability),
        deliveryOptions: () => optionsToList(entityOptions.equipment.delivery),
        usedOptions: () => optionsToList(entityOptions.equipment.usedStatus),
        categoryOptions: () => optionsToList(entityOptions.equipment.category),
        hasDelivery() {
            return Number(this.form.delivery) === 1;
        }
    },
    validations() {
        return {
            form: {
                name: {
                    minLength: helpers.withMessage(
                        'Название не может быть меньше 3 символов',
                        minLength(3)
                    ),
                    maxLength: helpers.withMessage(
                        'Название не может быть больше 60 символов',
                        maxLength(60)
                    )
                },
                address: {
                    required: helpers.withMessage('Заполните адрес', required)
                },
                category: {
                    required: helpers.withMessage('Выберите категорию', required)
                },
                consultant_id: {
                    required: helpers.withMessage('Выберите консультанта', required)
                },
                company_id: {
                    required: helpers.withMessage('Укажите компанию', required)
                },
                contact_id: {
                    required: helpers.withMessage('Укажите контакта', required)
                },
                deliveryPrice: {
                    min: helpers.withMessage('Укажите корректную цену', minValue(0))
                },
                price: {
                    min: helpers.withMessage('Укажите корректную цену', minValue(0))
                },
                count: {
                    min: helpers.withMessage('Укажите корректно количество', minValue(0))
                }
            }
        };
    },
    methods: {
        onSubmit() {
            this.v$.$validate();

            if (!this.v$.form.$error) {
                if (this.formData) this.updateEquipment();
                else this.createEquipment();
            }
        },
        async updateEquipment() {
            // const equipment = await api.equipment.update(this.form);
            const equipment = true;

            if (equipment) {
                this.$emit('updated', equipment);
                this.$emit('close');
            }
        },
        async createEquipment() {
            const equipment = await api.equipment.create(this.form);

            if (equipment) {
                this.$emit('created', equipment);
                this.$emit('close');
            }
        },
        async getAddress(query) {
            if (this.formData) return await yandexmap.getAddress(query, this.formData.address);
            return await yandexmap.getAddress(query);
        },
        onChangeCompany() {
            this.form.contact_id = null;
            this.searchContacts(this.form.company_id);
        },
        async searchCompany(query) {
            if (this.formData?.company_id && query === null) {
                query = {
                    id: this.formData.company_id
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
            this.contactOptions = multiselectAdapter(contacts.data, 'id', contact =>
                contact.type === 1 ? 'Основной контакт' : contact.first_and_last_name
            );
        }
    },
    created() {
        if (this.formData) Object.assign(this.form, this.formData);
        if (!this.consultantList?.length) this.$store.dispatch('FETCH_CONSULTANT_LIST');
    }
};
</script>

<style></style>
