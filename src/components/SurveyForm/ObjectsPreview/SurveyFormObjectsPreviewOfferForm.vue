<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="900"
        :title="isEditMode ? 'Редактирование нового предложения' : 'Новое предложение'"
    >
        <UiForm>
            <UiFormGroup>
                <RadioOptions
                    v-model="form.deal_type"
                    label="Тип предложения"
                    :options="dealTypeOptions"
                    :rounded="false"
                    required
                    show-radio
                    :v="v$.form.deal_type"
                    class="col-12"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiInput
                    v-if="Number(form.deal_type) === 3"
                    v-model="form.area"
                    label="Вместимость"
                    unit="п.м"
                    class="col-6"
                />
                <UiInput v-else
v-model="form.area"
label="Площадь"
unit="м<sup>2"
class="col-6" />
                <UiInput v-model="form.price" label="Ставка" :unit="priceUnit" class="col-6" />
                <UiCheckbox
                    v-if="canBeDivided"
                    v-model="form.division"
                    :true-value="1"
                    :false-value="null"
                    class="col-6"
                >
                    Возможно деление
                </UiCheckbox>
                <UiCheckbox
                    v-if="companyCanBeSale"
                    v-model="form.sale_company"
                    :true-value="1"
                    :false-value="null"
                    class="offset-6 col-6"
                >
                    Продаст юр.лицо
                </UiCheckbox>
                <UiDateInput
                    v-model="form.availability_date"
                    :disabled="form.availability"
                    placeholder="Дата доступности"
                    label="Свободно с"
                    :min-date="new Date()"
                    class="col-12"
                >
                    <template #after>
                        <div class="d-flex gap-3">
                            <UiCheckbox
                                v-model="form.availability"
                                @change="form.availability_date = null"
                                :true-value="1"
                                :false-value="null"
                            >
                                Уже доступно
                            </UiCheckbox>
                            <UiCheckbox
                                v-model="form.availability"
                                @change="form.availability_date = null"
                                :true-value="2"
                                :false-value="null"
                            >
                                По запросу
                            </UiCheckbox>
                        </div>
                    </template>
                </UiDateInput>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiInput v-model="form.ceiling" label="Потолки" unit="м" class="col-3" />
                <UiInput
                    v-model="form.load"
                    label="Нагрузка на пол"
                    unit="т/м<sup>2</sup>"
                    class="col-3"
                />
                <UiInput
                    v-model="form.power"
                    label="Электричество"
                    unit="кВт"
                    type="number"
                    class="col-3"
                />
                <UiInput v-model="form.temperature" label="Темп. режим" class="col-3" />
                <UiInput v-model="form.floor_type" label="Тип пола" class="col-3" />
                <UiInput v-model="form.gates"
label="Ворот"
unit="шт"
type="number"
class="col-3" />
                <UiInput
                    v-model="form.cranes"
                    label="Краны"
                    type="number"
                    unit="шт"
                    class="col-3"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <VueEditor
                    v-model="form.description"
                    label="Описание предложения"
                    class="mt-2 col-12"
                    :toolbar="false"
                    :min-height="80"
                    :debounce="200"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { computed, reactive } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, required } from '@vuelidate/validators';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';

const emit = defineEmits(['close', 'updated', 'created']);

const props = defineProps({
    formData: Object
});

const { form, isEditMode } = useFormData(
    reactive({
        deal_type: null,
        description: null,
        area: null,
        price: null,
        load: null,
        temperature: null,
        gates: null,
        division: null,
        power: null,
        ceiling: null,
        floor_type: null,
        cranes: null,
        availability: null,
        availability_date: null,
        sale_company: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            deal_type: {
                required: helpers.withMessage('Выберите тип предложения', required)
            }
        }
    },
    { form }
);

const dealTypeOptions = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ-хранение',
    4: 'Субаренда'
};

const canBeDivided = computed(() => {
    if (!form.deal_type) return false;

    return Number(form.deal_type) === 1 || Number(form.deal_type) === 4;
});

const priceUnit = computed(() => {
    if (!form.deal_type) return undefined;

    if (Number(form.deal_type) === 2) return '₽ за м<sup>2</sup>';
    if (Number(form.deal_type) === 3) return '₽ за п.м';
    return '₽ за м<sup>2</sup>/год';
});

const companyCanBeSale = computed(() => {
    if (!form.deal_type) return false;

    return Number(form.deal_type) === 2;
});

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) emit('updated', form);
    else emit('created', form);
}
</script>
