<template>
    <Tr
        class="company-table-item"
        :class="{ CompanyTableOdd: odd, CompanyTableEven: !odd, checked: checked }"
    >
        <Td class="text-center company-table-item__id">
            <p class="mb-1">{{ company.id }}</p>
            <UiCheckbox
                @change="$emit('toggle-checked', $event)"
                class="form-utility-transfer-companies__checkbox"
                :checked
            />
        </Td>
        <Td class="company-table-item__name">
            <div class="company-table-item__main">
                <CompanyLogo
                    :company-id="company.id"
                    :company-name="companyName"
                    :src="company.logo"
                />
                <CompanyTableItemInfo :company />
            </div>
            <CompanyTableDropdown
                v-if="dropdownMustBeShown"
                v-model:objects-visible="objectsIsOpen"
                v-model:requests-visible="requestsIsOpen"
                :company
                class="mt-2"
            />
        </Td>
        <Td class="company-table-item__comment">
            <CompanyTableItemSurvey v-if="company.last_survey" :company read-only />
            <CompanyTableItemPinnedMessages
                v-if="company.pinned_messages.length"
                :company
                read-only
            />
            <div
                v-if="!company.last_survey"
                class="company-table-item__comment-buttons"
                :class="{ absolute: company.pinned_messages.length === 0 }"
            >
                <p>Опрос не был пройден</p>
            </div>
        </Td>
        <Td class="company-table-item__consultant">
            <div v-if="company.consultant" class="company-table-item__consultant-wrapper">
                <Avatar
                    :label="company.consultant.userProfile.medium_name"
                    :src="company.consultant.userProfile.avatar"
                    :size="55"
                />
            </div>
            <p v-else class="text-center">&#8212;</p>
        </Td>
        <Td class="company-table-item__date">
            <UiField
                v-if="isPassive"
                ref="passiveWhyCommentEl"
                class="offer-table-item__chip text-white danger font-weight-semi mb-1"
            >
                {{ passiveWhyLabel }}
            </UiField>
            <UiField
                v-if="company.updated_at"
                class="mb-1 offer-table-item__chip"
                color="gray-l"
                tooltip="Дата обновления"
            >
                <i class="fa-solid fa-refresh" />
                <span>{{ updatedAt }}</span>
            </UiField>
            <UiField class="mb-1 offer-table-item__chip" color="gray-l" tooltip="Дата создания">
                <i class="fa-regular fa-calendar-plus" />
                <span>{{ createdAt }}</span>
            </UiField>
        </Td>
    </Tr>
    <CompanyTableItemObjects
        v-if="company.objects?.length"
        v-model:visible="objectsIsOpen"
        :company
    />
    <CompanyTableItemRequests v-if="requestsIsOpen" :company-id="company.id" disabled />
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { computed, ref, useTemplateRef } from 'vue';
import { PassiveWhy } from '@/const/const.js';
import Avatar from '@/components/common/Avatar.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { useTippy } from 'vue-tippy';
import CompanyTableItemSurvey from '@/components/Company/Table/CompanyTableItemSurvey.vue';
import CompanyTableItemObjects from '@/components/Company/Table/CompanyTableItemObjects.vue';
import CompanyTableItemRequests from '@/components/Company/Table/CompanyTableItemRequests.vue';
import CompanyTableDropdown from '@/components/Company/Table/CompanyTableDropdown.vue';
import CompanyTableItemInfo from '@/components/Company/Table/CompanyTableItemInfo.vue';
import CompanyTableItemPinnedMessages from '@/components/Company/Table/CompanyTableItemPinnedMessages.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import { toDateFormat } from '@/utils/formatters/date.js';

defineEmits(['toggle-checked']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    odd: Boolean,
    checked: Boolean
});

const dropdownMustBeShown = computed(
    () => props.company.objects.length || props.company.requests.length
);

const isPassive = computed(() => props.company.status === 0);
const passiveWhyLabel = computed(() => PassiveWhy[props.company.passive_why].short ?? 'Пассив');

const passiveWhyComment = computed(() => {
    if (!props.company.passive_why) return 'Причина не указана';
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

const companyName = computed(() => getCompanyName(props.company));

useTippy(useTemplateRef('passiveWhyCommentEl'), { content: passiveWhyComment });

const updatedAt = computed(() => toDateFormat(props.company.updated_at, 'D.MM.YYYY, HH:mm'));
const createdAt = computed(() => toDateFormat(props.company.created_at, 'D.MM.YYYY, HH:mm'));

// dropdown

const objectsIsOpen = ref(false);
const requestsIsOpen = ref(false);
</script>
