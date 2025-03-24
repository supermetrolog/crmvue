<template>
    <div class="call-inline-card">
        <UiDropdownActions align="left">
            <template #trigger>
                <UiButtonIcon small label="Подробнее" icon="fa-solid fa-ellipsis" />
            </template>
            <template #menu>
                <UiDropdownActionsButton
                    @handle="$emit('show-call')"
                    label="Подробнее о звонке"
                    icon="fa-solid fa-phone"
                    disabled
                />
                <UiDropdownActionsButton
                    @handle="$emit('show-contact')"
                    label="Подробнее о контакте"
                    icon="fa-solid fa-user"
                />
                <UiDropdownActionsButton
                    @handle="toCompany"
                    label="Перейти к компании"
                    icon="fa-solid fa-arrow-up-right-from-square"
                />
            </template>
        </UiDropdownActions>
        <Tippy>
            <i :class="statusIcon" class="call-inline-card__icon" />
            <template #content>
                <p>{{ typeLabel }} звонок</p>
                <p :class="statusColor">{{ statusLabel }}</p>
            </template>
        </Tippy>
        <Avatar
            v-if="showAvatar"
            :src="call.user.userProfile.avatar"
            :label="call.user.userProfile.medium_name"
            :size="30"
        />
        <span class="call-inline-card__contact">
            <i v-if="call.contact.isMain" class="fa-solid fa-crown mr-1" />
            <span class="font-weight-semi">{{ call.contact.full_name }}, </span>
            <span class="text-grey">{{ contactPosition }}</span>
        </span>
        <span class="ml-auto text-grey">
            <i class="fa-regular fa-clock mr-1" />
            <span>{{ createdAt }}</span>
        </span>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import Avatar from '@/components/common/Avatar.vue';
import { callStatusEnum } from '@/const/enums/call.js';
import { Tippy } from 'vue-tippy';
import { callStatus, callType } from '@/const/options/call.options.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import { contactOptions } from '@/const/options/contact.options.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';
import { useRouter } from 'vue-router';

defineEmits(['show-call', 'show-contact']);
const props = defineProps({
    call: {
        type: Object,
        required: true
    },
    showAvatar: Boolean
});

const statusIcon = computed(() => {
    if (props.call.type === 0) {
        if (props.call.status === callStatusEnum.COMPLETED) {
            return 'fa-solid fa-phone-volume dashboard-cl-success';
        }

        return 'fa-solid fa-phone-slash dashboard-cl-danger';
    }

    if (props.call.status === 1) {
        return 'fa-solid fa-phone-flip dashboard-cl-success';
    }

    return 'fa-solid fa-phone-flip text-grey';
});

const typeLabel = computed(() => callType[props.call.type]);
const statusLabel = computed(() => callStatus[props.call.status]);
const statusColor = computed(() => {
    if (props.call.status === callStatusEnum.COMPLETED) return 'dashboard-cl-success';
    if (props.call.status === callStatusEnum.BUSY) return 'text-grey';
    return 'dashboard-cl-danger';
});

const createdAt = computed(() => toBeautifulDateFormat(props.call.created_at));

const contactPosition = computed(() => {
    if (props.call.contact.position_unknown) return 'Должность неизвестна';
    return contactOptions.position[props.call.contact.position];
});

const router = useRouter();

function toCompany() {
    window.open(
        router.resolve({ name: 'company', params: { id: props.call.contact.company_id } }).href,
        '_blank'
    );
}
</script>
