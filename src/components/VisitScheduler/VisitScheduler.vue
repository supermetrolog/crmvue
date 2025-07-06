<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        :title
        :width="900"
        :close-on-press-esc="false"
        :close-on-outside-click="false"
    >
        <UiForm>
            <Loader v-if="isCreating" />
            <UiFormGroup>
                <UiCol :cols="7">
                    <div class="row">
                        <RadioOptions
                            v-model="form.startOption"
                            :v="v$.form.start"
                            :options="startPresets"
                            :rounded="false"
                            required
                            object-key="label"
                            label="Дата планируемой встречи"
                            class="col-12"
                        />
                        <UiFormDivider class="w-100" />
                        <MultiSelect
                            v-if="!contact"
                            v-model="form.contact_id"
                            :options="contacts"
                            :loading="contactsIsLoading"
                            :label="`Контакт (${contactsIsLoading ? 'загрузка..' : contacts.length})`"
                            class="col-12"
                            can-deselect
                            placeholder="Выберите контакта.."
                        >
                            <template #option="{ option, isSelected }">
                                <div class="d-flex flex-column">
                                    <p class="font-weight-semi">
                                        <span>{{ option.label ?? '- Без измени' }}</span>
                                        <i v-if="option.isMain" class="fa-solid fa-crown ml-2" />
                                    </p>
                                    <p
                                        v-if="option.position"
                                        class="fs-2"
                                        :class="{ 'text-grey': !isSelected }"
                                    >
                                        {{ option.position }}
                                    </p>
                                    <p class="fs-2">
                                        Компания:
                                        <span class="font-weight-semi">{{ option.company }}</span>
                                    </p>
                                    <p v-if="option.phone" class="fs-2">
                                        Телефон: {{ option.phone }}
                                    </p>
                                    <UiField color="light" small class="fs-2 mt-1">
                                        <i class="fa-solid fa-phone" />
                                        <span>{{ option.calls_count }} звонков</span>
                                    </UiField>
                                </div>
                            </template>
                        </MultiSelect>
                        <UiInput
                            v-if="titleInputShouldBeShown"
                            v-model="form.title"
                            label="Название задачи"
                            required
                            class="col-12"
                        />
                        <UiTextarea
                            v-model="form.comment"
                            label="Комментарий"
                            placeholder="Комментарий к запланированной встрече.."
                            auto-height
                            :min-height="60"
                            :max-height="200"
                            class="col-12"
                        />
                    </div>
                </UiCol>
                <div class="col-5 task-form__dates" :class="{ active: calendarIsActive }">
                    <DatePicker
                        v-model="form.start"
                        @change="form.startOption = CUSTOM_START_OPTION"
                        @update-month-year="onUpdateMonthYear"
                        :min-date="new Date()"
                        :v="v$.form.start"
                        :markers="events"
                        :events-loading="eventsIsLoading"
                        size="40px"
                        label="Календарь"
                    />
                </div>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                color="success-light"
                icon="fa-solid fa-check"
                :loading="isCreating"
            >
                Запланировать
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" :disabled="isCreating">
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import DatePicker from '@/components/common/Forms/DatePicker/DatePicker.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { computed, onBeforeMount, reactive, ref, toRef, watch } from 'vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, maxLength, minLength, required } from '@vuelidate/validators';
import dayjs from 'dayjs';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { useAuth } from '@/composables/useAuth.js';
import api from '@/api/api.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { useSearchContacts } from '@/composables/useSearchContacts.ts';
import UiField from '@/components/common/UI/UiField.vue';
import Loader from '@/components/common/Loader.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { fromUtcToServer } from '@/utils/formatters/date.js';
import { useDebounceFn } from '@vueuse/core';
import { useCalendarEvents } from '@/composables/useCalendarEvents.js';

const emit = defineEmits(['close', 'created']);
const props = defineProps({
    company: Object,
    contact: Object,
    chatMemberId: Number,
    withMessage: Boolean,
    relations: {
        type: Array,
        default: () => []
    }
});

const title = computed(() => {
    if (props.company) {
        return `Запланировать встречу | ${props.company.full_name}`;
    }

    return 'Запланировать встречу';
});

const {
    searchContacts,
    filteredContacts: contacts,
    isLoading: contactsIsLoading
} = useSearchContacts(toRef(() => props.company?.id));

const form = reactive({
    start: null,
    startOption: null,
    title: generateTaskTitle(),
    comment: null,
    contact_id: props.contact?.id
});

