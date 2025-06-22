<template>
    <div
        class="company-box-contact"
        :class="{
            'company-box-contact--main': contact.isMain,
            'company-box-contact--good': !!contact.good,
            passive: isPassive
        }"
    >
        <Loader v-if="contact.isLoading" small />
        <div v-if="isPassive" class="company-box-contact__passive">
            <i class="fa-solid fa-ban mr-1" />
            <span>{{ passiveLabel }}</span>
        </div>
        <div class="company-box-contact__body">
            <div class="company-box-contact__settings">
                <UiButtonIcon
                    v-if="contact.comments?.length"
                    color="light"
                    icon="fa-solid fa-comment"
                    badge-color="dark"
                    :badge="contact.comments?.length"
                    :label="`У контакта ${contact.comments?.length} комментариев`"
                    mini
                    rect
                />
                <UiDropdownActions v-if="canBeEdit">
                    <template #trigger>
                        <UiDropdownActionsTrigger label="Действия над контактом" color="light" />
                    </template>
                    <template #menu>
                        <slot name="menu" :contact="contact" :passive="isPassive">
                            <UiDropdownActionsButton
                                @handle="$emit('edit')"
                                icon="fa-solid fa-pen"
                                label="Редактировать"
                            />
                            <UiDropdownActionsButton
                                v-if="isPassive"
                                @handle="$emit('enable')"
                                icon="fa-solid fa-undo"
                                label="Восстановить"
                            />
                            <UiDropdownActionsButton
                                v-else
                                @handle="$emit('disable')"
                                icon="fa-solid fa-ban"
                                label="Отправить в пассив"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('delete')"
                                icon="fa-solid fa-trash"
                                label="Удалить"
                            />
                        </slot>
                    </template>
                </UiDropdownActions>
            </div>
            <div class="company-box-contact__header mb-1">
                <DashboardChip
                    v-if="!!contact.warning && contact.status"
                    class="dashboard-bg-danger text-white"
                >
                    Внимание!
                </DashboardChip>
                <DashboardChip
                    v-if="contact.faceToFaceMeeting"
                    ref="faceToFaceEl"
                    class="dashboard-bg-success"
                >
                    <i class="fa-solid fa-street-view"></i>
                </DashboardChip>
            </div>
            <strong v-if="contact.type" class="company-box-contact__name">Общий контакт</strong>
            <strong v-else class="company-box-contact__name">
                {{ contact.full_name || 'Имя неизвестно' }}
            </strong>
            <span class="company-box-contact__position">
                {{ contact.position_unknown ? 'Должность неизвестна' : position }}
            </span>
            <PhoneNumber
                v-if="contact.phones.length"
                class="company-box-contact__phone"
                :phone="mainPhone ?? contact.phones[0]"
                :contact="contact"
            />
            <CopyField
                v-if="contact.emails.length"
                :value="mainMail"
                class="company-box-contact__email"
                message="Электронная почта скопирована"
            >
                <span>{{ mainMail }}</span>
            </CopyField>
            <hr />
            <div v-if="contact.consultant" class="company-box-contact__consultant">
                <span>
                    конс: {{ contact.consultant.userProfile.short_name }}
                    <template v-if="updatedAt">{{ updatedAt }}</template>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { PositionList } from '@/const/const.js';
import dayjs from 'dayjs';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import CopyField from '@/components/common/CopyField.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import { computed, useTemplateRef } from 'vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { useAuth } from '@/composables/useAuth.js';
import { isPersonalContact } from '@/utils/helpers/models/contact.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import Loader from '@/components/common/Loader.vue';

defineEmits(['edit', 'disable', 'enable', 'delete']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const position = computed(() => {
    return props.contact.position ? PositionList[props.contact.position].label : '-';
});

const updatedAt = computed(() => {
    let date = props.contact.updated_at ?? props.contact.created_at;
    if (!date) return null;

    return dayjs(date).format('DD.MM.YYYY');
});

const mainPhone = computed(() => {
    return props.contact.phones.find(phone => phone.isMain);
});

const mainMail = computed(() => {
    let mainMail = props.contact.emails.find(email => email.isMain);
    if (mainMail) return mainMail.email;
    else return props.contact.emails[0].email;
});

const isPassive = computed(() => props.contact.status === contactOptions.statusStatement.PASSIVE);
const isPersonal = computed(() => isPersonalContact(props.contact));

const passiveLabel = computed(() => contactOptions.passiveWhy[props.contact.passive_why]);

useTippyText(useTemplateRef('faceToFaceEl'), 'Очная встреча');

const { currentUserIsModeratorOrHigher, currentUserId } = useAuth();

const canBeEdit = computed(() => {
    return (
        props.editable &&
        isPersonal.value &&
        (currentUserIsModeratorOrHigher.value ||
            props.contact.consultant_id === currentUserId.value)
    );
});
</script>
