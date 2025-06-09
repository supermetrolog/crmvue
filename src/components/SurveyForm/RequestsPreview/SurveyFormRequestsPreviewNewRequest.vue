<template>
    <div class="survey-form-object-preview-offer">
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="request-row-card">
                <div class="request-row-card__except">
                    <div class="request-row-card__column">
                        <p class="request-row-card__id text-primary font-weight-semi">Новый!</p>
                        <Avatar :src="currentUser.userProfile.avatar" :size="40" />
                    </div>
                    <div class="request-row-card__info">
                        <p class="font-weight-bold">{{ dealType }}</p>
                        <WithUnitType
                            :value="areaRange"
                            :unit-type="unitTypes.SQUARE_METERS"
                            class="font-weight-bold mb-1"
                        />
                        <p class="request-row-card__location">
                            <i class="fa-solid fa-earth mr-1"></i>
                            <span v-if="request.location?.length">{{ request.location }}</span>
                            <span v-else>Неизвестно</span>
                        </p>
                        <div class="request-row-card__date">Новый запрос</div>
                    </div>
                </div>
                <div class="request-row-card__body">
                    <div class="request-row-card__header">
                        <div class="request-row-card__description">
                            <div v-if="form?.length" v-html="form"></div>
                            <p v-else>Без комментария..</p>
                        </div>
                        <div v-if="editable" class="survey-form-object-preview-offer__actions">
                            <UiButtonIcon
                                @click="$emit('edit')"
                                icon="fa-solid fa-pen"
                                label="Редактировать"
                            />
                            <UiButtonIcon
                                @click="$emit('delete')"
                                icon="fa-solid fa-trash"
                                label="Удалить"
                            />
                        </div>
                    </div>
                    <div class="request-row-card__footer request-row-card__footer--empty">
                        <div
                            class="request-row-card__timeline justify-content-center align-items-center"
                        >
                            <UiField color="light">Таймлайн еще не создан..</UiField>
                        </div>
                    </div>
                </div>
            </div>
            <VueEditor
                v-if="editable"
                v-model="form"
                autofocus
                :min-height="60"
                :max-height="200"
                :toolbar="false"
                :disabled="!editable"
                :debounce="200"
                placeholder="Описание запроса.."
                class="survey-form-object-preview-offer__editor mt-2 font-weight-semi"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import UiField from '@/components/common/UI/UiField.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useAuth } from '@/composables/useAuth.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['edit', 'delete']);

const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const { currentUser } = useAuth();

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