const { v$, validate } = useValidation(
    {
        form: {
            start: {
                required: helpers.withMessage('Выберите дату старта задачи!', required)
            },
            title: {
                required: helpers.withMessage('Заголовок задачи является обязательным!', required),
                minLength: helpers.withMessage(
                    'Заголовок задачи не может быть меньше 16 символов!',
                    minLength(16)
                ),
                maxLength: helpers.withMessage(
                    'Заголовок задачи не может быть больше 255 символов!',
                    maxLength(255)
                )
            }
        }
    },
    { form }
);

function getPreparedStartDate(addCount, addUnit = 'day') {
    return dayjs().add(addCount, addUnit).toDate();
}

let startPresets = {};

function generateStartPresets() {
    startPresets = {
        1: {
            label: 'Сегодня',
            value: new Date()
        },
        2: {
            value: getPreparedStartDate(1),
            label: 'Завтра'
        },
        3: {
            value: getPreparedStartDate(2),
            label: 'Послезавтра'
        },
        4: {
            value: getPreparedStartDate(5),
            label: 'Через 5 дней'
        },
        5: {
            value: getPreparedStartDate(7),
            label: 'Через неделю'
        },
        6: {
            value: getPreparedStartDate(1, 'month'),
            label: 'Через месяц'
        },
        7: {
            value: getPreparedStartDate(3, 'month'),
            label: 'Через 3 месяца'
        },
        13: {
            value: getPreparedStartDate(6, 'month'),
            label: 'Через пол года'
        },
        14: {
            value: getPreparedStartDate(12, 'month'),
            label: 'Через год'
        },
        100: {
            value: null,
            icon: 'fa-solid fa-calendar',
            label: 'Выбрать вручную..'
        }
    };
}

watch(
    () => form.startOption,
    value => {
        if (isNullish(value)) {
            form.start = null;
            return;
        }

        const startDate = startPresets[value].value;

        if (isNotNullish(startDate)) {
            form.start = startDate;
        }
    }
);

const CUSTOM_START_OPTION = 100;

const calendarIsActive = computed(() => Number(form.startOption) === CUSTOM_START_OPTION);

function generateTaskTitle() {
    if (props.contact) {
        return `Встреча с ${props.contact.full_name} (комп. "${props.company.full_name}")`;
    }

    if (props.company) {
        return `Встреча с представителями комп. "${props.company.full_name}"`;
    }
}

function generateTaskRelations() {
    const relations = [...props.relations];

    if (props.company) {
        relations.push({
            entity_type: 'company',
            entity_id: props.company.id
        });
    }

    if (form.contact_id) {
        relations.push({
            entity_type: 'contact',
            entity_id: form.contact_id
        });
    }

    return relations;
}

const { currentUserId } = useAuth();

function formToPayload() {
    return {
        title: form.title,
        message: form.comment,
        start: fromUtcToServer(form.start),
        end: fromUtcToServer(dayjs(form.start).add(3, 'days')),
        user_id: currentUserId.value,
        relations: generateTaskRelations(),
        type: 'scheduled_visit'
    };
}

const isCreating = ref(false);
const notify = useNotify();

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    try {
        isCreating.value = true;

        const payload = formToPayload();

        let response;

        if (props.withMessage) response = await createTaskWithMessage(payload);
        else response = await createTask(payload);

        notify.success('Встреча успешно запланирована');

        emit('created', response, payload);
        emit('close');
    } finally {
        isCreating.value = false;
    }
}

async function createTask(payload) {
    return await api.task.create(payload);
}

function generateMessagePayload() {
    const payload = {
        message: `Запланирована встреча на ${dayjs(form.start).format('D.MM.YYYY')}`,
        template: 'schedule-visit'
    };

    if (form.contact_id) payload.contact_ids = [form.contact_id];

    return payload;
}

async function createTaskWithMessage(payload) {
    await api.messenger.sendMessageWithTask(props.chatMemberId, generateMessagePayload(), payload);
}

const titleInputShouldBeShown = ref(false);

onBeforeMount(() => {
    generateStartPresets();

    titleInputShouldBeShown.value = form.title.length < 16;

    searchContacts();
});

// scheduled events

const { loadEventsAround, events, isLoading: eventsIsLoading } = useCalendarEvents();

const onUpdateMonthYear = useDebounceFn(({ month, year }) => {
    loadEventsAround(dayjs().month(month).year(year));
}, 400);

const debouncedLoadEventsAround = useDebounceFn(loadEventsAround, 400);

onBeforeMount(() => loadEventsAround(dayjs()));

watch(
    () => form.startOption,
    value => {
        if (value) {
            debouncedLoadEventsAround(form.start);
        }
    }
);
</script>
