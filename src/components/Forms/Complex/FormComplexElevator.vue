<template>
    <Modal
        @close="$emit('close')"
        show
        :title="elevator ? 'Редактирование подъемника' : 'Добавление подъемника'"
        width="950"
        has-tabs
    >
        <Loader v-if="isLoading" />
        <Form @submit="onSubmit" class="equipment-form">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="elevatorCharacteristics" name="Характеpистики">
                    <div class="row">
                        <Input
                            v-model="form.elevator_capacity"
                            :v="v$.form.elevator_capacity"
                            label="Грузоподъемность"
                            class="col-3"
                            type="number"
                            unit="т"
                            required
                        />
                        <Input
                            v-model="form.elevator_volume"
                            :v="v$.form.elevator_volume"
                            class="col-3"
                            label="Вместимость"
                            type="number"
                            unit="п.м."
                            required
                        />
                        <DoubleInput
                            v-model:first="form.elevator_length"
                            v-model:second="form.elevator_width"
                            :v-first="v$.form.elevator_length"
                            :v-second="v$.form.elevator_width"
                            label="Габариты"
                            first-label="Длина"
                            second-label="Ширина"
                            unit="м"
                            class="col-6"
                            type="number"
                        />
                        <MultiSelect
                            v-model="form.elevator_type"
                            title="Тип устройства"
                            label="Тип устройства"
                            class="col-4"
                            :options="entityOptions.elevator.type"
                        />
                        <MultiSelect
                            v-model="form.elevator_location"
                            :v="v$.form.elevator_location"
                            title="Расположение"
                            label="Расположение"
                            class="col-4"
                            :options="entityOptions.elevator.location"
                            required
                        />
                        <MultiSelect
                            v-model="form.elevator_controls"
                            title="Тип управления"
                            label="Тип управления"
                            :close-on-select="false"
                            class="col-4"
                            mode="multiple"
                            multiple
                            :options="entityOptions.elevator.controls"
                        />
                        <MultiSelect
                            v-model="form.elevator_condition"
                            title="Состояние"
                            label="Состояние"
                            class="col-6"
                            :options="entityOptions.elevator.condition"
                        />
                        <RadioOptions
                            v-model="form.elevator_supervision"
                            label="Под надзором"
                            unselect
                            class="col-3"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                        <RadioOptions
                            v-model="form.elevator_documents"
                            label="Есть документы"
                            unselect
                            class="col-3"
                            :options="entityOptions.defaults.booleanSimple"
                        />
                    </div>
                    <div class="row mt-2">
                        <VueEditor v-model="form.description" label="Описание" class="col-12" />
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
                <FormSubmit success class="col-3">Сохранить</FormSubmit>
                <Button v-if="elevator" class="col-3 ml-2" danger>Удалить</Button>
            </div>
        </Form>
    </Modal>
</template>

<script setup>
import useVuelidate from '@vuelidate/core';
import { onBeforeMount, reactive, shallowRef } from 'vue';
import { validationRulesForElevator } from '@/validators/rules/elevator.js';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Input from '@/components/common/Forms/Input.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { entityOptions } from '@/const/options/options.js';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import Form from '@/components/common/Forms/Form.vue';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

defineEmits(['close']);
const props = defineProps({
    elevator: {
        type: Object,
        default: null
    }
});

const isLoading = shallowRef(false);
const form = reactive({
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
});

const v$ = useVuelidate({ form: validationRulesForElevator }, { form });

const onSubmit = () => {};

onBeforeMount(() => {
    if (props.elevator) Object.assign(form, cloneObject(props.elevator));
});
</script>
