<template>
    <UiModal
        show
        relative
        hide-header
        :can-be-closed="false"
        title="Невозможно заполнить опрос"
        :width="650"
        class="messenger-quiz__disabled"
    >
        <div class="d-flex align-items-center justify-content-center gap-4 p-4">
            <i class="fa-solid fa-users-slash icon" />
            <div>
                <p class="font-weight-semi fs-4">Невозможно заполнить опрос</p>
                <p class="text-danger">Отсутствуют активные контакты</p>
            </div>
        </div>
        <template #actions>
            <UiButton
                v-if="enabled"
                @click="$emit('enabled')"
                icon="fa-solid fa-play"
                color="success-light"
            >
                К заполнению
            </UiButton>
            <UiButton
                v-if="passiveContacts.length"
                @click="archivedIsVisible = true"
                icon="fa-solid fa-users"
                color="light"
            >
                Посмотреть архивных ({{ passiveContacts.length }})
            </UiButton>
            <UiButton
                @click="$emit('suggest-create-contact')"
                icon="fa-solid fa-user-plus"
                color="light"
            >
                Добавить контакт
            </UiButton>
        </template>
        <teleport to="body">
            <UiModal
                v-model:visible="archivedIsVisible"
                :title="`Архивные контакты компании (${passiveContacts.length})`"
                :width="1000"
            >
                <div class="row">
                    <UiCol v-for="contact in passiveContacts" :key="contact.id" :cols>
                        <CompanyBoxContactListItem :contact="contact" editable>
                            <template #menu="{ passive, contact }">
                                <UiDropdownActionsButton
                                    v-if="passive"
                                    @handle="enableContact(contact)"
                                    icon="fa-solid fa-undo"
                                    label="Восстановить"
                                />
                                <UiDropdownActionsButton
                                    v-else
                                    @handle="disableContact(contact)"
                                    icon="fa-solid fa-ban"
                                    label="Отправить в пассив"
                                />
                            </template>
                        </CompanyBoxContactListItem>
                    </UiCol>
                </div>
            </UiModal>
            <FormContactDisable
                v-if="disableContactFormIsVisible"
                @close="closeDisableContactForm"
                @disabled="onDisabledContact"
                :contact="disablingContact"
            />
        </teleport>
    </UiModal>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, ref } from 'vue';
import CompanyBoxContactListItem from '@/components/Company/Box/CompanyBoxContactListItem.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import api from '@/api/api.js';
import { contactOptions } from '@/const/options/contact.options.js';
import { useNotify } from '@/utils/use/useNotify.js';
import FormContactDisable from '@/components/Forms/FormContactDisable.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';

defineEmits(['suggest-create-contact', 'enabled']);
const props = defineProps({
    passiveContacts: Array
});

const archivedIsVisible = ref(false);

const cols = computed(() => {
    if (props.passiveContacts.length === 1) return 12;
    if (props.passiveContacts.length === 2) return 6;
    return 4;
});

const notify = useNotify();
const { confirm } = useConfirm();

const enabled = ref(false);

async function enableContact(contact) {
    const confirmed = await confirm(
        'Восстановить контакт',
        'Вы уверены, что хотите восстановить контакт из архива?'
    );
    if (!confirmed) return;

    contact.isLoading = true;

    await api.contacts.enable(contact.id);

    contact.status = contactOptions.statusStatement.ACTIVE;
    contact.passive_why = null;
    contact.passive_why_comment = null;

    contact.isLoading = false;

    enabled.value = true;

    notify.success('Контакт успешно восстановлен.');
}

const disablingContact = ref(null);
const disableContactFormIsVisible = ref(false);

function disableContact(contact) {
    disablingContact.value = contact;
    disableContactFormIsVisible.value = true;
}

function closeDisableContactForm() {
    disableContactFormIsVisible.value = false;
    disablingContact.value = null;
}

function onDisabledContact(payload) {
    disableContactFormIsVisible.value = false;

    disablingContact.value.status = 0;
    Object.assign(disablingContact.value, payload);

    disablingContact.value = null;
}
</script>
