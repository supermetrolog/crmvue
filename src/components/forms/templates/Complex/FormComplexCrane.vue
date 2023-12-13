<template>
    <div class="add-crane-form">
        <Modal
            title="Создание крана"
            @close="$emit('close')"
            classes="autosize"
        >
            <Loader class="center" v-if="loader"/>
            <Form @submit="onSubmit" class="center autosize">
                <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }" nav-class="add-crane-form__tab-list"
                      nav-item-link-class="add-crane-form__tab-link">
                    <Tab name="Характеpистики" id="craneCharacteristics">
                        <FormGroup class="mb-1">
                            <MultiSelect
                                v-model="form.crane_type"
                                title="Классификация крана"
                                label="Классификация крана"
                                class="col-4 pr-1"
                                :options="craneTypeOptions"
                            />
                            <MultiSelect
                                v-model="form.crane_location"
                                :v="v$.form.crane_location"
                                title="Расположение"
                                label="Расположение"
                                class="col-4 px-1"
                                :options="craneLocationOptions"
                                required
                            />
                            <Input
                                v-if="form"
                                v-model="form.crane_capacity"
                                :v="v$.form.crane_capacity"
                                label="Грузоподъемность"
                                class="col-3 px-1"
                                type="number"
                                required
                            />
                            <p class="add-crane-form__text">т</p>
                            <MultiSelect
                                v-model="form.crane_beam"
                                title="Тип балки"
                                label="Тип балки"
                                class="col-4 pr-1"
                                :options="craneBeamOptions"
                            />
                            <MultiSelect
                                v-model="form.crane_beams_amount"
                                title="Кол-во балок/мостов"
                                label="Кол-во балок/мостов"
                                class="col-4 px-1"
                                :options="craneBeamsAmountOptions"
                            />
                            <Input
                                v-if="form"
                                v-model="form.crane_span"
                                :v="v$.form.crane_span"
                                class="col-3 px-1"
                                label="Длина пролета"
                                type="number"
                                required
                            />
                            <p class="add-crane-form__text">м</p>
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <MultiSelect
                                v-model="form.crane_hoisting"
                                title="Тип подъемн. механизма"
                                label="Тип подъемн. механизма"
                                class="col-4 pr-1"
                                :options="craneHoistingOptions"
                            />
                            <MultiSelect
                                v-model="form.crane_controls"
                                title="Тип управления"
                                label="Тип управления"
                                :closeOnSelect=false
                                class="col-4 px-1"
                                mode="multiple"
                                :options="craneControlsOptions"
                            />
                            <Input
                                v-if="form"
                                v-model="form.crane_hook_height"
                                :v="v$.form.crane_hook_height"
                                class="col-3 px-1"
                                label="Высота до крюка"
                                type="number"
                            />
                            <p class="add-crane-form__text">м</p>
                        </FormGroup>
                        <FormGroup class="mb-1">
                            <Radio
                                v-model="form.crane_supervision"
                                label="Под надзором"
                                class="col-2 pr-1"
                                :options="[[0, 'нет'], [1, 'да']]"
                            />
                            <Radio
                                v-model="form.crane_documents"
                                label="Есть документы"
                                class="col-2 px-1"
                                :options="[[0, 'нет'], [1, 'да']]"
                            />
                            <MultiSelect
                                v-model="form.crane_condition"
                                title="Состояние"
                                label="Состояние"
                                class="col-4 px-1"
                                :options="craneConditionOptions"
                            />
                        </FormGroup>
                        <FormGroup class="mb-1">
							<Textarea
                                v-model="form.description"
                                label="Описание"
                                class="col-12 px-0"
                            />
                        </FormGroup>
                    </Tab>
                    <Tab name="Фотографии" id="cranePhoto">
                        <FormGroup class="mb-1">
                            <FileInput
                                v-model:native="form.photosList"
                                v-model:data="form.photos"
                                label="Фотографии"
                                class="col-12"
                            >
                                Выбрать файлы
                            </FileInput>
                        </FormGroup>
                    </Tab>
                </Tabs>
                <FormGroup class="mt-1 mb-4">
                    <Submit class="col-4 mx-auto">
                        Сохранить
                    </Submit>
                </FormGroup>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {helpers, minValue, required} from "@vuelidate/validators";
import {ComplexFormMixin} from "@/components/forms/templates/Complex/mixin";
import Loader from "@/components/common/Loader.vue";
import Modal from "@/components/common/Modal.vue";
import {
    craneBeamsAmountTypes,
    craneBeamTypes,
    craneHoistingTypes,
    craneTypes, liftingDeviceConditionTypes, liftingDeviceControlsTypes,
    liftingDeviceLocationTypes
} from "@/const/liftingDevices";

export default {
    name: "FormComplexCrane",
    components: {Modal, Loader},
    mixins: [ComplexFormMixin],
    data() {
        return {
            form: {
                crane_capacity: null,
                crane_type: null,
                crane_location: null,
                crane_beam: null,
                crane_span: null,
                crane_beams_amount: null,
                crane_hoisting: null,
                crane_controls: [],
                crane_hook_height: null,
                crane_supervision: null,
                crane_documents: null,
                crane_condition: null,
                photosList: [],
                photos: [],
            },
        }
    },
    validations() {
        return {
            form: {
                crane_location: {
                    required: helpers.withMessage(
                        "выберите один из вариантов",
                        required
                    ),
                },
                crane_capacity: {
                    required: helpers.withMessage(
                        "заполните поле",
                        required
                    ),
                    minValue: helpers.withMessage(
                        "значение должно быть больше 0",
                        minValue(1)
                    )
                },
                crane_span: {
                    required: helpers.withMessage(
                        "заполните поле",
                        required
                    ),
                    minValue: helpers.withMessage(
                        "значение должно быть больше 0",
                        minValue(1)
                    )
                },
                crane_hook_height: {
                    minValue: helpers.withMessage(
                        "значение должно быть больше 0",
                        minValue(1)
                    )
                },
            }
        }
    },
    methods: {},
    computed: {
        craneTypeOptions() {
            return Object.values(craneTypes);
        },
        craneLocationOptions() {
            return Object.values(liftingDeviceLocationTypes);
        },
        craneBeamOptions() {
            return Object.values(craneBeamTypes);
        },
        craneBeamsAmountOptions() {
            return Object.values(craneBeamsAmountTypes);
        },
        craneHoistingOptions() {
            return Object.values(craneHoistingTypes);
        },
        craneControlsOptions() {
            return Object.values(liftingDeviceControlsTypes);
        },
        craneConditionOptions() {
            return Object.values(liftingDeviceConditionTypes);
        }
    }
}
</script>