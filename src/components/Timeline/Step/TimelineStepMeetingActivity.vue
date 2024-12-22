<template>
    <div class="timeline-step">
        <teleport to="body">
            <!--            <FormModalEvent-->
            <!--                v-if="notificationFormIsVisible"-->
            <!--                @close="notificationFormIsVisible = false"-->
            <!--                @created="onEventUpdated"-->
            <!--                @updated="onEventUpdated"-->
            <!--                :formdata="{ consultant_id: currentUserId }"-->
            <!--            />-->
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
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="1. Знакомство с клиентом"
                    :success="step.additional === 1"
                >
                    <span>
                        1.1. Изучите деятельность компании клиента, свяжитесь с контактным лицом и
                        обсудите задачу
                    </span>
                    <template #footer>
                        <div class="d-flex gap-2">
                            <TimelineButton
                                @click="selectPhone"
                                success
                                :active="data.additional === 1"
                                :disabled
                            >
                                <span>Подтвердить</span>
                                <i class="fa-solid fa-thumbs-up icon"></i>
                            </TimelineButton>
                            <TimelineButton @click="companyFormIsVisible = true" danger>
                                <span>Редактировать</span>
                                <i class="fa-solid fa-pen icon"></i>
                            </TimelineButton>
                            <TimelineButton @click="selectNegative" :active="data.negative" warning>
                                <span>Шаг на паузу</span>
                                <i class="fa-regular fa-circle-pause icon"></i>
                            </TimelineButton>
                            <!--                            <TimelineButton-->
                            <!--                                @click="notificationFormIsVisible = true"-->
                            <!--                                :active="data.additional === 2"-->
                            <!--                                :disabled-->
                            <!--                                solid-->
                            <!--                                icon-->
                            <!--                            >-->
                            <!--                                <span>Перезвонить</span>-->
                            <!--                                <i class="fa-solid fa-clock-rotate-left icon"></i>-->
                            <!--                            </TimelineButton>-->
                        </div>
                    </template>
                </TimelineInfo>
            </div>
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
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { CallingErrorComment, PhonedComment } from '@/components/Timeline/comments.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import EmptyData from '@/components/common/EmptyData.vue';
import CompanyPreview from '@/components/Company/Preview/CompanyPreview.vue';
import { onMounted, ref } from 'vue';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';
import { useRoute } from 'vue-router';
import CompanyBoxContactList from '@/components/Company/Box/CompanyBoxContactList.vue';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

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

const { company, contacts, data } = useTimelineContext(() => props.step);

const { isLoading } = useDelayedLoader();

const companyContactFormIsVisible = ref(false);
const companyFormIsVisible = ref(false);
// const notificationFormIsVisible = ref(false);
const editableContact = ref(null);

// company manipulation

const store = useStore();
const route = useRoute();

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

// events

// function onEventUpdated(event) {
//     notificationFormIsVisible.value = false;
//     selectCallback(event);
// }

function selectPhone() {
    let goToNext = false;

    if (data.value.additional === 1) {
        data.value.additional = 0;
        data.value.newActionComments = [];
    } else {
        data.value.additional = 1;
        data.value.newActionComments = [new PhonedComment(data.value)];
        goToNext = true;
    }

    data.value.negative = 0;
    data.value.date = null;

    emit('update-step', data.value, goToNext);
}

function selectNegative() {
    if (data.value.negative) {
        data.value.negative = 0;
        data.value.newActionComments = [];
    } else {
        data.value.negative = 1;
        data.value.additional = 0;
        data.value.date = null;
        data.value.newActionComments = [new CallingErrorComment(data.value)];
    }

    emit('update-step', data.value);
}

// function selectCallback(newCalendarEvent) {
//     data.value.additional = 2;
//     data.value.date = newCalendarEvent.startDate;
//     data.value.newActionComments = [
//         new CallbackComment(data.value, dayjs(data.value.date).format('D.MM.YYYY, HH:mm:ss'))
//     ];
//     data.value.negative = 0;
//
//     emit('update-step', data.value);
// }

onMounted(() => {
    fetchCompanyContacts(true);
});
</script>
