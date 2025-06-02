<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{ success: hasSuccessStatus, fail: hasFailStatus, editing: needEditing }"
    >
        <div class="survey-form-object-preview-offer__wrapper">
            <div
                class="messenger-quiz-form-request-picker-element messenger-quiz-form-template-request__preview"
            >
                <div class="messenger-quiz-form-request-picker-element__body">
                    <p class="messenger-quiz-form-request-picker-element__header">
                        <span class="messenger-quiz-form-request-picker-element__id">
                            #{{ request.snapshot.request_id }}
                        </span>
                        <span
                            class="messenger-quiz-form-request-picker-element__description active"
                        >
                            <span class="messenger-quiz-form-request-picker-element__type">
                                {{ request.snapshot.deal_type }},
                            </span>
                            <span>
                                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                    {{ request.snapshot.area }}
                                </with-unit-type>
                            </span>
                        </span>
                    </p>
                </div>
            </div>
            <AnimationTransition :speed="0.5">
                <VueEditor
                    v-if="needEditing"
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

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const ANSWER = {
    SUCCESS: '1',
    FAIL: '2',
    EDIT: '3'
};

const hasSuccessStatus = computed(() => props.request.answer === ANSWER.SUCCESS);
const hasFailStatus = computed(() => props.request.answer === ANSWER.FAIL);
const needEditing = computed(() => props.request.answer === ANSWER.EDIT);
</script>
