<template>
    <EventSchedulerModal @close="$emit('close')" @submit="submit" :title :loading="isCreating">
        <EventSchedulerModalBase
            v-model:form="form"
            :v="v$"
            :contact
            :company
            :chat-member-id
            :labels="{
                date: 'Дата планируемой встречи'
            }"
            :placeholders="{
                comment: 'Комментарий к запланированной встрече..'
            }"
        />
    </EventSchedulerModal>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, maxLength, minLength, required } from '@vuelidate/validators';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth.js';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { toServerDate } from '@/utils/formatters/date.ts';
import EventSchedulerModalBase from '@/components/EventScheduler/EventSchedulerModalBase.vue';
import EventSchedulerModal from '@/components/EventScheduler/EventSchedulerModal.vue';

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

const { currentUserId } = useAuth();

const form = reactive({
    start: null,
    startOption: null,
    title: generateTaskTitle(),
    comment: null,
    contact_id: props.contact?.id,
    user_id: currentUserId.value
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

function formToPayload() {
    return {
        title: form.title,
        message: form.comment,
        start: toServerDate(form.start),
        end: toServerDate(dayjs(form.start).add(1, 'days')),
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
</script>
