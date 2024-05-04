<template>
    <Modal
        @close="$emit('close')"
        :title="elevator ? 'Редактирование подъемника' : 'Добавление подъемника'"
        width="950"
        has-tabs
    >
        <Loader v-if="loader" class="center" />
        <Form @submit="onSubmit" class="equipment-form">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="elevatorCharacteristics" name="Характеpистики">
                    <div class="row">
                        <MultiSelect
                            v-model="form.elevator_type"
                            title="Тип устройства"
                            label="Тип устройства"
                            class="col-4"
                            :options="elevatorTypeOptions"
                        />
                        <MultiSelect
                            v-model="form.elevator_location"
                            :v="v$.form.elevator_location"
                            title="Расположение"
                            label="Расположение"
                            class="col-4"
                            :options="elevatorLocationOptions"
                            required
                        />
                        <Input
                            v-model="form.elevator_capacity"
                            :v="v$.form.elevator_capacity"
                            label="Грузоподъемность"
                            class="col-4"
                            type="number"
                            unit="т"
                            required
                        />
                        <DoubleInput
                            v-model:first="form.elevator_length"
                            v-model:second="form.elevator_width"
                            label="Габариты"
                            class="col-md-6 col-12"
                            type="number"
                            without-caption
                            :validators="formElevatorValidators"
                        />
                        <div class="col-3 mt-2">
                            <span class="form__subtitle">Под надзором</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.elevator_supervision"
                                    label="Нет"
                                    :value="0"
                                />
                                <RadioChip
                                    v-model="form.elevator_supervision"
                                    label="Да"
                                    :value="1"
                                />
                            </div>
                        </div>
                        <div class="col-3 mt-2">
                            <span class="form__subtitle">Есть документы</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.elevator_documents"
                                    label="Нет"
                                    :value="0"
                                />
                                <RadioChip
                                    v-model="form.elevator_documents"
                                    label="Да"
                                    :value="1"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.elevator_volume"
                            :v="v$.form.elevator_volume"
                            class="col-4"
                            label="Вместимость"
                            type="number"
                            unit="п.м."
                            required
                        />
                        <MultiSelect
                            v-model="form.elevator_condition"
                            title="Состояние"
                            label="Состояние"
                            class="col-4"
                            :options="elevatorConditionOptions"
                        />
                        <MultiSelect
                            v-model="form.elevator_controls"
                            title="Тип управления"
                            label="Тип управления"
                            :close-on-select="false"
                            class="col-4"
                            mode="multiple"
                            :options="elevatorControlsOptions"
                        />
                        <div v-if="form.elevator_controls" class="offset-8 col-4 align-self-end">
                            <div class="form__row mt-1">
                                <Chip
                                    v-for="(control, index) in form.elevator_controls"
                                    :key="index"
                                    @click="removeControl(index)"
                                    :value="control"
                                    :html="control"
                                />
                            </div>
                        </div>
                        <Textarea v-model="form.description" label="Описание" class="col-12 mt-2" />
                    </div>
                </Tab>
                <Tab id="elevatorPhoto" name="Фотографии">
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
            <div class="row justify-content-center">
                <Submit success class="col-3">Сохранить</Submit>
                <Button v-if="elevator" class="col-3 ml-2" danger>Удалить</Button>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import { helpers, minValue, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import Chip from '@/components/common/Chip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { min } from '@//validators';
import Button from '@/components/common/Button.vue';
import { entityOptions } from '@/const/options/options';

export default {
    name: 'FormComplexElevator',
    components: { Button, DoubleInput, Chip, RadioChip, Modal, Loader },
    mixins: [ComplexFormMixin],
    emits: ['close'],
    props: {
        elevator: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            form: {
                elevator_capacity: null,
                elevator_type: null,
                elevator_location: null,
                elevator_length: null,
                elevator_width: null,
                elevator_volume: null,
                elevator_controls: [],
                elevator_supervision: null,
                elevator_documents: null,
                elevator_condition: null,
                photosList: [],
                photos: []
            }
        };
    },
    validations() {
        return {
            form: {
                elevator_location: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                elevator_capacity: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                elevator_volume: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                }
            }
        };
    },
    computed: {
        elevatorTypeOptions() {
            return Object.values(entityOptions.elevator.type);
        },
        elevatorLocationOptions() {
            return Object.values(entityOptions.elevator.location);
        },
        elevatorControlsOptions() {
            return Object.values(entityOptions.elevator.controls);
        },
        elevatorConditionOptions() {
            return Object.values(entityOptions.elevator.condition);
        },
        formElevatorValidators() {
            return [{ func: min(1), message: 'Значение должно быть больше 0' }];
        }
    },
    methods: {
        removeControl(index) {
            this.form.elevator_controls.splice(index, 1);
        }
    }
};
</script>
