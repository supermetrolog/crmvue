<template>
    <div class="timeline-page-header">
        <div class="d-flex align-items-center">
            <h2 class="timeline-page-header__title">{{ title }}</h2>
            <TimelineStatus class="mx-2" :request="request" :disabled="timeline.status === 0" />
            <div class="timeline-page-header__consultants d-flex gap-2 ml-auto">
                <Button
                    v-for="timelineItem in timelineList"
                    :key="timelineItem.id"
                    @click="changeTimeline(timelineItem.consultant_id)"
                    :info="!isViewedUser(timelineItem.consultant.id)"
                >
                    {{ timelineItem.consultant.userProfile.short_name }}
                </Button>
            </div>
            <div class="timeline-page-header__functions d-flex gap-2 ml-2">
                <Button @click="disableFormIsVisible = true" danger :disabled="disabled">
                    Завершить
                </Button>
                <Button @click="dealFormIsVisible = true" :disabled="disabled">
                    Создать сделку
                </Button>
                <Button warning :disabled="true">Передать</Button>
                <Button warning :disabled="true">Отказатся</Button>
            </div>
        </div>
        <div class="mt-2 d-flex gap-3">
            <Button @click="$emit('change-tab', 'main')" :info="currentTab !== 'main'">
                Прохождение Таймлайна
            </Button>
            <Button
                v-tippy="messagesTippy"
                @click="$emit('change-tab', 'log')"
                :class="{ 'animate__animated animate__flash': messagesHasAnimation }"
                :badge="messagesCount"
                :info="currentTab !== 'log'"
            >
                Логи Таймлайна
            </Button>
        </div>
        <teleport to="body">
            <FormModalCompanyRequestDisable
                v-if="disableFormIsVisible"
                @close="disableFormIsVisible = false"
                @disabled="onDisabledTimeline"
                :request_id="request.id"
            />
            <FormCompanyDeal
                v-if="dealFormIsVisible"
                @close="dealFormIsVisible = false"
                @created="onCreatedDeal"
                :company_id="request.company_id"
                :request_id="request.id"
                :deal-type="request.dealType"
                :is-our-deal="true"
            />
        </teleport>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Button from '@/components/common/Button.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import TimelineStatus from '@/components/Timeline/TimelineStatus.vue';

export default {
    name: 'TimelineHeader',
    components: {
        TimelineStatus,
        FormCompanyDeal,
        FormModalCompanyRequestDisable,
        Button
    },
    emits: ['change-tab'],
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        request: {
            type: Object,
            required: true
        },
        currentTab: {
            type: String,
            default: 'main'
        },
        title: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            disableFormIsVisible: false,
            dealFormIsVisible: false,
            messagesHasAnimation: false,
            messagesAnimation: null
        };
    },
    computed: {
        ...mapGetters({ timelineList: 'TIMELINE_LIST', timeline: 'TIMELINE' }),
        messagesCount() {
            return this.timeline.timelineSteps.reduce(
                (total, current) => total + current.timelineActionComments?.length,
                0
            );
        },
        messagesTippy() {
            const totalText = 'Всего сообщений по таймлайну: ' + this.messagesCount + '<br>';

            const currentStep = this.timeline.timelineSteps[Number(this.$route.query.step) || 0];

            if (!currentStep) return totalText;

            const localText =
                'Сообщений на текущем шаге: ' + currentStep.timelineActionComments?.length;

            return totalText + localText;
        }
    },
    watch: {
        messagesCount(newValue, oldValue) {
            if (newValue > oldValue) this.createAnimation();
        }
    },
    methods: {
        async onCreatedDeal() {
            await this.$store.dispatch('FETCH_COMPANY_REQUESTS', this.request.company_id);
            this.$emit('close');
        },
        async onDisabledTimeline() {
            await this.$store.dispatch('FETCH_COMPANY_REQUESTS', this.request.company_id);
            this.$emit('close');
        },
        async changeTimeline(consultant_id) {
            let query = {
                ...this.$route.query
            };

            query.consultant_id = consultant_id;
            query.step = 0;

            await this.$router.push({ query: query });
        },
        isViewedUser(userID) {
            return Number(this.$route.query.consultant_id) === Number(userID);
        },
        clearAnimation() {
            clearTimeout(this.messagesAnimation);
            this.messagesAnimation = null;
        },
        createAnimation() {
            this.clearAnimation();
            this.messagesHasAnimation = true;

            setTimeout(() => {
                this.messagesHasAnimation = false;
                this.clearAnimation();
            }, 1000);
        }
    },
    beforeUnmount() {
        this.clearAnimation();
    }
};
</script>
