<template>
    <section class="dashboard-requests-page">
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12 mb-2 d-flex align-items-center">
                    <h1>Запросы</h1>
                    <DashboardTargetUser v-model="targetUser" class="ml-2" />
                </div>
            </div>
            <Form class="dashboard-requests-page__form mb-4">
                <FormGroup class="justify-content-between">
                    <FormCompanyRequestSearch class="col-12 col-lg-6 col-xl-8" without-consultant />
                    <div class="col-12 col-lg-6 col-xl-4 col-xxl-3">
                        <div class="d-flex align-items-end">
                            <MultiSelect
                                v-model="sortingOption"
                                label="Сортировка"
                                placeholder="Выберите сортировку"
                                :options="sortingOptions"
                                class="w-100"
                            />
                            <Button @click="fetchRequests" class="ml-2">Обновить</Button>
                        </div>
                    </div>
                </FormGroup>
            </Form>
            <div v-show="!isLoading" v-if="requests.data?.length" class="row mb-2">
                <div class="col-12">
                    <PaginationClassic
                        @next="setNextPage"
                        :pagination="requests.pagination"
                        class="mb-2"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="dashboard-requests-table row">
                        <template v-if="isLoading">
                            <DashboardCardRequestSkeleton
                                v-for="i in 12"
                                :key="i"
                                class="col-12 col-md-6 col-lg-4 col-xxl-3"
                            />
                        </template>
                        <template v-else-if="requests.data?.length">
                            <DashboardCardRequest
                                v-for="request in requests.data"
                                :key="request.id"
                                @edit="editRequest(request)"
                                @toggle-disable="toggleDisableRequest(request)"
                                @view="viewRequest(request)"
                                :request="request"
                                :editable="userCanEdit(request)"
                                class="col-12 col-md-6 col-lg-4 col-xxl-3"
                            />
                        </template>
                        <div v-else class="col-12">
                            <EmptyData>Список запросов пуст..</EmptyData>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!isLoading" v-if="requests.data?.length" class="row mt-4">
                <div class="col-12">
                    <PaginationClassic
                        @next="setNextPage"
                        :pagination="requests.pagination"
                        class="mb-2"
                    />
                </div>
            </div>
        </div>
        <teleport to="body">
            <DashboardCardRequestView
                v-if="requestViewIsVisible"
                @close="requestViewIsVisible = false"
                @edit="editRequest(requestView)"
                @toggle-disable="toggleDisableRequest(requestView)"
                :editable="userCanEdit(requestView)"
                :request="requestView"
            />
            <FormModalCompanyRequestDisable
                @close="formCompleteIsVisible = false"
                @disabled="updateRequest(completeRequest)"
                :show="formCompleteIsVisible"
                :request_id="completeRequest.id"
            />
            <FormCompanyRequest
                v-if="formRequestIsVisible"
                @close="formRequestIsVisible = false"
                @updated="updateRequest(completeRequest)"
                :form-data="completeRequest"
            />
        </teleport>
    </section>
</template>
<script>
import DashboardTargetUser from '@/components/Dashboard/DashboardTargetUser.vue';
import { mapGetters } from 'vuex';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Button from '@/components/common/Button.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import api from '@/api/api.js';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import DashboardCardRequest from '@/components/Dashboard/Card/Request/DashboardCardRequest.vue';
import DashboardCardRequestSkeleton from '@/components/Dashboard/Card/Request/DashboardCardRequestSkeleton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import DashboardCardRequestView from '@/components/Dashboard/Card/Request/DashboardCardRequestView.vue';
import FormCompanyRequestSearch from '@/components/Forms/Company/FormCompanyRequestSearch.vue';
import { waitHash } from '@/utils/helpers/common/waitHash.js';

export default {
    name: 'DashboardRequests',
    components: {
        FormCompanyRequestSearch,
        DashboardCardRequestView,
        FormCompanyRequest,
        FormModalCompanyRequestDisable,
        EmptyData,
        DashboardCardRequestSkeleton,
        DashboardCardRequest,
        FormGroup,
        Form,
        MultiSelect,
        Button,
        PaginationClassic,
        DashboardTargetUser
    },
    mixins: [LoaderMixin],
    provide() {
        return {
            $targetUser: () => this.targetUser
        };
    },
    data() {
        return {
            requests: {
                data: [],
                pagination: {}
            },
            targetUser: null,
            sortingOption: '-related_updated_at',
            sortingOptions: [
                {
                    value: '-related_updated_at',
                    label: 'По обновлению таймлайна (сначала свежие)'
                },
                {
                    value: 'related_updated_at',
                    label: 'По обновлению таймлайна (сначала старые)'
                },
                { value: 'created_at', label: 'По дате создания (сначала старые)' },
                { value: '-created_at', label: 'По дате создания (сначала новые)' },
                {
                    value: 'updated_at',
                    label: 'По обновлению данных (сначала старые)'
                },
                {
                    value: '-updated_at',
                    label: 'По обновлению данных (сначала свежие)'
                }
            ],
            formCompleteIsVisible: false,
            formRequestIsVisible: false,
            requestViewIsVisible: false,
            requestView: null,
            completeRequest: null
        };
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    },
    watch: {
        targetUser() {
            this.fetchRequests();
        },
        '$route.query': function (newQuery, oldQuery) {
            if (waitHash(newQuery) !== waitHash(oldQuery)) {
                this.fetchRequests();
            }
        },
        async querySearch(value) {
            let query = { ...this.$route.query };

            if (value?.length) {
                query.all = value;
            } else {
                delete query.all;
            }

            await this.$router.replace({ query });
        },
        async sortingOption(value) {
            if (value) this.$router.replace({ query: { ...this.$route.query, sort: value } });
        }
    },
    methods: {
        async setNextPage(number) {
            let query = { ...this.$route.query };
            query.page = number;
            await this.$router.replace({ query });
        },
        async fetchRequests() {
            this.loadingState = true;

            const userParams = this.targetUser ? { consultant_id: this.targetUser.id } : {};
            const query = { ...this.$route.query, ...userParams };

            this.requests = await api.request.search(query);

            this.loadingState = false;
        },
        async toggleDisableRequest(request) {
            if (request.status === 0) {
                await api.request.undisable(request.id);
                this.updateRequest(request);
            } else {
                this.completeRequest = request;
                this.formCompleteIsVisible = true;
            }
        },
        async updateRequest(request) {
            const requestResponse = await api.request.search({
                id: request.id
            });

            if (requestResponse?.data?.length) {
                Object.assign(request, requestResponse.data[0]);
            }

            this.formCompleteIsVisible = false;
            this.formRequestIsVisible = false;
            this.completeRequest = null;
        },
        editRequest(request) {
            this.completeRequest = request;
            this.formRequestIsVisible = true;
        },
        userCanEdit(request) {
            return (
                Number(request.consultant_id) === Number(this.THIS_USER.id) ||
                this.$store.getters.isModerator
            );
        },
        async setQuery() {
            const query = { ...this.$route.query };

            if (this.$route.query.sort) this.sortingOption = this.$route.query.sort;
            else query.sort = this.sortingOption;

            await this.$router.replace({ query: query });
        },
        viewRequest(request) {
            this.requestView = request;
            this.requestViewIsVisible = true;
        }
    },
    async created() {
        this.targetUser = {
            id: this.THIS_USER.id,
            chat_member_id: this.THIS_USER.chat_member_id
        };

        await this.setQuery();
        this.fetchRequests();
    }
};
</script>
