<template>
    <div class="dashboard-card-request">
        <div class="dashboard-card-request__wrapper">
            <div
                class="dashboard-card-request__header"
                :class="{
                    'dashboard-bg-danger-l': isDisabled,
                    'dashboard-bg-success': isCompleted
                }"
            >
                <i
                    v-if="request.expressRequest && !isCompleted"
                    v-tippy="'Экспресс-запрос'"
                    class="fa-solid fa-fire medium-icon dashboard-cl-danger"
                ></i>
                <span
                    class="dashboard-card-request__date"
                    :class="{ 'dashboard-cl-white': isCompleted }"
                >
                    Обновлено {{ updatedAt }}
                </span>
                <div class="dashboard-card-request__functions">
                    <HoverActionsButton
                        v-if="editable"
                        @click="$emit('edit')"
                        label="Редактировать"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </HoverActionsButton>
                    <template v-if="editable && !isCompleted">
                        <UiButtonIcon
                            @click="$emit('toggle-disable')"
                            :label="isDisabled ? 'Восстановить' : 'Завершить'"
                        >
                            <i
                                class="fa-solid"
                                :class="isDisabled ? 'fa-rotate-right' : 'fa-ban'"
                            />
                        </UiButtonIcon>
                    </template>
                    <router-link
                        v-if="request.consultant_id === currentUser.id"
                        :to="`/companies/${request.company_id}?request_id=${request.id}&consultant_id=${currentUser.id}&step=0`"
                        target="_blank"
                    >
                        <HoverActionsButton label="Открыть таймлайн">
                            <i class="fa-solid fa-timeline"></i>
                        </HoverActionsButton>
                    </router-link>
                    <UiButtonIcon @click="$emit('view')" label="Подробнее" icon="fa-solid fa-eye" />
                    <UiButtonIcon
                        @click="$emit('to-chat')"
                        label="Открыть в чате"
                        icon="fa-solid fa-comment"
                    />
                </div>
            </div>
            <div class="dashboard-card-request__body">
                <p class="dashboard-card-request__company">
                    {{ companyName }}
                </p>
                <p class="dashboard-card-request__address" v-html="address"></p>
                <div class="dashboard-card-request__parameters">
                    <div class="dashboard-card-request__parameter">
                        <p class="dashboard-card-request__parameter-name">Статус</p>
                        <DashboardChip :class="statusClass">
                            <div class="d-flex align-items-center">
                                <p>{{ status }}</p>
                                <UiTooltipIcon
                                    v-if="isDisabled"
                                    :tooltip="statusTippy"
                                    icon="fa-regular fa-question-circle"
                                    class="ml-2 icon"
                                />
                            </div>
                        </DashboardChip>
                    </div>
                    <div class="dashboard-card-request__parameter">
                        <p class="dashboard-card-request__parameter-name">Переезд</p>
                        <span>{{ movingDate }}</span>
                    </div>
                </div>
                <div class="dashboard-card-request__timeline">
                    <p>{{ dealType }}</p>
                    <Progress :percent="request.timeline_progress" />
                </div>
            </div>
            <div class="dashboard-card-request__footer">
                <Avatar
                    :label="'Консультант: ' + request.consultant.userProfile.medium_name"
                    :src="request.consultant.userProfile.avatar"
                    size="35"
                />
                <span class="dashboard-card-request__date">
                    Запрос #{{ request.id }}, {{ createdAt }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Avatar from '@/components/common/Avatar.vue';
import { entityOptions } from '@/const/options/options.js';
import Progress from '@/components/common/Progress.vue';
import { PassiveWhyRequest } from '@/const/const.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { mapGetters } from 'vuex';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

dayjs.extend(customParseFormat);

export default {
    name: 'DashboardCardRequest',
    components: {
        UiButtonIcon,
        UiTooltipIcon,
        DashboardChip,
        Progress,
        Avatar,
        HoverActionsButton
    },
    emits: ['edit', 'toggle-disable', 'view', 'to-chat'],
    props: {
        request: {
            type: Object,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER' }),
        address() {
            const directions = this.request.directions?.length
                ? '<b>Московская область:</b> ' +
                  this.request.directions
                      .map(
                          element =>
                              entityOptions.location.directionWithShort[element.direction].full
                      )
                      .join(', ')
                : '';

            const districts = this.request.districts?.length
                ? '<b>Москва:</b> ' +
                  this.request.districts
                      .map(element => entityOptions.location.district[element.district])
                      .join(', ')
                : '';

            const regions = this.request.regions?.length
                ? this.request.regions
                      .map(element => this.$formatter.text().ucFirst(element.info.title))
                      .join(', ')
                : '';

            const distanceMKAD = !this.request.distanceFromMKADnotApplicable
                ? `До ${this.request.distanceFromMKAD} км до МКАД`
                : '';

            const stateMKAD =
                this.request.outside_mkad !== null
                    ? `<b>${entityOptions.location.positionMKAD[this.request.outside_mkad]}</b>`
                    : '';

            return [regions, stateMKAD, distanceMKAD, directions, districts]
                .filter(element => element.length)
                .join('; ');
        },
        dealType() {
            return this.$formatter.text().ucFirst(this.request.format_name);
        },
        status() {
            if (this.request.status === 0) return 'Пассив';
            else if (this.request.status === 1) return 'Актив';
            return 'Завершен';
        },
        statusClass() {
            if (this.request.status === 0) return 'dashboard-bg-danger-l';
            else if (this.request.status === 1) return 'dashboard-bg-success-l';
            return 'dashboard-bg-success dashboard-cl-white';
        },
        statusTippy() {
            let text = PassiveWhyRequest[this.request.passive_why].label;
            if (this.request.passive_why_comment) text += ': ' + this.request.passive_why_comment;
            return text;
        },
        createdAt() {
            return dayjs(this.request.created_at).format('D.MM.YY, HH:mm');
        },
        updatedAt() {
            let dayjsDate = dayjs(this.request.created_at, 'YYYY-MM-DD HH:mm:ss');

            if (this.request.related_updated_at) {
                const date = dayjs(this.request.related_updated_at, 'YYYY-MM-DD HH:mm:ss');
                if (dayjsDate.isBefore(date)) dayjsDate = date;
            }

            if (this.request.updated_at) {
                const date = dayjs(this.request.updated_at, 'YYYY-MM-DD HH:mm:ss');
                if (dayjsDate.isBefore(date)) dayjsDate = date;
            }

            if (dayjsDate.isToday()) return `сегодня, ${dayjsDate.format('HH:mm')}`;
            if (dayjsDate.isYesterday()) return `вчера, ${dayjsDate.format('HH:mm')}`;
            return dayjsDate.format('D.MM.YY, HH:mm');
        },
        movingDate() {
            if (this.request.movingDate && this.request.unknownMovingDate === null)
                return dayjs(this.request.movingDate, 'YYYY-MM-DD').format('D.MM.YY');

            return '-';
        },
        isCompleted() {
            return this.request.status === 2;
        },
        isDisabled() {
            return this.request.status === 0;
        },
        companyName() {
            return getCompanyName(this.request.company, this.request.company_id);
        }
    }
};
</script>
