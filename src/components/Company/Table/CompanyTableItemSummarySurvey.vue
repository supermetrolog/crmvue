<template>
    <div class="company-table-item-summary-survey">
        <Loader v-if="company.last_survey?.isLoading || isUpdating" small />
        <div v-if="company.last_survey" class="company-table-item-summary-survey__header">
            <div class="company-table-item-summary-survey__title">
                <span class="ml-1">#{{ company.last_survey.id }}.</span>
                <span v-if="company.last_survey.contact" class="ml-1">
                    <span>Общение с контактом</span>
                    <Tippy interactive :interactive-border="40">
                        <template #default>
                            <span class="company-table-item-summary-survey__contact mx-1">
                                {{ contactName }}
                            </span>
                        </template>
                        <template #content>
                            <ContactCard :contact="company.last_survey.contact" />
                        </template>
                    </Tippy>
                    <span>({{ contactPosition }})</span>
                </span>
                <Tippy
                    v-if="callsLabelShouldBeVisible"
                    :delay="300"
                    interactive
                    :interactive-border="30"
                    placement="left-start"
                    :max-width="1000"
                    class="ml-1"
                >
                    <span class="company-table-item-summary-survey__calls">
                        {{ callsPluralLabel }}
                    </span>
                    <template #content>
                        <div class="company-table-item-summary-survey__calls-list">
                            <CallInlineCard
                                v-for="call in company.last_survey.calls"
                                :key="call.id"
                                :call="call"
                                read-only
                                class="company-table-item-summary-survey__call"
                            />
                        </div>
                    </template>
                </Tippy>
            </div>
            <UiDropdownActions
                v-if="!readOnly"
                label="Действия"
                :title="`Опрос #${company.last_survey.id}`"
                small
            >
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('open-preview')"
                        label="Посмотреть опрос"
                        icon="fa-solid fa-eye"
                    />
                </template>
            </UiDropdownActions>
        </div>
        <div v-if="company.last_survey" class="company-table-item-summary-survey__body">
            <CompanyTableItemPinnedMessages
                v-if="company.pinned_messages.length"
                :read-only
                :company
            />
            <p v-else class="text-grey op-5 fs-2">Без комментариев..</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { contactOptions } from '@/const/options/contact.options.js';
import Loader from '@/components/common/Loader.vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import CallInlineCard from '@/components/Call/InlineCard/CallInlineCard.vue';
import { plural } from '@/utils/plural.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import CompanyTableItemPinnedMessages from '@/components/Company/Table/CompanyTableItemPinnedMessages.vue';

defineEmits(['open-preview']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});

const contactName = computed(() => {
    return getContactFullName(props.company.last_survey.contact);
});

const contactPosition = computed(() => {
    if (props.company.last_survey.contact.position_unknown) return 'Должность неизвестна';
    return contactOptions.position[props.company.last_survey.contact.position];
});

// calls

const hasMainContact = computed(() => isNotNullish(props.company.last_survey.contact_id));

const callsLabelShouldBeVisible = computed(
    () => props.company.last_survey.calls.length > 1 || !hasMainContact.value
);

const callsPluralLabel = computed(() =>
    plural(
        props.company.last_survey.calls.length - (hasMainContact.value ? 1 : 0),
        '+ еще %d звонок',
        '+ еще %d звонка',
        '+ еще %d звонков'
    )
);
</script>
