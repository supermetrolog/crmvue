<template>
    <DashboardCard class="dashboard-stats-block dashboard-stats-requests">
        <template #header>
            <div class="dashboard-stats-block__header">
                <h3 class="dashboard-card__title">Последние запросы</h3>
                <MessengerButton @click="fetchRequests">Обновить</MessengerButton>
            </div>
        </template>
        <div class="row">
            <template v-if="isLoading">
                <div class="col-12">
                    <Spinner center />
                </div>
            </template>
            <template v-else>
                <div class="col-12">
                    <DashboardTablePrimitive
                        v-if="requests.length"
                        :columns="columns"
                        :items="requests"
                        class="no-padding"
                    >
                        <template #id="{ item }">
                            <div class="d-flex align-items-center">
                                <i
                                    v-if="item.expressRequest"
                                    v-tippy="'Экспресс-запрос'"
                                    class="fa-solid fa-fire medium-icon dashboard-cl-danger mr-1"
                                ></i>
                                <router-link
                                    v-if="item.consultant_id == currentUser.id"
                                    :to="`/companies/${item.company_id}?request_id=${item.id}&consultant_id=${currentUser.id}&step=0`"
                                    target="_blank"
                                    class="mr-1 d-inline-flex"
                                >
                                    <i class="fa-solid fa-up-right-from-square dashboard-linker" />
                                </router-link>
                                <span> #{{ item.id }} </span>
                            </div>
                        </template>
                        <template #consultant="{ item }">
                            <div class="d-flex align-items-center">
                                <Avatar :src="item.consultant.userProfile.avatar" :size="35" />
                                <span class="ml-2">
                                    {{ item.consultant.userProfile.medium_name }}
                                </span>
                            </div>
                        </template>
                        <template #company="{ item }">
                            <span v-if="item.company">{{ getCompanyName(item.company) }}</span>
                            <span v-else>Компания #{{ item.company_id }}</span>
                        </template>
                        <template #deal="{ item }">
                            {{ $formatter.text().ucFirst(item.format_name) }}
                        </template>
                        <template #progress="{ item }">
                            <Progress :percent="item.timeline_progress" />
                        </template>
                        <template #status="{ item }">
                            <DashboardChip :class="getStatusClass(item.status)">
                                <div class="d-flex align-items-center">
                                    <span>{{ getStatus(item.status) }}</span>
                                    <i
                                        v-if="item.status == 0"
                                        v-tippy="getStatusTippy(item)"
                                        class="fa-regular fa-question-circle ml-2 icon"
                                    />
                                </div>
                            </DashboardChip>
                        </template>
                        <template #address="{ item }">
                            <span
                                class="dashboard-stats-requests__address"
                                v-html="getAddress(item)"
                            ></span>
                        </template>
                        <template #updated_at="{ item }">
                            {{ getUpdatedAt(item) }}
                        </template>
                    </DashboardTablePrimitive>
                    <EmptyData v-else>Список запросов пуст..</EmptyData>
                </div>
            </template>
        </div>
    </DashboardCard>
</template>

<script>
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import api from '@/api/api.js';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import DashboardTablePrimitive from '@/components/Dashboard/Table/DashboardTablePrimitive.vue';
import Avatar from '@/components/common/Avatar.vue';
import { alg } from '@/utils/alg.js';
import Progress from '@/components/common/Progress.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { PassiveWhyRequest } from '@/const/const.js';
import Spinner from '@/components/common/Spinner.vue';
import { entityOptions } from '@/const/options/options.js';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';

