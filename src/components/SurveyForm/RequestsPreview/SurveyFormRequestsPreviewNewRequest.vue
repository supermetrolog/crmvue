<template>
    <div class="survey-form-object-preview-offer">
        <div class="survey-form-object-preview-offer__wrapper">
            <div
                class="messenger-quiz-form-template-request__preview messenger-quiz-form-request-picker-element"
            >
                <div class="messenger-quiz-form-request-picker-element__body">
                    <p class="messenger-quiz-form-request-picker-element__header">
                        <span
                            v-if="request.express"
                            v-tippy="'Экспресс-запрос'"
                            class="messenger-quiz-form-request-picker-element__express"
                        >
                            <i class="fa-solid fa-fire"></i>
                        </span>
                        <span class="messenger-quiz-form-request-picker-element__description">
                            <span class="messenger-quiz-form-request-picker-element__type">
                                <UiField color="success" small>
                                    <i class="fa-solid fa-plus" />
                                    <span>{{ dealType }},</span>
                                    <span>
                                        <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                            {{ areaRange }}
                                        </with-unit-type>
                                    </span>
                                </UiField>
                            </span>
                        </span>
                    </p>
                    <p class="messenger-quiz-form-request-picker-element__regions">
                        {{ request.location }}
                    </p>
                </div>
            </div>
            <VueEditor
                v-model="form"
                autofocus
                :min-height="60"
                :max-height="200"
                :toolbar="false"
                :disabled="!editable"
                placeholder="Описание запроса"
                class="survey-form-object-preview-offer__editor mt-2"
            />
        </div>
        <div v-if="editable" class="survey-form-object-preview-offer__actions">
            <UiButtonIcon @click="$emit('edit')" icon="fa-solid fa-pen" label="Редактировать" />
            <UiButtonIcon @click="$emit('delete')" icon="fa-solid fa-trash" label="Удалить" />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['edit', 'delete']);

const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const form = defineModel();

const dealTypeOptions = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ-хранение',
    4: 'Субаренда',
    5: 'Строительство'
};

const dealType = computed(() => dealTypeOptions[props.request.deal_type]);

const areaRange = computed(() =>
    toNumberOrRangeFormat(props.request.area_min, props.request.area_max)
);
</script>
