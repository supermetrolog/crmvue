<template>
    <Modal @close="$emit('close')" :title="crane ? 'Редактирование крана' : 'Создание крана'">
        <Loader v-if="loader" class="center" />
        <Form @submit="onSubmit" class="equipment-form">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="craneCharacteristics" name="Характеpистики">
                    <div class="row">
                        <MultiSelect
                            v-model="form.type.title"
                            title="Классификация крана"
                            label="Классификация крана"
                            class="col-5 mb-2"
                            :options="craneTypeOptions"
                        />
                        <MultiSelect
                            v-model="form.location.title"
                            :v="v$.form.crane_location"
                            title="Расположение"
                            label="Расположение"
                            class="col-4"
                            :options="craneLocationOptions"
                            required
                        />
                        <Input
                            v-if="form"
                            v-model="form.crane_capacity"
                            :v="v$.form.crane_capacity"
                            label="Грузоподъемность"
                            class="col-3"
                            type="number"
                            step="any"
                            unit="т"
                            required
                        />
                        <MultiSelect
                            v-model="form.crane_beam"
                            title="Тип балки"
                            label="Тип балки"
                            class="col-5 mb-2"
                            :options="craneBeamOptions"
                        />
                        <MultiSelect
                            v-model="form.crane_beams_amount"
                            title="Кол-во балок/мостов"
                            label="Кол-во балок/мостов"
                            class="col-4"
                            :options="craneBeamsAmountOptions"
                        />
                        <Input
                            v-if="form"
                            v-model="form.crane_span"
                            :v="v$.form.crane_span"
                            class="col-3"
                            label="Длина пролета"
                            type="number"
                            unit="м"
                            required
                        />
                        <MultiSelect
                            v-model="form.crane_hoisting"
                            title="Тип подъемн. механизма"
                            label="Тип подъемн. механизма"
                            class="col-5 mb-2"
                            :options="craneHoistingOptions"
                        />
                        <MultiSelect
                            v-model="form.crane_controls"
                            title="Тип управления"
                            label="Тип управления"
                            :close-on-select="false"
                            class="col-4"
                            mode="multiple"
                            :options="craneControlsOptions"
                        />
                        <Input
                            v-if="form"
                            v-model="form.crane_hook_height"
                            :v="v$.form.crane_hook_height"
                            class="col-3"
                            label="Высота до крюка"
                            type="number"
                            unit="м"
                        />
                        <MultiSelect
                            v-model="form.crane_condition"
                            title="Состояние"
                            label="Состояние"
                            class="col-5"
                            :options="craneConditionOptions"
                        />
                        <div class="col-2">
                            <span class="form__subtitle">Под надзором</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.crane_supervision"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.crane_supervision"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <div class="col-2">
                            <span class="form__subtitle">Есть документы</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.crane_documents"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.crane_documents"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <Textarea v-model="form.description" label="Описание" class="col-12 mt-2" />
                    </div>
                </Tab>
                <Tab id="cranePhoto" name="Фотографии">
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
            <div class="row">
                <Submit success class="col-3 mx-auto">Сохранить</Submit>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { helpers, minValue, required } from '@vuelidate/validators';
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import {
    craneBeamsAmountTypes,
    craneBeamTypes,
    craneHoistingTypes,
    craneTypes,
    liftingDeviceConditionTypes,
    liftingDeviceControlsTypes,
    liftingDeviceLocationTypes
} from '@/const/liftingDevices';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'FormComplexCrane',
    components: { RadioChip, Modal, Loader },
    mixins: [ComplexFormMixin],
    emits: ['close'],
    props: {
        crane: Object
    },
    data() {
        return {
            form: {
                crane_capacity: null,
                type: {
                    title: null
                },
                location: {
                    title: null
                },
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
                photos: []
            }
        };
    },
    validations() {
        return {
            form: {
                crane_location: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                crane_capacity: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                crane_span: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                crane_hook_height: {
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                }
            }
        };
    },
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
    },
    methods: {
        onSubmit() {}
    },
    created() {
        if (this.crane) {
            // eslint-disable-next-line no-undef
            this.form = structuredClone(this.crane);
        }
    }
};
</script>
