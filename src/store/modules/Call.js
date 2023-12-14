import api from "@/api/api";
import {notify} from "@kyvg/vue3-notification";

function viewNotify(data) {
    let notifyOptions = {
        group: "app",
        type: "success",
        duration: 5000,
    };
    const newCallCount = data;
    if (newCallCount) {

        if (newCallCount == 1) {
            notifyOptions.text = `У вас ${newCallCount} новый звонок`;
        } else {
            notifyOptions.text = `У вас ${newCallCount} новых звонков`;

        }
        notifyOptions.title = `Звонки`;

        notify(notifyOptions);
    }
}

const Call = {
    state: {
        calls: [],
        callsCount: 0,
        callsPagination: null,
        currentCalls: [],
        sessionCalls: [{
            id: 407,
            caller_id: "102",
            from: "101",
            to: "102",
            type: 1,
            created_at: "2022-08-17 13:06:15",
            uniqueid: "1660730774.17",
            status: 2,
            call_ended_status: null,
            updated_at: null,
            hangup_timestamp: null,
            caller: {
                id: 2,
                user_id: 3,
                first_name: "ADMIN",
                middle_name: "ADMIN",
                last_name: "ADMIN",
                caller_id: "102",
                avatar: null,
                full_name: "ADMIN ADMIN ADMIN",
                short_name: "ADMIN A. A.",
                medium_name: "ADMIN ADMIN",
            },
            phoneFrom: null,
            phoneTo: null,
        },
            {
                id: 380,
                caller_id: "102",
                from: "101",
                to: "102",
                type: 1,
                created_at: "2022-08-16 16:16:55",
                uniqueid: "1660655814.33",
                status: 2,
                call_ended_status: "CANCEL",
                updated_at: null,
                hangup_timestamp: null,
                caller: {
                    id: 2,
                    user_id: 3,
                    first_name: "ADMIN",
                    middle_name: "ADMIN",
                    last_name: "ADMIN",
                    caller_id: "102",
                    avatar: null,
                    full_name: "ADMIN ADMIN ADMIN",
                    short_name: "ADMIN A. A.",
                    medium_name: "ADMIN ADMIN",
                },
                phoneFrom: {
                    id: 95472,
                    contact_id: 42967,
                    phone: "101",
                    exten: null,
                    contact: {
                        id: 42967,
                        company_id: 10000,
                        middle_name: null,
                        last_name: null,
                        type: 0,
                        created_at: "2022-08-10 15:26:28",
                        updated_at: null,
                        consultant_id: 3,
                        position: 0,
                        faceToFaceMeeting: 0,
                        warning: 0,
                        good: 1,
                        status: 1,
                        first_name: "asterisk",
                        passive_why: null,
                        passive_why_comment: null,
                        warning_why_comment: null,
                        position_unknown: 0,
                        isMain: null,
                        full_name: "asterisk",
                        short_name: "A.",
                        first_and_last_name: "asterisk",
                        company: {
                            id: 10000,
                            nameEng: "test",
                            nameRu: "тест",
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
                            description: "aaaaaa",
                            created_at: "2022-06-17 16:54:44",
                            updated_at: "2022-08-10 13:52:01",
                            active: 1,
                            formOfOrganization: 3,
                            processed: 0,
                            passive_why: null,
                            passive_why_comment: null,
                            rating: 5,
                            latitude: null,
                            longitude: null,
                            nameBrand: "brand",
                            progress_percent: 89,
                            request_count: 19,
                            offer_count: 17,
                            object_count: 76,
                            created_at_format: "Jun 17, 2022, 7:54:44 PM",
                            updated_at_format: "Aug 10, 2022, 4:52:01 PM",
                            full_name: "ПАО тест - test - brand",
                        },
                    },
                },
                phoneTo: null,
            },
            {
                id: 381,
                caller_id: "102",
                from: "102",
                to: "101",
                type: 0,
                created_at: "2022-08-16 16:17:11",
                uniqueid: "1660655830.35",
                status: 2,
                call_ended_status: null,
                updated_at: null,
                hangup_timestamp: null,
                caller: {
                    id: 2,
                    user_id: 3,
                    first_name: "ADMIN",
                    middle_name: "ADMIN",
                    last_name: "ADMIN",
                    caller_id: "102",
                    avatar: null,
                    full_name: "ADMIN ADMIN ADMIN",
                    short_name: "ADMIN A. A.",
                    medium_name: "ADMIN ADMIN",
                },
                phoneFrom: null,
                phoneTo: {
                    id: 95472,
                    contact_id: 42967,
                    phone: "101",
                    exten: null,
                    contact: {
                        id: 42967,
                        company_id: 10000,
                        middle_name: null,
                        last_name: null,
                        type: 0,
                        created_at: "2022-08-10 15:26:28",
                        updated_at: null,
                        consultant_id: 3,
                        position: 0,
                        faceToFaceMeeting: 0,
                        warning: 0,
                        good: 1,
                        status: 1,
                        first_name: "asterisk",
                        passive_why: null,
                        passive_why_comment: null,
                        warning_why_comment: null,
                        position_unknown: 0,
                        isMain: null,
                        full_name: "asterisk",
                        short_name: "A.",
                        first_and_last_name: "asterisk",
                        company: {
                            id: 10000,
                            nameEng: "test",
                            nameRu: "тест",
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
                            description: "aaaaaa",
                            created_at: "2022-06-17 16:54:44",
                            updated_at: "2022-08-10 13:52:01",
                            active: 1,
                            formOfOrganization: 3,
                            processed: 0,
                            passive_why: null,
                            passive_why_comment: null,
                            rating: 5,
                            latitude: null,
                            longitude: null,
                            nameBrand: "brand",
                            progress_percent: 53,
                            request_count: 29,
                            offer_count: 27,
                            object_count: 51,
                            created_at_format: "Jun 17, 2022, 7:54:44 PM",
                            updated_at_format: "Aug 10, 2022, 4:52:01 PM",
                            full_name: "ПАО тест - test - brand",
                        },
                    },
                },
            },
        ],
    },
    mutations: {
        updateCalls(state, {data, concat = false}) {
            state.callsPagination = data.pagination;
            if (concat) {
                state.calls = state.calls.concat(data.data);
            } else {
                state.calls = data.data;
            }
        },
        updateCallsCount(state, data) {
            state.callsCount = data;
        },
        updateCurrentCalls(state, data) {
            state.currentCalls = data;
        },
        pushSessionCalls(state, data) {
            state.sessionCalls = state.sessionCalls.concat(data);
        },
        updateSessionCalls(state, data) {
            state.sessionCalls = data;
        },
        reset(state) {
            state.calls = [];
            state.callsPagination = null;
        },
    },
    actions: {
        async FETCH_CALLS_COUNT(context) {
            const user = context.getters.THIS_USER;
            const count = await api.calls.fetchCount(user.userProfile.caller_id);
            context.commit('updateCallsCount', count);
        },
        async SEARCH_CALLS(context, {query, concat = false}) {
            const data = await api.calls.search(query);
            context.commit('updateCalls', {data, concat});
        },
        RESET_CALLS(context) {
            context.commit('reset');
        },
        async FETCH_CALLS_COUNT_POOL(context) {
            const socket = context.getters.SOCKET;
            if (!context.getters.SETED_USER_ID_FLAG) {
                return;
            }
            await socket.send(JSON.stringify({
                action: 'sendPool',
                data: {
                    action: 'check_calls_count',
                    message: null
                }
            }));
        },
        async VIEWED_NOT_COUNT_CALLS({getters}) {
            return await api.calls.viewedNotCount(getters.THIS_USER.userProfile.caller_id);
        },
        async VIEWED_ALL_CALLS({getters}) {
            return await api.calls.viewedAll(getters.THIS_USER.userProfile.caller_id);
        },
        async UPDATE_SESSION_CALLS(context) {
            let data = await api.calls.search({
                id: context.getters.SESSION_CALLS.map(item => item.id).join(',')
            })
            context.commit('updateSessionCalls', data.data);
        },
        ACTION_WEBSOCKET_new_calls(context, data) {
            viewNotify(data.message);
            context.dispatch('FETCH_CALLS_COUNT');
        },
        ACTION_WEBSOCKET_check_calls_count(context) {
            context.dispatch('FETCH_CALLS_COUNT');
        },
        ACTION_WEBSOCKET_update_current_calls({commit, dispatch}, data) {
            commit('updateCurrentCalls', data.message);
            commit('pushSessionCalls', data.message);
            dispatch("UPDATE_SESSION_CALLS");
        },
    },
    getters: {
        CALLS(state) {
            return state.calls;
        },
        CALLS_COUNT(state) {
            return state.callsCount;
        },
        CALLS_PAGINATION(state) {
            return state.callsPagination;
        },
        CURRENT_CALLS(state) {
            return state.currentCalls;
        },
        SESSION_CALLS(state) {
            return state.sessionCalls;
        }
    }
}

export default Call