export default {
    name: 'DashboardStatsRequests',
    components: {
        Spinner,
        DashboardChip,
        Progress,
        Avatar,
        DashboardTablePrimitive,
        MessengerButton,
        EmptyData,
        DashboardCard
    },
    mixins: [LoaderMixin],
    inject: ['$openMessengerChat'],
    props: {
        user: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            loadingState: false,
            requests: [],
            columns: [
                {
                    key: 'id',
                    label: 'ID',
                    width: '85px'
                },
                {
                    key: 'consultant',
                    label: 'Консультант'
                },
                {
                    key: 'company',
                    label: 'Компания'
                },
                {
                    key: 'deal',
                    label: 'Тип сделки'
                },
                {
                    key: 'progress',
                    label: 'Прогресс'
                },
                {
                    key: 'status',
                    label: 'Статус',
                    width: '100px'
                },
                {
                    key: 'address',
                    label: 'Адрес',
                    width: '300px'
                },
                {
                    key: 'updated_at',
                    label: 'Обновлено'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER' }),
        originalLoader() {
            return this.loadingState;
        }
    },
    watch: {
        user() {
            this.fetchRequests();
        }
    },
    methods: {
        async fetchRequests() {
            this.loadingState = true;

            const userParams = this.user ? { consultant_id: this.user } : {};

            const response = await api.request.searchRequests({
                ...userParams,
                sort: '-related_updated_at,-updated_at'
            });

            if (response) this.requests = response.data.slice(0, 10);
            else this.requests = [];

            this.loadingState = false;
        },
        openInChat(chatMemberID) {
            this.$openMessengerChat({
                chatMemberID: chatMemberID
            });
        },
        getCompanyName(company) {
            if (alg.isNumeric(company.nameRu)) return 'Компания #' + company.nameRu;

            return company.nameRu + (company.nameEng ? ` - ${company.nameEng}` : '');
        },
        getStatus(status) {
            switch (status) {
                case 0:
                    return 'Пассив';
                case 1:
                    return 'Актив';
                case 2:
                    return 'Завершен';
            }
        },
        getStatusClass(status) {
            switch (status) {
                case 0:
                    return 'dashboard-bg-danger-l';
                case 1:
                    return 'dashboard-bg-success-l';
                case 2:
                    return 'dashboard-bg-success dashboard-cl-white';
            }
        },
        getStatusTippy(item) {
            let text = PassiveWhyRequest[item.passive_why].label;

            if (item.passive_why_comment) text += ': ' + item.passive_why_comment;

            return text;
        },
        getAddress(item) {
            const directions = item.directions?.length
                ? '<b>Московская область:</b> ' +
                  item.directions
                      .map(
                          element =>
                              entityOptions.location.directionWithShort[element.direction].full
                      )
                      .join(', ')
                : '';

            const districts = item.districts?.length
                ? '<b>Москва:</b> ' +
                  item.districts
                      .map(element => entityOptions.location.district[element.district])
                      .join(', ')
                : '';

            const regions = item.regions?.length
                ? item.regions
                      .map(element => this.$formatter.text().ucFirst(element.info.title))
                      .join(', ')
                : '';

            const distanceMKAD = !item.distanceFromMKADnotApplicable
                ? `До ${item.distanceFromMKAD} км до МКАД`
                : '';

            const stateMKAD =
                item.outside_mkad !== null
                    ? `<b>${entityOptions.location.positionMKAD[item.outside_mkad]}</b>`
                    : '';

            return [regions, stateMKAD, distanceMKAD, directions, districts]
                .filter(element => element.length)
                .join('; ');
        },
        getUpdatedAt(item) {
            let dayjsDate = dayjs(item.created_at, 'YYYY-MM-DD HH:mm:ss');

            if (item.related_updated_at) {
                const date = dayjs(item.related_updated_at, 'YYYY-MM-DD HH:mm:ss');
                if (dayjsDate.isBefore(date)) dayjsDate = date;
            }

            if (item.updated_at) {
                const date = dayjs(item.updated_at, 'YYYY-MM-DD HH:mm:ss');
                if (dayjsDate.isBefore(date)) dayjsDate = date;
            }

            if (dayjsDate.isToday()) return `сегодня, ${dayjsDate.format('HH:mm')}`;
            if (dayjsDate.isYesterday()) return `вчера, ${dayjsDate.format('HH:mm')}`;
            return dayjsDate.format('D.MM.YY, HH:mm');
        }
    },
    created() {
        this.fetchRequests();
    }
};
</script>
