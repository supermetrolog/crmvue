<template>
    <EventSchedulerModal @close="$emit('close')" @submit="submit" :title :loading="isCreating">
        <EventSchedulerModalBase
            v-model:form="form"
            :v="v$"
            :contact
            :company
            :chat-member-id="chatMemberId"
        />
    </EventSchedulerModal>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, maxLength, minLength, required } from '@vuelidate/validators';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import EventSchedulerModal from '@/components/EventScheduler/EventSchedulerModal.vue';
import EventSchedulerModalBase from '@/components/EventScheduler/EventSchedulerModalBase.vue';

const emit = defineEmits(['close', 'created']);
const props = defineProps({
    company: Object,
    contact: Object,
    chatMemberId: Number,
    relations: {
        type: Array,
        default: () => []
    }
});

const title = computed(() => {
    if (props.contact) {
        return `Запланировать действие | ${props.contact.full_name}`;
    }

    if (props.company) {
        return `Запланировать действие | ${props.company.full_name}`;
    }

    return 'Запланировать действие';
});

const form = reactive({
    start: dayjs().add(1, 'month').toDate(),
    startOption: 6,
    title: null,
    comment: null,
    contact_id: props.contact?.id
});

const { v$, validate } = useValidation(
    {
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
    },
    form
);

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
        start: form.start,
        end: dayjs(form.start).add(5, 'days').toDate(),
        user_id: currentUserId.value,
        relations: generateTaskRelations(),
        type: 'scheduled_event'
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

        const response = await api.task.create(payload);

        notify.success('Действие успешно запланировано');

        emit('created', response, payload);
        emit('close');
    } finally {
        isCreating.value = false;
    }
}
</script>
