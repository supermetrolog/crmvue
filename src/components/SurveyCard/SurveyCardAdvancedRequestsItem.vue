<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{
            completed: hasSuccessStatus || needEditing || hasFailStatus,
            success: hasSuccessStatus,
            danger: hasFailStatus,
            warning: needEditing
        }"
    >
        <div class="survey-form-object-preview-offer__wrapper">
            <div class="request-row-card">
                <div class="request-row-card__except">
                    <div class="request-row-card__column">
                        <p class="request-row-card__id">#{{ request.snapshot.request_id }}</p>
                    </div>
                    <div class="request-row-card__info">
                        <p class="font-weight-bold">{{ request.snapshot.deal_type }}</p>
                        <WithUnitType
                            :value="request.snapshot.area"
                            :unit-type="unitTypes.SQUARE_METERS"
                            class="font-weight-bold mb-1"
                        />
                    </div>
                </div>
                <div class="request-row-card__body">
                    <div class="request-row-card__header">
                        <div class="request-row-card__description">
                            <p>Комментарий доступен на странице запроса..</p>
                        </div>
                    </div>
                    <div class="request-row-card__footer request-row-card__footer--empty">
                        <div
                            class="request-row-card__timeline align-items-center justify-content-center"
                        >
                            <UiField color="light">Таймлайн доступен на странице запроса..</UiField>
                        </div>
                    </div>
                </div>
            </div>
            <AnimationTransition :speed="0.5">
                <VueEditor
                    v-if="(needEditing || hasFailStatus) && request.description?.length"
                    :model-value="request.description"
                    autofocus
                    :min-height="60"
                    :max-height="200"
                    :toolbar="false"
                    disabled
                    placeholder="Что необходимо изменить или добавить?"
                    class="survey-form-object-preview-offer__editor mt-2"
                />
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import UiField from '@/components/common/UI/UiField.vue';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const ANSWER = {
    SUCCESS: 1,
    FAIL: 2,
    EDIT: 3
};

const hasSuccessStatus = computed(() => Number(props.request.answer) === ANSWER.SUCCESS);
const hasFailStatus = computed(() => Number(props.request.answer) === ANSWER.FAIL);
const needEditing = computed(() => Number(props.request.answer) === ANSWER.EDIT);
</script>
