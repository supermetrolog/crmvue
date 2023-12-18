<template>
    <div class="caller-manager__list">
        <CallerManagerListItem
            v-for="call in SESSION_CALLS"
            :key="call.id"
            @clickItem="clickItem"
            :class="{ active: activeItem == call }"
            :call="call"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CallerManagerListItem from '@/components/CallerManager/CallerManagerListItem.vue';

export default {
    name: 'CallerManagerList',
    components: {
        CallerManagerListItem
    },
    props: {
        activeItem: {
            type: Object
        }
    },
    data() {
        return {
            sessionCalls: [
                {
                    id: 407,
                    caller_id: '102',
                    from: '101',
                    to: '102',
                    type: 1,
                    created_at: '2022-08-17 13:06:15',
                    uniqueid: '1660730774.17',
                    status: 2,
                    call_ended_status: null,
                    updated_at: null,
                    hangup_timestamp: null,
                    caller: {
                        id: 2,
                        user_id: 3,
                        first_name: 'ADMIN',
                        middle_name: 'ADMIN',
                        last_name: 'ADMIN',
                        caller_id: '102',
                        avatar: null,
                        full_name: 'ADMIN ADMIN ADMIN',
                        short_name: 'ADMIN A. A.',
                        medium_name: 'ADMIN ADMIN'
                    },
                    phoneFrom: null,
                    phoneTo: null
                },
                {
                    id: 380,
                    caller_id: '102',
                    from: '101',
                    to: '102',
                    type: 1,
                    created_at: '2022-08-16 16:16:55',
                    uniqueid: '1660655814.33',
                    status: 2,
                    call_ended_status: 'CANCEL',
                    updated_at: null,
                    hangup_timestamp: null,
                    caller: {
                        id: 2,
                        user_id: 3,
                        first_name: 'ADMIN',
                        middle_name: 'ADMIN',
                        last_name: 'ADMIN',
                        caller_id: '102',
                        avatar: null,
                        full_name: 'ADMIN ADMIN ADMIN',
                        short_name: 'ADMIN A. A.',
                        medium_name: 'ADMIN ADMIN'
                    },
                    phoneFrom: {
                        id: 95472,
                        contact_id: 42967,
                        phone: '101',
                        exten: null,
                        contact: {
                            id: 42967,
                            company_id: 10000,
                            middle_name: null,
                            last_name: null,
                            type: 0,
                            created_at: '2022-08-10 15:26:28',
                            updated_at: null,
                            consultant_id: 3,
                            position: 0,
                            faceToFaceMeeting: 0,
                            warning: 0,
                            good: 1,
                            status: 1,
                            first_name: 'asterisk',
                            passive_why: null,
                            passive_why_comment: null,
                            warning_why_comment: null,
                            position_unknown: 0,
                            isMain: null,
                            full_name: 'asterisk',
                            short_name: 'A.',
                            first_and_last_name: 'asterisk',
                            company: {
                                id: 10000,
                                nameEng: 'test',
                                nameRu: 'тест',
                                noName: 0,
                                companyGroup_id: null,
                                officeAdress: null,
                                status: 1,
                                consultant_id: 3,
                                broker_id: null,
                                legalAddress: null,
                                ogrn: null,
                                inn: null,
                                kpp: null,
                                checkingAccount: null,
                                correspondentAccount: null,
                                inTheBank: null,
                                bik: null,
                                okved: null,
                                okpo: null,
                                signatoryName: null,
                                signatoryMiddleName: null,
                                signatoryLastName: null,
                                basis: null,
                                documentNumber: null,
                                activityGroup: 0,
                                activityProfile: 0,
                                description: 'aaaaaa',
                                created_at: '2022-06-17 16:54:44',
                                updated_at: '2022-08-10 13:52:01',
                                active: 1,
                                formOfOrganization: 3,
                                processed: 0,
                                passive_why: null,
                                passive_why_comment: null,
                                rating: 5,
                                latitude: null,
                                longitude: null,
                                nameBrand: 'brand',
                                progress_percent: 89,
                                request_count: 19,
                                offer_count: 17,
                                object_count: 76,
                                created_at_format: 'Jun 17, 2022, 7:54:44 PM',
                                updated_at_format: 'Aug 10, 2022, 4:52:01 PM',
                                full_name: 'ПАО тест - test - brand'
                            }
                        }
                    },
                    phoneTo: null
                },
                {
                    id: 381,
                    caller_id: '102',
                    from: '102',
                    to: '101',
                    type: 0,
                    created_at: '2022-08-16 16:17:11',
                    uniqueid: '1660655830.35',
                    status: 2,
                    call_ended_status: null,
                    updated_at: null,
                    hangup_timestamp: null,
                    caller: {
                        id: 2,
                        user_id: 3,
                        first_name: 'ADMIN',
                        middle_name: 'ADMIN',
                        last_name: 'ADMIN',
                        caller_id: '102',
                        avatar: null,
                        full_name: 'ADMIN ADMIN ADMIN',
                        short_name: 'ADMIN A. A.',
                        medium_name: 'ADMIN ADMIN'
                    },
                    phoneFrom: null,
                    phoneTo: {
                        id: 95472,
                        contact_id: 42967,
                        phone: '101',
                        exten: null,
                        contact: {
                            id: 42967,
                            company_id: 10000,
                            middle_name: null,
                            last_name: null,
                            type: 0,
                            created_at: '2022-08-10 15:26:28',
                            updated_at: null,
                            consultant_id: 3,
                            position: 0,
                            faceToFaceMeeting: 0,
                            warning: 0,
                            good: 1,
                            status: 1,
                            first_name: 'asterisk',
                            passive_why: null,
                            passive_why_comment: null,
                            warning_why_comment: null,
                            position_unknown: 0,
                            isMain: null,
                            full_name: 'asterisk',
                            short_name: 'A.',
                            first_and_last_name: 'asterisk',
                            company: {
                                id: 10000,
                                nameEng: 'test',
                                nameRu: 'тест',
                                noName: 0,
                                companyGroup_id: null,
                                officeAdress: null,
                                status: 1,
                                consultant_id: 3,
                                broker_id: null,
                                legalAddress: null,
                                ogrn: null,
                                inn: null,
                                kpp: null,
                                checkingAccount: null,
                                correspondentAccount: null,
                                inTheBank: null,
                                bik: null,
                                okved: null,
                                okpo: null,
                                signatoryName: null,
                                signatoryMiddleName: null,
                                signatoryLastName: null,
                                basis: null,
                                documentNumber: null,
                                activityGroup: 0,
                                activityProfile: 0,
                                description: 'aaaaaa',
                                created_at: '2022-06-17 16:54:44',
                                updated_at: '2022-08-10 13:52:01',
                                active: 1,
                                formOfOrganization: 3,
                                processed: 0,
                                passive_why: null,
                                passive_why_comment: null,
                                rating: 5,
                                latitude: null,
                                longitude: null,
                                nameBrand: 'brand',
                                progress_percent: 53,
                                request_count: 29,
                                offer_count: 27,
                                object_count: 51,
                                created_at_format: 'Jun 17, 2022, 7:54:44 PM',
                                updated_at_format: 'Aug 10, 2022, 4:52:01 PM',
                                full_name: 'ПАО тест - test - brand'
                            }
                        }
                    }
                }
            ]
        };
    },
    computed: {
        ...mapGetters(['CURRENT_CALLS', 'SESSION_CALLS'])
    },
    watch: {
        SESSION_CALLS() {
            if (!this.activeItem) return;
            let item = this.SESSION_CALLS.find(item => item.id == this.activeItem.id);
            if (item) {
                this.$emit('updateItem', item);
            }
        }
    },
    methods: {
        clickItem(call) {
            this.$emit('clickItem', call);
        }
    }
};
</script>

<style></style>
