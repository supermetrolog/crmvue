<template>
    <div class="company-deal-form">
        <Modal
            :title="formdata ? 'Редактирование сделки' : 'Создание сделки'"
            @close="$emit('close')"
            classes="autosize"
        >
            <Loader class="center" v-if="loader"/>
            <Form @submit="onSubmit" class="center">
                <FormGroup class="mb-3">
                    <CheckboxChip
                        :disabled="isOurDeal"
                        v-model="form.is_our"
                        :falseValue="0"
                        @change="
                          form.is_our ? (form.is_competitor = 0) : (form.is_competitor = 1)
                        "
                        :value="1"
                        text="Наша сделка"
                        class="mx-auto w-100 font-weight-bold"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <MultiSelect
                        :disabled="!!form.is_our"
                        :v="v$.form.competitor_company_id"
                        v-model="form.competitor_company_id"
                        extraClasses="long-text"
                        label="Компания конкурент"
                        :required="!form.is_our"
                        class="col-6 pr-1"
                        :filterResults="false"
                        :minChars="1"
                        :resolveOnLoad="true"
                        :delay="500"
                        :searchable="true"
                        :options="
              async (query) => {
                return await searchCompetitorCompany(query);
              }
            "
                    />
                    <MultiSelect
                        v-model="form.offerHandler"
                        :v="v$.form.object_id"
                        :disabled="!!object_id"
                        extraClasses="long-text"
                        label="Предложение"
                        required
                        class="col-6"
                        :filterResults="false"
                        :minChars="1"
                        :resolveOnLoad="true"
                        :delay="500"
                        :searchable="true"
                        :options="
              async (query) => {
                return await searchOffer(query);
              }
            "
                        @change="form = { ...form, ...form.offerHandler }"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <Input v-model="form.name" label="Название" class="col-6 pr-1"/>
                    <Input
                        v-model="form.area"
                        label="Площадь сделки"
                        class="col-6"
                        maska="##########"
                    />
                    <MultiSelect
                        v-model="form.company_id"
                        :disabled="!!company_id"
                        extraClasses="long-text"
                        label="Компания"
                        required
                        class="col-6 pr-1"
                        :v="v$.form.company_id"
                        :filterResults="false"
                        :minChars="1"
                        :resolveOnLoad="true"
                        :delay="500"
                        :searchable="true"
                        :options="
              async (query) => {
                return await searchCompany(query);
              }
            "
                        @change="onChangeCompany"
                    />
                    <MultiSelect
                        :disabled="!form.company_id || !!request_id"
                        v-model="form.request_id"
                        extraClasses="long-text"
                        :v="v$.form.request_id"
                        :required="!!request_id"
                        label="Запрос"
                        class="col-6"
                        :key="requestOptions.length"
                        :options="requestOptions"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <Input
                        v-model="form.clientLegalEntity"
                        label="Юр. лицо клиента в сделке"
                        class="col-6 pr-1"
                    />
                    <MultiSelect
                        v-model="form.formOfOrganization"
                        label="ФО"
                        title="Форма организации"
                        class="col-2 pr-1"
                        :options="formOfOrganizationOptions"
                    />
                    <Input
                        v-model="form.floorPrice"
                        label="Цена пола"
                        class="col-4"
                        maska="##########"
                    />
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
                    <Input
                        v-model="form.dealDate"
                        label="Дата сделки"
                        type="date"
                        class="col-6 pr-1"
                    >
                        <Input
                            v-model="form.contractTerm"
                            v-if="contractTermVisible"
                            label="Срок контракта в месяцах"
                            class="col-12 p-0 mt-1"
                            maska="####"
                        />
                    </Input>
                </FormGroup>
                <FormGroup class="mb-1"></FormGroup>
                <FormGroup class="mb-1">
          <Textarea
              v-model="form.description"
              label="Описание"
              class="col-12"
          />
                </FormGroup>

                <FormGroup class="mt-4">
                    <Submit class="col-4 mx-auto">
                        {{ formdata ? "Сохранить" : "Создать" }}
                    </Submit>
                </FormGroup>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import useValidate from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";
import Form from "@/components/common/Forms/Form.vue";
import FormGroup from "@/components/common/Forms/FormGroup.vue";
import Input from "@/components/common/Forms/Input.vue";
import Textarea from "@/components/common/Forms/Textarea.vue";
import MultiSelect from "@/components/common/Forms/MultiSelect.vue";
import Submit from "@/components/common/Forms/Submit.vue";
import api from "@//api/api.js";
import {CompanyFormOrganization} from "@/const/const.js";
import moment from "moment";
import Loader from "@/components/common/Loader.vue";
import Modal from "@/components/common/Modal.vue";
import CheckboxChip from "@/components/common/Forms/CheckboxChip.vue";

