<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :width="550"
        small
        title="Изменение исполнителя"
    >
        <Loader v-if="loading" small />
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
        </UiForm>
        <template #actions>
            <UiButton
                @click.prevent="assign"
                :disabled="!canBeSaved || loading"
                color="success-light"
                icon="fa-solid fa-check"
                small
            >
                Сохранить
            </UiButton>
            <UiButton @click.prevent="$emit('close')" color="light" icon="fa-solid fa-ban" small>
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { helpers, requiredIf } from '@vuelidate/validators';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';

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

const { v$, validate } = useValidation(
    {
        comment: {
            required: helpers.withMessage('Введите комментарий', requiredIf(canBeSaved))
        }
    },
    { comment }
);

function formToPayload() {
    return {
        comment: comment.value,
        assigner: assigner.value
    };
}

async function assign() {
    const isValid = await validate();
    if (!isValid) return;

    emit('assign', formToPayload());
}
</script>
