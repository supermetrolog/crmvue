<template>
    <UiModal
        @closed="emit('close')"
        :title="isEditMode ? `Редактирование шаблона #${templateId}` : 'Создание шаблона'"
        :width="700"
        show
    >
        <Loader v-if="isLoading || isFetching" />
        <UiForm>
            <UiFormGroup>
                <UiInput
                    v-model="form.kind"
                    :v="v$.form.kind"
                    :disabled="isEditMode"
                    required
                    class="col-12"
                    label="KIND"
                />
                <Switch
                    v-model="form.is_active"
                    :transform="Number"
                    :checked="form.is_active"
                    true-title="Может быть применен"
                    class="col-12"
                />
                <MultiSelect
                    v-model="form.priority"
                    :v="v$.form.priority"
                    label="Приоритет"
                    class="col-6"
                    :options="['low', 'normal', 'high', 'urgent']"
                    placeholder="Укажите приоритет.."
                />
                <MultiSelect
                    v-model="form.category"
                    :v="v$.form.category"
                    label="Категория"
                    class="col-6"
                    :options="[
                        'request',
                        'company',
                        'tasks',
                        'message',
                        'meeting',
                        'reminder',
                        'system',
                        'client',
                        'deal'
                    ]"
                    placeholder="Укажите приоритет.."
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
<script setup lang="ts">
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, onBeforeMount, reactive } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { UserNotificationTemplate } from '@/types/user-notification/user-notification-template';
import { CreateUserNotificationTemplateRequestDto } from '@/api/user-notification-templates';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import Switch from '@/components/common/Forms/Switch.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';

const emit = defineEmits<{
    (e: 'created', template: UserNotificationTemplate): void;
    (e: 'updated', template: UserNotificationTemplate): void;
    (e: 'close'): void;
}>();

const props = defineProps<{
    templateId?: number | null;
}>();

const { execute: fetchTemplate, isLoading: isFetching } = useAsync(
    () => api.userNotificationTemplates.get(props.templateId),
    {
        onFetchResponse: ({ response }) => {
            form.kind = response.kind;
            form.category = response.category;
            form.priority = response.priority;
            form.is_active = response.is_active;
        }
    }
);

onBeforeMount(() => {
    if (isNotNullish(props.templateId)) {
        fetchTemplate();
    }
});

const isEditMode = computed(() => isNotNullish(props.templateId));

const notify = useNotify();

const form = reactive<CreateUserNotificationTemplateRequestDto>({
    kind: null,
    category: null,
    priority: null,
    is_active: 1
});

const { v$, validate } = useValidation(
    {
        form: {
            kind: {
                required: helpers.withMessage('Заполните поле', required)
            },
            category: {
                required: helpers.withMessage('Заполните поле', required)
            },
            priority: {
                required: helpers.withMessage('Заполните поле', required)
            }
        }
    },
    { form }
);

const { isLoading: isCreating, execute: createNotificationTemplate } = useAsync(
    () => api.userNotificationTemplates.create(form),
    {
        onFetchResponse: ({ response }) => {
            notify.success('Шаблон успешно создан.');
            emit('created', response);
        }
    }
);

const { isLoading: isUpdating, execute: updateNotificationTemplate } = useAsync(
    () => api.userNotificationTemplates.update(props.templateId, form),
    {
        onFetchResponse: ({ response }) => {
            notify.success('Шаблон успешно обновлен.');
            emit('updated', response);
        }
    }
);

const isLoading = computed(() => isCreating.value || isUpdating.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateNotificationTemplate();
    else await createNotificationTemplate();
}
</script>
