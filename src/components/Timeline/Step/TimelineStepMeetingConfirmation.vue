<template>
    <div class="timeline-step">
        <teleport to="body">
            <FormCompanyRequest
                v-if="companyRequestFormIsVisible"
                @closeCompanyForm="companyRequestFormIsVisible = false"
                @updated="fetchCompanyRequests"
                :formdata="currentRequest"
            />
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="Знакомство с клиентом"
                    :success="step.done"
                >
                    <p>
                        Шаг 2. Проверьте правильность заполнения запроса, отредактируйте при
                        необходимости и затем утвердите
                    </p>
                    <template #footer>
                        <Button
                            @click="selectDone"
                            success
                            solid
                            :active="data.done"
                            :disabled="disabled"
                        >
                            Отлично, идём дальше
                        </Button>
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-12">
                <Loader v-if="isLoading" />
                <CompanyRequestItemAlt
                    @start-editing="companyRequestFormIsVisible = true"
                    :request="currentRequest"
                    edit-only
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { TimelineStepMixin } from '@/components/Timeline/mixins.js';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import Button from '@/components/common/Button.vue';
import { MeetingDoneComment } from '@/components/Timeline/comments.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import CompanyRequestItemAlt from '@/components/Company/Request/CompanyRequestItemAlt.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'TimelineStepMeetingConfirmation',
    components: {
        Loader,
        CompanyRequestItemAlt,
        Button,
        TimelineInfo,
        FormCompanyRequest
    },
    mixins: [TimelineStepMixin],
    setup() {
        const { isLoading } = useDelayedLoader();
        return { isLoading };
    },
    data() {
        return {
            companyRequestFormIsVisible: false
        };
    },
    computed: {
        ...mapGetters(['COMPANY', 'COMPANY_CONTACTS'])
    },
    methods: {
        async fetchCompanyRequests() {
            this.isLoading = true;
            await this.$store.dispatch('FETCH_COMPANY_REQUESTS', this.$route.params.id);
            this.isLoading = false;
        },
        selectDone() {
            if (this.data.done) {
                this.data.done = 0;
                this.data.newActionComments = [];
                this.data.status = 0;
            } else {
                this.data.done = 1;
                this.data.status = 1;
                this.data.newActionComments = [new MeetingDoneComment(this.data)];
            }
            this.$emit('update-step', this.data, this.data.done);
        }
    }
};
</script>

<style></style>
