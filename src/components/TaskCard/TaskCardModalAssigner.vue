<template>
    <TaskCardModal @close="$emit('close')" :loading title="Изменение исполнителя">
        <ConsultantPicker
            v-model="assigner"
            label="Исполнитель"
            :append-to-body="false"
            :options="getConsultantsOptions"
        />
        <UiForm class="task-card-modal__form">
            <UiTextarea
                v-model="comment"
                auto-height
                :disabled="!canBeSaved"
                class="task-card-modal__field"
                label="Комментарий"
                :required="canBeSaved"
                :v="v$.comment"
            />
            <div class="d-flex gap-2 mt-2">
                <TaskCardButton @click.prevent="assign" :disabled="!canBeSaved || loading">
                    Сохранить
                </TaskCardButton>
                <TaskCardButton @click.prevent="$emit('close')">Отмена</TaskCardButton>
            </div>
        </UiForm>
    </TaskCardModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import TaskCardModal from '@/components/TaskCard/TaskCardModal.vue';
import { helpers, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useValidationNotify } from '@/composables/useValidationNotify.js';

const emit = defineEmits(['assign', 'close']);
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    currentAssigner: {
        type: Number,
        required: true
    }
});

const { getConsultantsOptions } = useConsultantsOptions();

const assigner = ref(props.currentAssigner);
const comment = ref(null);

const canBeSaved = computed(
    () => assigner.value !== props.currentAssigner && isNotNullish(assigner.value)
);

watch(
    () => props.loading,
    value => {
        if (!value) comment.value = null;
    }
);

const v$ = useVuelidate(
    {
        comment: {
            required: helpers.withMessage('Введите комментарий', requiredIf(canBeSaved))
        }
    },
    { comment }
);

const { validateWithNotify } = useValidationNotify(v$);

function formToPayload() {
    return {
        comment: comment.value,
        assigner: assigner.value
    };
}

function assign() {
    validateWithNotify();

    if (!v$.value.$invalid) emit('assign', formToPayload());
}
</script>
