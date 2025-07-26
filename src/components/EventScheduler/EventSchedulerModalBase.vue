<template>
    <UiFormGroup>
        <UiCol :cols="7">
            <div class="row">
                <slot name="column">
                    <slot name="date">
                        <EventSchedulerDate
                            v-model:date="form.start"
                            v-model:option="form.startOption"
                            :v="v?.start"
                            :label="labels?.date"
                        />
                    </slot>
                    <UiFormDivider class="w-100" />
                    <slot name="additional">
                        <slot name="before-contact" />
                        <slot name="contact">
                            <EventSchedulerContact
                                v-model="form.contact_id"
                                :v="v?.contact_id"
                                :company
                                :contact
                                :label="labels?.contact"
                                :placeholder="placeholders?.contact"
                            />
                        </slot>
                        <slot name="before-consultant" />
                        <slot name="consultant">
                            <EventSchedulerConsultant
                                v-model="form.user_id"
                                :v="v?.user_id"
                                :company
                                class="col-12"
                            />
                        </slot>
                        <slot name="before-title" />
                        <slot name="title">
                            <EventSchedulerTitle
                                v-model="form.title"
                                :v="v?.title"
                                :label="labels?.title"
                                :placeholder="placeholders?.title"
                            />
                        </slot>
                        <slot name="before-comment" />
                        <slot name="comment">
                            <EventSchedulerComment
                                v-model="form.comment"
                                :label="labels?.comment"
                                :placeholder="placeholders?.comment"
                            />
                        </slot>
                        <slot name="after" />
                    </slot>
                </slot>
            </div>
        </UiCol>
        <div class="col-5 task-form__dates" :class="{ active: calendarIsActive }">
            <slot name="calendar">
                <EventSchedulerCalendar
                    v-model:date="form.start"
                    @change="form.startOption = CUSTOM_START_OPTION"
                    :v="v?.start"
                    :option="form.startOption"
                    :label="labels?.calendar"
                />
            </slot>
        </div>
    </UiFormGroup>
</template>
<script setup lang="ts">
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import EventSchedulerCalendar from '@/components/EventScheduler/EventSchedulerCalendar.vue';
import EventSchedulerDate from '@/components/EventScheduler/EventSchedulerDate.vue';
import EventSchedulerContact from '@/components/EventScheduler/EventSchedulerContact.vue';
import EventSchedulerComment from '@/components/EventScheduler/EventSchedulerComment.vue';
import EventSchedulerTitle from '@/components/EventScheduler/EventSchedulerTitle.vue';
import { computed } from 'vue';
import EventSchedulerConsultant from '@/components/EventScheduler/EventSchedulerConsultant.vue';

export interface EventSchedulerModel {
    start: Date | null;
    startOption: number | string | null;
    title: string | null;
    comment: string | null;
    contact_id: number | null;
    user_id: number | null;
}

const form = defineModel<EventSchedulerModel>('form', { default: () => ({}) });

defineProps<{
    company?: object | null | undefined;
    contact?: object | null | undefined;
    chatMemberId?: number | null | undefined;
    v?: object;
    labels?: {
        date?: string;
        contact?: string;
        comment?: string;
        calendar?: string;
        title?: string;
    };
    placeholders?: {
        date?: string;
        contact?: string;
        comment?: string;
        calendar?: string;
        title?: string;
    };
}>();

const CUSTOM_START_OPTION = 100;

const calendarIsActive = computed(() => Number(form.value.startOption) === CUSTOM_START_OPTION);
</script>
