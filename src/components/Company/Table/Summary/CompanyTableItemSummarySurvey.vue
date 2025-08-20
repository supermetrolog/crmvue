<template>
    <div class="company-table-item-summary-survey">
        <Loader v-if="company.last_survey?.isLoading" small />
        <div v-if="company.last_survey" class="company-table-item-summary-survey__header">
            <div class="company-table-item-summary-survey__title">
                <span class="ml-1">#{{ company.last_survey.id }}.</span>
                <span v-if="company.last_survey.contact" class="ml-1">
                    <span>
                        <Tippy :delay="300">
                            <span
                                @click.prevent="$emit('open-preview')"
                                class="company-table-item-summary-survey__link"
                                >Общение</span
                            >
                            <template #content>Нажмите, чтобы просмотреть опрос</template>
                        </Tippy>
                        <span> с контактом</span>
                    </span>
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
                    <ContactPositionField :contact="company.last_survey.contact" />
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
        </div>
        <div class="company-table-item-summary-survey__body">
            <CompanyTableItemSummaryLinkedMessages
                @show-comments="$emit('show-comments')"
                @show-notes="$emit('show-notes')"
                @show-message="$emit('show-message', $event)"
                @create-note="$emit('create-note', $event)"
                @update-note="$emit('update-note', $event)"
                @delete-note="$emit('delete-note')"
                @unpin-message="$emit('unpin-message')"
                :read-only
                :company
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import Loader from '@/components/common/Loader.vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import CallInlineCard from '@/components/Call/InlineCard/CallInlineCard.vue';
import { plural } from '@/utils/plural.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import CompanyTableItemSummaryLinkedMessages from '@/components/Company/Table/Summary/CompanyTableItemSummaryLinkedMessages.vue';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';

defineEmits([
    'open-preview',
    'show-notes',
    'show-comments',
    'create-note',
    'update-note',
    'unpin-message'
]);

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
