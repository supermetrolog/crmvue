<template>
    <Tr class="call-table-item">
        <Td :width="60">
            <p class="text-center">{{ call.id }}</p>
        </Td>
        <Td sort="type" :width="140">
            <p>
                <i
                    class="fa-solid mr-1"
                    :class="call.type ? 'fa-arrow-turn-down' : 'fa-arrow-turn-up'"
                />
                <span>{{ typeLabel }}</span>
            </p>
        </Td>
        <Td sort="status" :width="200">
            <p :class="statusColor" class="font-weight-semi">{{ statusLabel }}</p>
        </Td>
        <Td sort="contact_name" :width="300">
            <p class="font-weight-semi">
                <span>{{ call.contact.full_name }}</span>
                <UiTooltipIcon
                    v-if="call.contact.isMain"
                    tooltip="Основной контакт"
                    icon="fa-solid fa-crown"
                    class="ml-1"
                />
                <UiTooltipIcon
                    v-if="call.contact.faceToFaceMeeting"
                    tooltip="Была личная (очная) встреча"
                    icon="fa-solid fa-street-view"
                    class="ml-1"
                />
                <UiTooltipIcon
                    v-if="call.contact.good"
                    tooltip="Хорошие взаимоотношения"
                    icon="fa-regular fa-face-smile-beam"
                    class="ml-1"
                />
                <UiTooltipIcon
                    v-if="call.contact.warning"
                    tooltip="Внимание"
                    icon="fa-solid fa-exclamation-circle"
                    class="icon text-danger"
                />
            </p>
            <p class="fs-2">
                <span class="text-grey">Компания: </span>
                <span>{{ companyName }}</span>
            </p>
        </Td>
        <Td :width="200" class="py-2">
            <div v-if="phones.length" class="call-table-item__phones">
                <PhoneNumber
                    v-for="phone in phones"
                    :key="phone.id"
                    @click="$emit('open-phone', phone)"
                    :phone="phone"
                    :contact="call.contact"
                    hidden
                    clickable
                    class="call-table-item__phone"
                />
            </div>
            <p v-else class="messenger-warning">&#8212;</p>
        </Td>
        <Td sort="contact_position" :width="350">
            <p v-if="call.contact.position_unknown" class="text-grey">Должность неизвестна</p>
            <p v-else>
                <ContactPositionField :contact="call.contact" />
            </p>
        </Td>
        <Td sort="user_name" :width="250">
            <div class="d-flex align-items-center gap-2">
                <Avatar :src="call.user.userProfile.avatar" :size="30" />
                <span>{{ call.user.userProfile.medium_name }}</span>
            </div>
        </Td>
        <Td sort="created_at" :width="150">
            <p>{{ createdAt }}</p>
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { callStatus, callType } from '@/const/options/call.options.js';
import Avatar from '@/components/common/Avatar.vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import { computed } from 'vue';
import { callStatusEnum } from '@/const/enums/call.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';

defineEmits(['open-phone']);
const props = defineProps({
    call: {
        type: Object,
        required: true
    }
});

const typeLabel = computed(() => callType[props.call.type]);
const statusLabel = computed(() => callStatus[props.call.status]);
const createdAt = computed(() => toBeautifulDateFormat(props.call.created_at));

const statusColor = computed(() => {
    if (props.call.status === callStatusEnum.COMPLETED) return 'text-success';
    if (props.call.status === callStatusEnum.BUSY) return 'text-grey';
    return 'color-danger';
});

const companyName = computed(() =>
    getCompanyShortName(props.call.contact.company, props.call.contact.company_id)
);

const phones = computed(() => {
    if (props.call.phone_id) {
        return props.call.contact.phones.filter(phone => phone.id === props.call.phone_id);
    }

    return props.call.contact.phones;
});
</script>
