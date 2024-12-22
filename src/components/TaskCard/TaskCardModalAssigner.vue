<template>
    <TaskCardModal @close="$emit('close')" :loading title="Изменение исполнителя">
        <ConsultantPicker
            v-model="assigner"
            label="Исполнитель"
            :append-to-body="false"
            :options="getConsultantsOptions"
        />
        <Form class="task-card-modal__form">
            <Textarea
                v-model="comment"
                auto-height
                :disabled="!canBeSaved"
                class="task-card-modal__field"
                label="Комментарий"
            />
            <div class="d-flex gap-2 mt-2">
                <TaskCardButton @click.prevent="assign" :disabled="!canBeSaved || loading">
                    Сохранить
                </TaskCardButton>
                <TaskCardButton @click.prevent="$emit('close')">Отмена</TaskCardButton>
            </div>
        </Form>
    </TaskCardModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Form from '@/components/common/Forms/Form.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import TaskCardModal from '@/components/TaskCard/TaskCardModal.vue';

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

function formToPayload() {
    return {
        comment: comment.value,
        assigner: assigner.value
    };
}

function assign() {
    emit('assign', formToPayload());
}
</script>
