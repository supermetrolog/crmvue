<template>
    <div class="messenger-quiz-header">
        <Spinner v-if="loading" />
        <div v-else-if="recipient" class="row">
            <div class="col-6">
                <div class="messenger-quiz-header__info">
                    <p class="messenger-quiz-header__username">
                        <i
                            v-if="recipient.faceToFaceMeeting"
                            v-tippy="'Была личная (очная) встреча'"
                            class="fa-solid fa-street-view mr-1"
                        />
                        <i
                            v-if="recipient.good"
                            v-tippy="'Хорошие взаимоотношения'"
                            class="fa-regular fa-face-smile-beam mr-1"
                        />
                        <i
                            v-if="recipient.isMain"
                            v-tippy="'Основной контакт'"
                            class="fa-solid fa-crown mr-1"
                        />
                        <span>{{ recipient.full_name }}</span>
                        <span
                            v-if="hasFullnameWarning"
                            class="messenger-quiz-header__username-warning color-warning"
                        >
                            [ФИО заполнено не полностью]
                        </span>
                    </p>
                    <p class="messenger-quiz-header__staff">
                        <span v-if="recipient.position">
                            {{ position }}
                        </span>
                        <span v-else-if="recipient.position_unknown">Должность неизвестна..</span>
                        <span v-else class="color-warning">Должность не заполнена!</span>
                    </p>
                    <p class="messenger-quiz-header__email">
                        <template v-if="mainEmail">
                            <i v-tippy="'Основной Email'" class="fa-solid fa-crown mr-1"></i>
                            <span>{{ mainEmail.email }}</span>
                        </template>
                        <span v-else-if="recipient.emails?.length">
                            {{ recipient.emails[0].email }}
                        </span>
                        <span v-else class="color-warning">Email не заполнен!</span>
                    </p>
                    <div
                        v-if="recipient.warning"
                        v-tippy="recipient.warning_why_comment"
                        class="messenger-quiz-header__warning"
                    >
                        <span>Внимание! {{ recipient.warning_why_comment }}</span>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="messenger-quiz-header__contacts">
                    <p v-if="mainPhone">
                        <i v-tippy="'Основной телефон'" class="fa-solid fa-crown mr-1"></i>
                        <PhoneNumber
                            :phone="mainPhone"
                            :contact="recipient"
                            class="messenger-quiz-header__phone"
                        />
                    </p>
                    <PhoneNumber
                        v-for="phone in phones"
                        :key="phone.id"
                        :phone="phone"
                        :contact="recipient"
                        class="messenger-quiz-header__phone"
                    />
                </div>
            </div>
            <div class="col-3">
                <div class="messenger-quiz-header__actions">
                    <HoverActionsButton
                        @click="commentsIsOpen = true"
                        small
                        :disabled="!recipient.comments?.length"
                        label="Посмотреть комментарии"
                        class="position-relative"
                    >
                        <span
                            class="messenger-quiz-header__comments"
                            :class="{
                                'dashboard-bg-gray': recipient.comments?.length === 0,
                                'dashboard-bg-danger': recipient.comments?.length > 0
                            }"
                        >
                            {{ recipient.comments?.length }}
                        </span>
                        <i class="fa-solid fa-comments"></i>
                    </HoverActionsButton>
                    <HoverActionsButton
                        @click="$emit('edit')"
                        :disabled="isCompanyContact"
                        small
                        label="Редактировать контакт"
                    >
                        <i class="fa-solid fa-pen" />
                    </HoverActionsButton>
                    <HoverActionsButton
                        @click="moveContact"
                        :disabled="isCompanyContact"
                        small
                        label="Перенести контакт [В разработке]"
                    >
                        <i class="fa-solid fa-code-compare"></i>
                    </HoverActionsButton>
                    <HoverActionsButton
                        @click="deleteContact"
                        :disabled="isCompanyContact"
                        small
                        label="Удалить контакт [В разработке]"
                    >
                        <i class="fa-solid fa-trash" />
                    </HoverActionsButton>
                </div>
            </div>
        </div>
        <div v-else class="messenger-quiz-header__empty">
            <DashboardChip class="dashboard-chip--with-icon dashboard-bg-light text-dark">
                <i class="fa-solid fa-phone-slash"></i>
            </DashboardChip>
            <p>Без контакта</p>
        </div>
        <div class="messenger-quiz-header__more">
            <p>{{ pluralContactsCount }}</p>
            <HoverActionsButton
                @click="$emit('change')"
                class="ml-auto"
                small
                label="Изменить контакт"
            >
                <i class="fa-solid fa-arrow-right" />
            </HoverActionsButton>
        </div>
        <Modal
            @close="commentsIsOpen = false"
            :title="
                recipient
                    ? `Просмотр комментариев (${recipient.comments?.length})`
                    : 'Просмотр комментариев'
            "
            :width="600"
            :show="commentsIsOpen"
        >
            <DashboardChip class="dashboard-bg-warning-l mb-3 w-100 text-center">
                <i class="fa-solid fa-exclamation-triangle mr-2" />
                <span>Раздел в разработке. Сейчас доступен в режиме просмотра.</span>
            </DashboardChip>
            <div class="messenger-quiz-header-comments">
                <div v-if="recipient.comments.length" class="messenger-quiz-header-comments__list">
                    <DashboardChip
                        v-for="comment in recipient.comments"
                        :key="comment.id"
                        class="dashboard-bg-success-l w-100"
                    >
                        <p>{{ comment.comment }}</p>
                        <small class="text-grey">{{ toDateFormat(comment.created_at) }}</small>
                    </DashboardChip>
                </div>
                <EmptyData v-else>Список комментариев пуст..</EmptyData>
                <div class="messenger-quiz-header-comments__footer mt-3">
                    <Button @click="commentsIsOpen = false" small>Закрыть</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, shallowRef } from 'vue';
import plural from 'plural-ru';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Spinner from '@/components/common/Spinner.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import { toDateFormat } from '@/utils/formatter.js';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useNotify } from '@/utils/useNotify.js';

const emit = defineEmits(['change', 'edit']);
const props = defineProps({
    recipient: {
        type: [Object, null],
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const store = useStore();
const notify = useNotify();

const commentsIsOpen = shallowRef(false);

const company = computed(() => store.state.Messenger.currentPanel);

const pluralContactsCount = computed(() => {
    return plural(company.value?.contacts?.length, '+%d контакт', '+%d контакта', '+%d контактов');
});

const position = computed(() => contactOptions.position[props.recipient.position]);
const mainPhone = computed(() => {
    return props.recipient.phones.find(phone => phone.isMain);
});
const mainEmail = computed(() => {
    return props.recipient.emails.find(email => email.isMain);
});

const isCompanyContact = computed(() => props.recipient.type === 1);
const phones = computed(() => props.recipient.phones.filter(element => !element.isMain));
const hasFullnameWarning = computed(() => {
    return (
        !props.recipient.last_name || !props.recipient.first_name || !props.recipient.middle_name
    );
});

const moveContact = () => {
    notify.info('Функция находится в разработке..', 'Функция недоступна');
};

const deleteContact = () => {
    notify.info('Функция находится в разработке..', 'Функция недоступна');
};
</script>
