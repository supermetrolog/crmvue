<template>
    <div v-if="editMode">
        <VueEditor
            v-model="localComment"
            :v
            :min-height="50"
            :max-height="150"
            :toolbar="false"
            placeholder="Что выяснили? Какое положение по компании? Опишите ситуацию.."
            class="w-100"
            autofocus
        />
        <div class="d-flex gap-2 mt-1">
            <UiButton
                @click="$emit('update', localComment)"
                mini
                icon="fa-solid fa-check"
                color="success-light"
            >
                Сохранить
            </UiButton>
            <UiButton @click="$emit('cancel')" mini icon="fa-solid fa-ban" color="light">
                Отмена
            </UiButton>
            <UiButton @click="$emit('delete')" mini icon="fa-solid fa-trash" color="light">
                Удалить
            </UiButton>
        </div>
    </div>
    <UiClamped v-else @expanded="$emit('expanded')" @hidden="$emit('hidden')" button-class="fs-2">
        <div class="d-inline-flex">
            <i class="fs-2 mr-1">{{ updatedAt }}. {{ authorLabel }}.</i>
            <div ref="comment" class="company-table-item-summary-survey__comment d-inline"></div>
        </div>
    </UiClamped>
</template>

<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify.js';
import UiClamped from '@/components/common/UiClamped.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';
import { UserRoleEnum } from '@/types/user';

defineEmits(['expanded', 'hidden', 'cancel', 'update', 'delete']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    company: {
        type: Object,
        required: true
    },
    editMode: Boolean
});

useLinkify(
    computed(() => props.message.message),
    useTemplateRef('comment')
);

// edit

const localComment = ref(props.message.message);

const updatedAt = computed(() => {
    return toDateFormat(props.message.updated_at, 'D.MM.YY');
});

const { currentUserId } = useAuth();

const authorLabel = computed(() => {
    if (props.message.from.model.id === currentUserId.value) {
        return 'Вы';
    }

    if (props.message.from.model.role === UserRoleEnum.SYSTEM) {
        if (props.company.last_survey) {
            if (props.company.last_survey.user.id === currentUserId.value) {
                return 'Вы';
            }

            return props.company.last_survey.user.userProfile.short_name;
        }

        return 'Система';
    }

    return props.message.from.model.userProfile.short_name;
});
</script>
