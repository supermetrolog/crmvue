<template>
    <div class="timeline-step">
        <teleport to="body">
            <FormModalEvent
                v-if="notificationFormIsVisible"
                @close="notificationFormIsVisible = false"
                @created="onEventUpdated"
                @updated="onEventUpdated"
                :formdata="{ consultant_id: THIS_USER.id }"
            />
            <FormCompanyContact
                v-if="companyContactFormIsVisible"
                @closeCompanyForm="cancelContactEditing"
                @updated="fetchCompanyContacts"
                :company_id="COMPANY.id"
                :formdata="editableContact"
            />
            <FormCompany
                v-if="companyFormIsVisible"
                @closeCompanyForm="companyFormIsVisible = false"
                @updated="onCompanyUpdated"
                :formdata="COMPANY"
            />
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="Знакомство с клиентом"
                    :success="step.additional === 1"
                >
                    <span>
                        Шаг 1. Изучите деятельность компании клиента, свяжитесь с контактным лицом и
                        обсудите задачу
                    </span>
                    <template #footer>
                        <div class="d-flex gap-2">
                            <Button
                                @click="selectPhone"
                                success
                                :active="data.additional === 1"
                                :disabled="disabled"
                                solid
                                icon
                            >
                                <span>Поговорил</span>
                                <i class="fa-solid fa-check icon"></i>
                            </Button>
                            <Button
                                @click="notificationFormIsVisible = true"
                                :active="data.additional === 2"
                                :disabled="disabled"
                                solid
                                icon
                            >
                                <span>Перезвонить</span>
                                <i class="fa-solid fa-clock-rotate-left icon"></i>
                            </Button>
                            <Button
                                @click="selectNegative"
                                danger
                                :active="data.negative"
                                :disabled="disabled"
                                solid
                                icon
                            >
                                <span>Не дозвонился</span>
                                <i class="fa-solid fa-frown-open icon"></i>
                            </Button>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-8 pb-2">
                <h3 class="text-center mb-3">Компания клиента</h3>
                <Company
                    v-if="COMPANY"
                    @start-editing="companyFormIsVisible = true"
                    :company="COMPANY"
                    class="ml-1"
                />
                <EmptyData v-else>Компания не найдена в базе..</EmptyData>
            </div>
            <div class="col-4">
                <h3 class="text-center mb-1">Контакты</h3>
                <CompanyContactList
                    @start-editing="startContactEditing"
                    class="inner-y"
                    :contacts="COMPANY_CONTACTS"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import Button from '@/components/common/Button.vue';
import {
    CallbackComment,
    CallingErrorComment,
    PhonedComment
} from '@/components/Timeline/comments.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import dayjs from 'dayjs';
import { TimelineStepMixin } from '@/components/Timeline/mixins.js';
import CompanyContactList from '@/components/Company/Contact/CompanyContactList.vue';
import Company from '@/components/Company/Company.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import FormModalEvent from '@/components/Forms/FormModalEvent.vue';

export default {
    name: 'TimelineStepMeetingActivity',
    components: {
        FormModalEvent,
        EmptyData,
        Company,
        CompanyContactList,
        Button,
        TimelineInfo,
        FormCompany,
        FormCompanyContact
    },
    mixins: [TimelineStepMixin],
    setup() {
        const { isLoading } = useDelayedLoader();
        return { isLoading };
    },
    data() {
        return {
            companyContactFormIsVisible: false,
            companyFormIsVisible: false,
            notificationFormIsVisible: false,
            editableContact: null
        };
    },
    computed: {
        ...mapGetters(['COMPANY', 'COMPANY_CONTACTS', 'THIS_USER'])
    },
    methods: {
        ...mapActions([
            'FETCH_COMPANY',
            'FETCH_COMPANY_CONTACTS',
            'DELETE_CONTACT',
            'CREATE_CONTACT_COMMENT'
        ]),
        async onCompanyUpdated() {
            this.isLoading = true;
            await Promise.all([this.fetchCompany(), this.fetchCompanyContacts()]);
            this.isLoading = false;
        },
        async fetchCompany() {
            await this.FETCH_COMPANY(this.$route.params.id);
        },
        async fetchCompanyContacts(withLoader = false) {
            if (withLoader) this.isLoading = true;
            await this.FETCH_COMPANY_CONTACTS(this.$route.params.id);
            if (withLoader) this.isLoading = false;
        },
        startContactEditing(contact) {
            this.editableContact = contact;
            this.companyContactFormIsVisible = true;
        },
        cancelContactEditing() {
            this.companyContactFormIsVisible = false;
            this.editableContact = null;
        },
        onEventUpdated(event) {
            this.notificationFormIsVisible = false;
            this.selectCallback(event);
        },
        selectPhone() {
            let goToNext = false;

            if (this.data.additional === 1) {
                this.data.additional = 0;
                this.data.newActionComments = [];
            } else {
                this.data.additional = 1;
                this.data.newActionComments = [new PhonedComment(this.data)];
                goToNext = true;
            }

            this.data.negative = 0;
            this.data.date = null;
            this.$emit('update-step', this.data, goToNext);
        },
        selectNegative() {
            if (this.data.negative) {
                this.data.negative = 0;
                this.data.newActionComments = [];
            } else {
                this.data.negative = 1;
                this.data.additional = 0;
                this.data.date = null;
                this.data.newActionComments = [new CallingErrorComment(this.data)];
            }

            this.$emit('update-step', this.data);
        },
        selectCallback(newCalendarEvent) {
            this.data.additional = 2;
            this.data.date = newCalendarEvent.startDate;
            this.data.newActionComments = [
                new CallbackComment(this.data, dayjs(this.data.date).format('D.MM.YYYY, HH:mm:ss'))
            ];
            this.data.negative = 0;

            this.$emit('update-step', this.data);
        }
    },
    created() {
        this.fetchCompanyContacts(true);
    }
};
</script>

<style></style>
