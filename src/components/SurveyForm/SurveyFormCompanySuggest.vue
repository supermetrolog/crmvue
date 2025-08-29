<template>
    <UiModal
        @closed="$emit('closed')"
        show
        relative
        hide-header
        title="Невозможно заполнить опрос"
        class="messenger-quiz__disabled"
        :width="650"
        :close-on-outside-click="false"
    >
        <div class="d-flex align-items-center justify-content-center gap-4 p-4">
            <i class="fa-solid fa-phone-slash icon" />
            <div>
                <p class="font-weight-semi fs-4">
                    Не удалось связаться с представителями компании.
                </p>
                <p class="text-danger">Выберите дальнейшее действие над компанией</p>
            </div>
        </div>
        <Loader v-if="isLoading" small />
        <template #actions="{ close }">
            <UiButton
                @click="markAsPassive"
                color="danger-light"
                icon="fa-solid fa-pause"
                tooltip="Компания будет приостановлена, пока не будут найдены активные контакты."
            >
                Приостановить компанию
            </UiButton>
            <UiButton
                @click="markAsDeleted"
                color="danger-light"
                icon="fa-solid fa-trash"
                tooltip="Компания будет отправлена в корзину, все ее запросы и контакты будут архивированы."
            >
                Удалить компанию
            </UiButton>
            <UiButton @click="close" icon="fa-solid fa-forward" color="light">
                Пропустить
            </UiButton>
        </template>
        <teleport to="body">
            <FormCompanyDisable
                v-if="disableCompanyFormIsVisible && currentUserIsModeratorOrHigher"
                @close="disableCompanyFormIsVisible = false"
                @disabled="onDisabledCompany"
                :company
            />
        </teleport>
    </UiModal>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useAuth } from '@/composables/useAuth';
import api from '@/api/api';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import { ref } from 'vue';
import { getCompanyShortName } from '@/utils/formatters/models/company';
import { TASK_FORM_STEPS } from '@/composables/useTaskManager';
import { CompanyPassiveWhyEnum } from '@/types/company';
import { useConfirm } from '@/composables/useConfirm';
import { useNotify } from '@/utils/use/useNotify';
import Loader from '@/components/common/Loader.vue';

const emit = defineEmits<{ (e: 'closed'): void; (e: 'create-task', payload: object): void }>();
const props = defineProps<{ company: object }>();

const { currentUserIsModeratorOrHigher } = useAuth();
const { confirm } = useConfirm();
const notify = useNotify();

const isLoading = ref(false);

async function markAsPassive() {
    const confirmed = await confirm(
        'Приостановить компанию',
        'Все ее контакты и запросы будут архивированы. Компания будет восстановлена, когда к ней будут добавлены активные контакты.'
    );

    if (!confirmed) return;

    try {
        isLoading.value = true;

        await api.companies.passive(props.company.id, {
            passive_why: CompanyPassiveWhyEnum.NO_CONTACTS
        });

        notify.success('Компания успешно приостановлена', 'Действия над компанией');
        emit('closed');
    } finally {
        isLoading.value = false;
    }
}

function markAsDeleted() {
    if (currentUserIsModeratorOrHigher.value) {
        disableCompanyFormIsVisible.value = true;
    } else {
        emit('create-task', {
            title: `Удалить компанию "${getCompanyShortName(props.company)}" (#${props.company.id})`,
            step: TASK_FORM_STEPS.MESSAGE
        });
    }
}

const disableCompanyFormIsVisible = ref(false);

function onDisabledCompany() {
    emit('closed');
}
</script>
