<template>
    <Modal
        @close="$emit('close')"
        :title="crane ? 'Редактирование крана' : 'Добавление крана'"
        width="900"
        has-tabs
        show
    >
        <Loader v-if="isLoading" />
        <Form @submit="onSubmit" class="equipment-form">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="craneCharacteristics" name="Характеристики">
                    <div class="row">
                        <Input
                            v-model="form.crane_capacity"
                            :v="v$.form.crane_capacity"
                            label="Грузоподъемность"
                            class="col-3"
                            type="number"
                            step="any"
                            unit="т"
                            required
                        />
                        <Input
                            v-model="form.crane_span"
                            :v="v$.form.crane_span"
                            class="col-3"
                            label="Длина пролета"
                            type="number"
                            unit="м"
                        />
                        <Input
                            v-model="form.crane_hooks"
                            :v="v$.form.crane_hooks"
                            class="col-3"
                            label="Количество крюков"
                            type="number"
                            unit="шт"
                        />
                        <Input
                            v-model="form.crane_hook_height"
                            :v="v$.form.crane_hook_height"
                            class="col-3"
                            label="Высота до крюка"
                            type="number"
                            unit="м"
                        />
                        <MultiSelect
                            v-model="form.crane_type"
                            title="Классификация крана"
                            label="Классификация крана"
                            class="col-4"
                            :options="entityOptions.crane.type"
                        />
                        <MultiSelect
                            v-model="form.crane_location"
                            :v="v$.form.crane_location"
                            title="Расположение"
                            label="Расположение"
                            class="col-4"
                            :options="entityOptions.crane.location"
                            required
                        />
                        <MultiSelect
                            v-model="form.crane_beam"
                            title="Тип балки"
                            label="Тип балки"
                            class="col-4"
                            :options="entityOptions.crane.beam"
                        />
                        <MultiSelect
                            v-model="form.crane_beams_amount"
                            title="Кол-во балок/мостов"
                            label="Кол-во балок/мостов"
                            class="col-4"
                            :options="entityOptions.crane.beamAmount"
                        />
                        <MultiSelect
                            v-model="form.crane_hoisting"
                            title="Тип подъемн. механизма"
                            label="Тип подъемн. механизма"
                            class="col-4"
                            :options="entityOptions.crane.hoisting"
                        />
                        <MultiSelect
                            v-model="form.crane_controls"
                            title="Тип управления"
                            label="Тип управления"
                            :close-on-select="false"
                            class="col-4"
                            mode="multiple"
                            multiple
                            :options="entityOptions.crane.controls"
                        />
                        <MultiSelect
                            v-model="form.crane_condition"
                            title="Состояние"
                            label="Состояние"
                            class="col-6"
                            :options="entityOptions.crane.condition"
                        />
                        <RadioOptions
                            v-model="form.crane_supervision"
                            label="Под надзором"
                            :options="entityOptions.defaults.booleanSimple"
                            unselect
                            class="col-3"
                        />
                        <RadioOptions
                            v-model="form.crane_documents"
                            label="Есть документы"
                            :options="entityOptions.defaults.booleanSimple"
                            unselect
                            class="col-3"
                        />
                        <VueEditor v-model="form.description" class="col-12" label="Описание" />
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
            <div class="row justify-content-center">
                <FormSubmit success class="col-3">Сохранить</FormSubmit>
                <Button v-if="crane" class="col-3 ml-2" danger>Удалить</Button>
            </div>
        </Form>
    </Modal>
</template>

<script setup>
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import { entityOptions } from '@/const/options/options';
import Input from '@/components/common/Forms/Input.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import useVuelidate from '@vuelidate/core';
import { onBeforeMount, reactive, shallowRef } from 'vue';
import { validationRulesForCrane } from '@/validators/rules/crane.js';
import { cloneObject } from '@/utils/index.js';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

defineEmits(['close']);
const props = defineProps({
    crane: {
        type: Object,
        default: null
    }
});

const isLoading = shallowRef(false);

const form = reactive({
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
    photos: []
});

const v$ = useVuelidate({ form: validationRulesForCrane }, { form });

const onSubmit = () => {};

onBeforeMount(() => {
    if (props.crane) Object.assign(form, cloneObject(props.crane));
});
</script>
