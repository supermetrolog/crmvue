<template>
    <div class="timeline-step">
        <div class="row">
            <UiCol :cols="12">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="1. Знакомство с клиентом"
                    :success="step.additional === 1"
                    :paused="isPausedStep"
                    :step
                    :timeline
                >
                    <span>
                        1.1. Изучите деятельность компании клиента, свяжитесь с контактным лицом и
                        обсудите задачу
                    </span>
                    <template #footer>
                        <div class="d-flex gap-2">
                            <TimelineButton
                                @click="setAsCompleted"
                                color="success"
                                :active="data.additional === 1 || isCompletedStep"
                                :disabled="
                                    disabled ||
                                    data.additional === 1 ||
                                    isCompletedStep ||
                                    isPausedStep
                                "
                            >
                                <span>Подтвердить</span>
                                <i class="fa-solid fa-thumbs-up icon"></i>
                            </TimelineButton>
                            <TimelineButton @click="companyFormIsVisible = true" color="danger">
                                <span>Редактировать</span>
                                <i class="fa-solid fa-pen icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                v-if="isPausedStep"
                                @click="setAsProcessed"
                                :disabled="disabled || isCompletedStep"
                                color="success"
                            >
                                <span>Снять с паузы</span>
                                <i class="fa-regular fa-circle-play icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                v-else
                                @click="pausedFormIsVisible = true"
                                :disabled="disabled || data.additional === 1 || isCompletedStep"
                                color="warning"
                            >
                                <span>Шаг на паузу</span>
                                <i class="fa-regular fa-circle-pause icon"></i>
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </UiCol>
            <div class="col-12">
                <CompanyPreview
                    v-if="company"
                    @logo-updated="onLogoUpdated"
                    @edit="companyFormIsVisible = true"
                    :company
                />
                <EmptyData v-else>Компания не найдена в базе..</EmptyData>
            </div>
            <div class="col-12">
                <hr />
            </div>
            <div class="col-12">
                <CompanyBoxContactList
                    @edit="startContactEditing"
                    @create="companyContactFormIsVisible = true"
                    :loading="contactsIsLoading"
                    :contacts="contacts"
                />
            </div>
        </div>
        <teleport to="body">
            <FormCompanyContact
                v-if="companyContactFormIsVisible"
                @close="cancelContactEditing"
                @updated="fetchCompanyContacts"
                @created="fetchCompanyContacts"
                :company_id="company.id"
                :formdata="editableContact"
            />
            <FormCompany
                v-if="companyFormIsVisible"
                @close="companyFormIsVisible = false"
                @updated="onCompanyUpdated"
                :form-data="company"
            />
            <UiModal
                v-model:visible="pausedFormIsVisible"
                @closed="clearForm"
                title="Постановка шага на паузу"
                :width="500"
            >
                <UiForm>
                    <UiFormGroup>
                        <UiDateInput
                            v-model="pauseDate"
                            :min-date="new Date()"
                            presets-label="Пауза на"
                            :presets="pausePresets"
                            required
                            placeholder="Выберите дату.."
                            label="Дата продолжения шага"
                            class="col-12"
                        />
                        <UiTextarea
                            v-model="pauseComment"
                            label="Комментарий"
                            :min-height="50"
                            :max-height="150"
                            auto-height
                            class="col-12"
                        />
                    </UiFormGroup>
                </UiForm>
                <template #actions="{ close }">
                    <UiButton
                        @click="setAsPaused"
                        color="success-light"
                        icon="fa-regular fa-circle-pause"
                        :disabled="!Boolean(pauseDate)"
                    >
                        Поставить на паузу
                    </UiButton>
                    <UiButton @click="close" color="light" icon="fa-solid fa-ban">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import EmptyData from '@/components/common/EmptyData.vue';
import CompanyPreview from '@/components/Company/Preview/CompanyPreview.vue';
import { computed, onMounted, ref, toRef } from 'vue';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';
import { useRoute } from 'vue-router';
import CompanyBoxContactList from '@/components/Company/Box/CompanyBoxContactList.vue';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import dayjs from 'dayjs';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import TimelineStepPauseComment from '@/components/Timeline/Step/TimelineStepPauseComment.vue';

const emit = defineEmits(['update-step', 'updated-objects', 'next-step']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const { company, contacts, data, isCompletedStep, generatePayload, timeline } = useTimelineContext(
    toRef(props, 'step')
);

const { isLoading } = useDelayedLoader();

// company manipulation

const store = useStore();
const route = useRoute();

const companyContactFormIsVisible = ref(false);
const companyFormIsVisible = ref(false);
const editableContact = ref(null);

const { isLoading: contactsIsLoading } = useDelayedLoader(true);

async function fetchCompany() {
    return await store.dispatch('FETCH_COMPANY', route.params.id);
}

async function fetchCompanyContacts(withLoader = false) {
    if (withLoader) contactsIsLoading.value = true;

    await store.dispatch('FETCH_COMPANY_CONTACTS', route.params.id);

    if (withLoader) contactsIsLoading.value = false;
}

async function onCompanyUpdated() {
    isLoading.value = true;

    await Promise.all([fetchCompany(), fetchCompanyContacts()]);

    isLoading.value = false;
}

function startContactEditing(contact) {
    editableContact.value = contact;
    companyContactFormIsVisible.value = true;
}

function cancelContactEditing() {
    companyContactFormIsVisible.value = false;
    editableContact.value = null;
}

function onLogoUpdated(logo) {
    store.commit('setCompanyLogo', logo);
}

onMounted(() => {
    fetchCompanyContacts(true);
});

// events

function setAsCompleted() {
    emit(
        'update-step',
        generatePayload({ negative: 0, date: null, additional: 1, comment: null }),
        true
    );
}

const pausedFormIsVisible = ref(false);
const pauseDate = ref(null);
const pauseComment = ref(null);

const pausePresets = [
    {
        value: dayjs().add(1, 'day').toDate(),
        label: '1 день'
    },
    {
        value: dayjs().add(2, 'day').toDate(),
        label: '2 дня'
    },
    {
        value: dayjs().add(3, 'day').toDate(),
        label: '3 дня'
    },
    {
        value: dayjs().add(5, 'day').toDate(),
        label: '5 дней'
    },
    {
        value: dayjs().add(7, 'day').toDate(),
        label: 'Неделю'
    },
    {
        value: dayjs().add(14, 'day').toDate(),
        label: '2 недели'
    }
];

function clearForm() {
    pauseDate.value = null;
    pauseComment.value = null;
}

function setAsPaused() {
    emit(
        'update-step',
        generatePayload({
            negative: 1,
            additional: 0,
            date: dayjs(pauseDate.value).toJSON(),
            comment: pauseComment.value
        })
    );

    pausedFormIsVisible.value = false;
    clearForm();
}

function setAsProcessed() {
    emit('update-step', generatePayload({ negative: 0, date: null, comment: null }));
}

const isPausedStep = computed(() => props.step.negative && props.step.additional !== 1);
</script>
