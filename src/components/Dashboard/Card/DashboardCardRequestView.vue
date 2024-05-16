<template>
    <div class="dashboard-card-request">
        <div class="dashboard-card-request__wrapper">
            <div class="dashboard-card-request__header">
                <i
                    v-if="request.expressRequest"
                    v-tippy="'Экспресс-запрос'"
                    class="fa-solid fa-fire medium-icon dashboard-cl-danger"
                ></i>
                <span class="dashboard-card-request__date"></span>
                <div class="dashboard-card-request__functions">
                    <HoverActionsButton
                        v-if="editable"
                        @click="$emit('edit')"
                        label="Редактировать"
                    >
                        <i class="fa-solid fa-plus"></i>
                    </HoverActionsButton>
                    <HoverActionsButton
                        v-if="editable"
                        @click="$emit('complete')"
                        label="Завершить"
                    >
                        <i class="fa-solid fa-ban"></i>
                    </HoverActionsButton>
                    <HoverActionsButton @click="$emit('view')" label="Подробнее">
                        <i class="fa-solid fa-eye"></i>
                    </HoverActionsButton>
                </div>
            </div>
            <div class="dashboard-card-request__body">
                <p class="dashboard-card-request__company">{{ companyName }}</p>
                <p class="dashboard-card-request__address" v-html="address"></p>
                <div class="dashboard-card-request__parameters">
                    <div class="dashboard-card-request__parameter">
                        <span>Статус</span>
                        <DashboardChip :class="statusClass">
                            <div class="d-flex align-items-center">
                                <span>{{ status }}</span>
                                <i
                                    v-if="request.status == 0"
                                    v-tippy="statusTippy"
                                    class="fa-regular fa-question-circle ml-2 icon"
                                />
                            </div>
                        </DashboardChip>
                    </div>
                    <div class="dashboard-card-request__parameter">
                        <span>Переезд</span>
                        <DashboardChip :class="statusClass">
                            <div class="d-flex align-items-center">
                                <span>{{ status }}</span>
                                <i
                                    v-if="request.status == 0"
                                    v-tippy="statusTippy"
                                    class="fa-regular fa-question-circle ml-2 icon"
                                />
                            </div>
                        </DashboardChip>
                    </div>
                </div>
                <div class="dashboard-card-request__timeline">
                    <p>{{ dealType }}</p>
                    <Progress :percent="request.timeline_progress" />
                </div>
            </div>
            <div class="dashboard-card-request__footer">
                <Avatar
                    v-tippy="'Консультант: ' + request.consultant.userProfile.medium_name"
                    :src="request.consultant.userProfile.avatar"
                    size="35"
                />
            </div>
        </div>
    </div>
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Avatar from '@/components/common/Avatar.vue';
import { alg } from '@/utils/alg.js';
import { entityOptions } from '@/const/options/options.js';
import Progress from '@/components/common/Progress.vue';
import { PassiveWhyRequest } from '@/const/const.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

export default {
    name: 'DashboardCardRequestView',
    components: { DashboardChip, Progress, Avatar, HoverActionsButton },
    emits: ['edit', 'complete', 'view'],
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
        companyName() {
            if (!this.request.company || this.request.company?.noName)
                return 'Компания #' + this.request.company_id;

            if (alg.isNumeric(this.request.company.nameRu))
                return 'Компания №' + this.request.company.nameRu;

            let companyName = this.request.company.nameRu;
            if (this.request.company.nameEng) companyName += ' - ' + this.request.company.nameEng;

            return companyName;
        },
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
                      .map(element => entityOptions.location.region[element.region])
                      .join(', ')
                : '';

            const distanceMKAD = !this.request.distanceFromMKADnotApplicable
                ? `До ${this.request.distanceFromMKAD} км до МКАД`
                : '';

            return [regions, distanceMKAD, directions, districts]
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
        }
    }
};
</script>