export default {
    name: "FormCompanyDeal",
    components: {
        CheckboxChip,
        Modal,
        Loader,
        Form,
        FormGroup,
        Input,
        Textarea,
        MultiSelect,
        Submit
    },
    data() {
        return {
            loader: false,
            v$: useValidate(),
            selectedCompany: null,
            selectedCompetitorCompany: null,
            selectedOffer: null,
            formOfOrganizationOptions: CompanyFormOrganization.get("param"),
            requestOptions: [],
            form: {
                request_id: null,
                company_id: null,
                consultant_id: null,
                name: null,
                area: null,
                floorPrice: null,
                clientLegalEntity: null,
                description: null,
                dealDate: moment(new Date()).format("YYYY-MM-DD"),
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
            },
        };
    },

    props: {
        formdata: {
            type: Object,
        },
        request_id: {
            type: Number,
        },
        company_id: {
            type: Number,
        },
        object_id: {
            type: Number,
        },
        complex_id: {
            type: Number,
        },
        type_id: {
            type: Number,
        },
        original_id: {
            type: Number,
        },
        visual_id: {
            type: String,
        },
        isOurDeal: {
            type: Boolean,
            default: false,
        },
        dealType: {
            type: Number,
            default: null,
        },
    },
    validations() {
        return {
            form: {
                consultant_id: {
                    required: helpers.withMessage("выберите консультанта", required),
                },
                company_id: {
                    required: helpers.withMessage("заполните поле", required),
                },
                competitor_company_id: {
                    customRequired: helpers.withMessage("заполните поле", () => {
                        if (!this.form.is_our && !this.form.competitor_company_id) {
                            return false;
                        }
                        return true;
                    }),
                },
                object_id: {
                    required: helpers.withMessage("выберите предложение", () => {
                        if (
                            this.form.object_id &&
                            this.form.original_id &&
                            this.form.type_id &&
                            this.form.visual_id &&
                            this.form.complex_id
                        ) {
                            return true;
                        }
                        return false;
                    }),
                },
                type_id: {
                    required: helpers.withMessage("выберите предложение", required),
                },
                original_id: {
                    required: helpers.withMessage("выберите предложение", required),
                },
                visual_id: {
                    required: helpers.withMessage("выберите предложение", required),
                },
                complex_id: {
                    required: helpers.withMessage("выберите предложение", required),
                },
                request_id: {
                    customRequired: helpers.withMessage("выберите предложение", () => {
                        if (this.request_id && !this.form.request_id) {
                            return false;
                        }
                        return true;
                    }),
                },
            },
        };
    },
    computed: {
        ...mapGetters(["CONSULTANT_LIST", "THIS_USER"]),
        contractTermVisible() {
            if (!this.requestOptions.length || !this.form.request_id) return false;
            const currentRequestOption = this.requestOptions.find(
                (item) => item.value == this.form.request_id
            );
            if (
                (currentRequestOption &&
                    currentRequestOption.label.indexOf("аренда") !== -1) ||
                currentRequestOption.label.indexOf("ответ-хранение") !== -1
            ) {
                return true;
            }
            return false;
        },
    },
    methods: {
        ...mapActions([
            "FETCH_CONSULTANT_LIST",
            "CREATE_DEAL",
            "UPDATE_DEAL",
            "SEARCH_COMPANIES",
            "SEARCH_REQUESTS",
            "CREATE_DEAL",
            "UPDATE_DEAL",
            "SEARCH_OBJECTS",
        ]),
        onSubmit() {
            this.v$.$validate();
            !this.form.clientLegalEntity ? (this.form.formOfOrganization = null) : "";
            if (!this.v$.form.$error) {
                this.loader = true;
                if (this.formdata) {
                    this.update();
                } else {
                    this.create();
                }
            }
        },
        async update() {
            if (await this.UPDATE_DEAL(this.form)) {
                this.$emit("updated", this.form);
                this.clickCloseModal();
            }
            this.loader = false;
        },
        async create() {
            if (await this.CREATE_DEAL(this.form)) {
                this.$emit("created", this.form);
                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCloseModal() {
            this.$emit("close");
        },
        async onChangeCompany() {
            if (this.request_id) return;
            this.form.request_id = null;
            this.requestOptions = [];
            if (!this.form.company_id) return;
            let requestList = null;
            requestList = await api.request.searchRequests({
                company_id: this.form.company_id,
                status: [1, 0],
            });
            requestList.data.forEach((item) => {
                this.requestOptions.push({
                    value: item.id,
                    label: item.format_name + "^2",
                });
            });
        },
        async searchCompany(query) {
            let result = null;
            let array = [];
            let requestList = null;
            this.requestOptions = [];
            if (this.formdata || this.company_id) {
                if (!this.selectedCompany) {
                    this.selectedCompany = await api.companies.getCompany(
                        this.formdata ? this.formdata.company_id : this.company_id
                    );
                    requestList = await api.request.searchRequests({
                        company_id: this.formdata
                            ? this.formdata.company_id
                            : this.company_id,
                    });
                }
                if (requestList && Array.isArray(requestList.data)) {
                    requestList.data.forEach((item) => {
                        this.requestOptions.push({
                            value: item.id,
                            label: item.format_name + "^2",
                        });
                    });
                }

                array.push({
                    value: this.selectedCompany.id,
                    label: this.selectedCompany.full_name,
                });
            }
            query = {
                all: query,
            };
            result = await api.companies.searchCompanies(query);
            result.data.forEach((item) => {
                array.push({value: item.id, label: item.full_name});
            });
            return array;
        },
        async searchCompetitorCompany(query) {
            let result = null;
            let array = [];
            if (this.formdata || this.competitor_company_id) {
                if (!this.selectedCompetitorCompany) {
                    this.selectedCompetitorCompany = await api.companies.getCompany(
                        this.formdata ? this.formdata.company_id : this.company_id
                    );
                }

                array.push({
                    value: this.selectedCompetitorCompany.id,
                    label: this.selectedCompetitorCompany.full_name,
                });
            }
            query = {
                all: query,
            };
            result = await api.companies.searchCompanies(query);
            result.data.forEach((item) => {
                array.push({value: item.id, label: item.full_name});
            });
            return array;
        },
        async searchOffer(query) {
            let result = null;
            let array = [];
            if (this.formdata || this.object_id) {
                if (!this.selectedOffer) {
                    const params = {
                        original_id: this.formdata
                            ? this.formdata.offer.original_id
                            : this.original_id,
                        object_id: this.formdata
                            ? this.formdata.offer.object_id
                            : this.object_id,
                        type_id: this.formdata ? this.formdata.offer.type_id : this.type_id,
                        "per-page": 1,
                    };
                    let data = await api.companyObjects.searchOffers(params);
                    data = data.data;
                    if (data.length) {
                        this.selectedOffer = data[0];
                    }
                }

                array.push({
                    value: {
                        original_id: this.selectedOffer.original_id,
                        object_id: this.selectedOffer.object_id,
                        type_id: this.selectedOffer.type_id,
                        visual_id: this.selectedOffer.visual_id,
                        complex_id: this.selectedOffer.complex_id,
                    },
                    label: this.selectedOffer.visual_id,
                });
            }
            query = {
                all: query,
                type_id: [1, 2, 3],
                "per-page": 10,
            };
            result = await api.companyObjects.searchOffers(query);
            result.data.forEach((item) => {
                array.push({
                    value: {
                        original_id: item.original_id,
                        object_id: item.object_id,
                        type_id: item.type_id,
                        visual_id: item.visual_id,
                        complex_id: item.complex_id,
                    },
                    label: item.visual_id,
                });
            });
            return array;
        },
    },
    async mounted() {
        this.loader = true;
        await this.FETCH_CONSULTANT_LIST();
        this.form.request_id = this.request_id;
        this.form.company_id = this.company_id;
        this.form.consultant_id = this.THIS_USER.id;
        this.form.object_id = this.object_id;
        this.form.original_id = this.original_id;
        this.form.complex_id = this.complex_id;
        this.form.type_id = this.type_id;
        this.form.visual_id = this.visual_id;
        if (this.formdata) {
            this.form = {...this.form, ...this.formdata};
        }

        this.form.offerHandler = {
            object_id: this.form.object_id,
            original_id: this.form.original_id,
            complex_id: this.form.complex_id,
            type_id: this.form.type_id,
            visual_id: this.form.visual_id,
        };
        this.loader = false;
    },
    watch: {
        form: {
            handler() {
            },
            deep: true,
        },
    },
};
</script>

<style>
</style>