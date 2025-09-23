<template>
    <UiModal
        @close="$emit('close')"
        :width="600"
        show
        custom-close
        :close-on-outside-click="false"
        title="Новое уведомление"
    >
        <UiForm>
            <Loader v-if="isLoading" />
            <UiFormGroup>
                <UiInput
                    v-model="form.subject"
                    :v="v$.subject"
                    label="Заголовок"
                    required
                    class="col-12"
                />
                <UiTextarea
                    v-model="form.message"
                    :v="v$.message"
                    label="Содержание"
                    required
                    auto-height
                    :min-height="100"
                    :max-height="200"
                    class="col-12"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <ConsultantModalPicker
                    v-model="form.user_ids"
                    :options="consultants"
                    :v="v$.user_ids"
                    class="col-12"
                    label="Кого уведомить"
                    required
                >
                    <template #picker-actions>
                        <div class="d-flex mt-2 gap-2 flex-wrap">
                            <UiButton
                                @click="selectAllConsultants"
                                :disabled="allSelected"
                                icon="fa-solid fa-users"
                                color="light"
                            >
                                Выбрать всех брокеров
                            </UiButton>
                            <AnimationTransition :speed="0.4">
                                <UiButton
                                    v-if="form.user_ids.length"
                                    @click="clearUsers"
                                    color="danger-light"
                                    icon="fa-solid fa-trash"
                                >
                                    Очистить
                                </UiButton>
                            </AnimationTransition>
                        </div>
                    </template>
                </ConsultantModalPicker>
            </UiFormGroup>
            <UiAccordion title="Продвинутые настройки">
                <template #body>
                    <UiFormGroup class="mt-2">
                        <MultiSelect
                            v-model="form.template_id"
                            label="Шаблон"
                            class="col-12"
                            :options="templatesOptions"
                            :loading="templatesIsLoading"
                            placeholder="Выберите шаблон.."
                        />
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <p class="font-weight-semi mb-1">Действия</p>
                            <div class="d-flex gap-2 flex-wrap">
                                <UiButton
                                    @click.prevent="actionFormIsVisible = true"
                                    small
                                    color="success-light"
                                    icon="fa-solid fa-plus"
                                >
                                    Добавить действие
                                </UiButton>
                                <div
                                    v-for="action in form.actions"
                                    :key="action.id"
                                    class="d-inline-flex align-items-center dashboard-bg-light py-1 px-2 br-1"
                                >
                                    <span class="mr-1">{{ action.label }}</span>
                                    <UiButtonIcon
                                        @click.prevent="removeActionById(action.id)"
                                        mini
                                        icon="fa-solid fa-xmark"
                                        color="light"
                                    />
                                </div>
                            </div>
                        </UiCol>
                    </UiFormGroup>
                </template>
            </UiAccordion>
        </UiForm>
        <teleport to="body">
            <UiModal
                v-slot="{ close }"
                v-model:visible="actionFormIsVisible"
                title="Добавить действие"
                :width="600"
                :blackout-opacity="0.7"
            >
                <FormUtilityCreateNotificationAction @close="close" @confirm="addAction" />
            </UiModal>
        </teleport>
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                :state="buttonState"
                icon="fa-solid fa-check"
                color="success-light"
            >
                Создать
            </UiButton>
            <UiButton @click="close" :disabled="isLoading" icon="fa-solid fa-ban" color="light">
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { useValidation } from '@/composables/useValidation';
import { helpers, maxLength, required } from '@vuelidate/validators';
import api from '@/api/api';
import { useAsync } from '@/composables/useAsync';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { UserRoleEnum } from '@/types/user';
import ConsultantModalPicker from '@/components/common/Forms/ConsultantModalPicker/ConsultantModalPicker.vue';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { SendUserNotificationDto } from '@/api/user-notifications';
import Loader from '@/components/common/Loader.vue';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { spliceById } from '@/utils/helpers/array/spliceById';
import FormUtilityCreateNotificationAction from '@/components/Forms/Utility/FormUtilityCreateNotificationAction.vue';

const emit = defineEmits<{ (e: 'close'): void }>();

const form = reactive({
    subject: '',
    message: '',
    user_ids: [] as number[],
    channel: 'web',
    template_id: null,
    actions: []
} satisfies SendUserNotificationDto);

const { v$, withValidation } = useValidation(
    {
        subject: {
            required: helpers.withMessage('Заполните заголовок', required),
            maxLength: helpers.withMessage('Не более 128 символов', maxLength(128))
        },
        message: {
            required: helpers.withMessage('Заполните сообщение', required)
        },
        user_ids: {
            required: helpers.withMessage('Выберите брокеров', required)
        }
    },
    form
);

const { execute, isLoading, buttonState } = useAsync(api.userNotifications.send, {
    onFetchResponse() {
        emit('close');
    }
});

const submit = withValidation(() => execute(form as unknown as SendUserNotificationDto));

// consultant picker

const store = useStore();

const consultants = ref([]);

onBeforeMount(async () => {
    consultants.value = await store.dispatch('getConsultants');
});

const onlyConsultantIds = computed(() =>
    consultants.value
        .filter(item => item.role === UserRoleEnum.CONSULTANT)
        .map(item => item.id as number)
        .toSorted()
);

function selectAllConsultants() {
    form.user_ids = [...onlyConsultantIds.value];
}

const allSelected = computed(
    () => form.user_ids.toSorted().join() === onlyConsultantIds.value.join()
);

function clearUsers() {
    form.user_ids = [];
}

// templates

const { data: templates, isLoading: templatesIsLoading } = useAsync(
    api.userNotificationTemplates.list,
    { immediate: true }
);

const templatesOptions = computed(() => {
    if (templatesIsLoading.value) {
        return [];
    }

    if (templates.value) {
        return templates.value.data.map(template => ({
            label: `${template.kind} | ${template.priority_label} | ${template.category_label}`,
            value: template.id
        }));
    }

    return [];
});

// actions

const actionFormIsVisible = ref(false);

function removeActionById(id: number) {
    spliceById(form.actions, id);
}

function addAction(config) {
    form.actions.push(config);
}
</script>
