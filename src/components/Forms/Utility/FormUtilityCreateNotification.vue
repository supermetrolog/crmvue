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
        </UiForm>
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

const emit = defineEmits<{ (e: 'close'): void }>();

const form = reactive({
    subject: '',
    message: '',
    user_ids: [] as number[],
    channel: 'web'
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
</script>
