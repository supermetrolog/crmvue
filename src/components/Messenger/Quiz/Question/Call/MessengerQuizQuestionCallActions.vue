<template>
    <Form @submit="submit">
        <FormGroup>
            <DashboardChip class="dashboard-bg-gray-l">
                Ответьте на несколько вопросов и выберите дальнейшие действия над контактом.
            </DashboardChip>
        </FormGroup>
        <FormGroup subtitle="Результат звонка" required>
            <div class="d-flex gap-1">
                <RadioOptions
                    v-model="result"
                    :v="v$.result"
                    required
                    :options="OPTIONS"
                    unselect
                />
            </div>
        </FormGroup>
        <FormGroup subtitle="Комментарий" required>
            <Textarea
                v-model="description"
                :v="v$.description"
                placeholder="Укажите важные моменты касаемые контакта. Почему не дозвонился, куда ушел работать, когда перезвонить.."
                class="w-100"
                required
            />
        </FormGroup>
        <FormGroup subtitle="Действия">
            <div class="d-flex gap-2">
                <Button @click="$emit('delete-contact')" small info icon>
                    <i class="fa-solid fa-trash" />
                    <span>Удалить контакт</span>
                </Button>
                <Button @click="$emit('move-contact')" small info icon>
                    <i class="fa-solid fa-code-compare" />
                    <span>Перенести</span>
                </Button>
                <Button @click="$emit('schedule-call')" small info icon>
                    <i class="fa-solid fa-phone"></i>
                    <span>Запланировать звонок</span>
                </Button>
            </div>
        </FormGroup>
        <FormGroup class="mt-4">
            <div class="d-flex gap-2 mx-auto">
                <Button @click="submit" success>Подтвердить</Button>
                <Button @click="$emit('close')" danger>Отмена</Button>
            </div>
        </FormGroup>
    </Form>
</template>
<script setup>
import Textarea from '@/components/common/Forms/Textarea.vue';
import { ref } from 'vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { useValidationNotify } from '@/composables/useValidationNotify.js';

const emit = defineEmits([
    'suggest-next',
    'close',
    'delete-contact',
    'move-contact',
    'schedule-call',
    'submit'
]);

defineProps({
    contact: {
        type: Object,
        required: true
    }
});

// answers

const OPTIONS = {
    1: 'Не отвечает',
    2: 'Не доступен'
};

const result = ref(null);
const description = ref(null);

const rules = {
    result: {
        required: helpers.withMessage('Выберите результат звонка', required)
    },
    description: {
        required: helpers.withMessage('Заполните комментарий', required)
    }
};

const v$ = useVuelidate(rules, { result, description });

const { validateWithNotify } = useValidationNotify(v$);

function submit() {
    validateWithNotify();
    if (v$.value.$error) return;

    emit('submit', { result: OPTIONS[result.value], description: description.value });
}
</script>
