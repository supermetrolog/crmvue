<template>
    <div class="timeline-logs">
        <teleport to="body">
            <LetterViewModal
                v-if="letterViewIsVisible"
                @close="letterViewIsVisible = false"
                :letterID="viewingLetterID"
            />
        </teleport>
        <div class="timeline-logs__scroller row">
            <div class="col-12">
                <Accordion @changed="tabSwitched" :default-tab-hash="step.id">
                    <AccordionItem
                        v-for="timelineStep in TIMELINE.timelineSteps"
                        :id="timelineStep.id"
                        :key="timelineStep.id"
                        :title="
                            timelineStepOptions[timelineStep.number].label +
                            ` (${timelineStep.timelineActionComments.length})`
                        "
                        :title-classes="
                            timelineStep.status === 1 ? 'success_block' : 'warning_block'
                        "
                    >
                        <div class="timeline-logs__wrapper">
                            <TimelineComments
                                @view="viewLetter"
                                :data="timelineStep.timelineActionComments"
                            />
                            <Form :ref="'#' + timelineStep.id" @submit="onSubmit(timelineStep)">
                                <FormGroup v-if="!disabled">
                                    <Textarea
                                        v-model="form.comment"
                                        class="col-12"
                                        :v="v$.form.comment"
                                        :disabled="loader"
                                        placeholder="Добавьте комментарий по процессу"
                                    />
                                    <Submit success class="col-4 mx-auto mt-1" :disabled="loader">
                                        Добавить
                                    </Submit>
                                </FormGroup>
                            </Form>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Timeline } from '@/const/const';
import Form from '@/components/common/Forms/Form.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Accordion from '@/components/common/Accordion/Accordion.vue';
import AccordionItem from '@/components/common/Accordion/AccordionItem.vue';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api';
import TimelineComments from '@/components/Timeline/TimelineComments.vue';
import LetterViewModal from '@/components/common/Letter/LetterViewModal.vue';

export default {
    name: 'TimelineExtraBlock',
    components: {
        LetterViewModal,
        TimelineComments,
        Form,
        Textarea,
        Submit,
        FormGroup,
        Accordion,
        AccordionItem
    },
    props: {
        step: {
            type: Object
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            form: {
                comment: null
            },
            currentTimelineStepId: this.step.id,
            scrollingTimeout: null,
            letterViewIsVisible: false,
            viewingLetterID: null
        };
    },
    computed: {
        ...mapGetters(['TIMELINE_COMMENTS', 'TIMELINE', 'THIS_USER']),
        timelineStepOptions: () => Timeline
    },
    validations() {
        return {
            form: {
                comment: {
                    required: helpers.withMessage('Введите комментарий', required)
                }
            }
        };
    },
    watch: {
        step() {
            this.currentTimelineStepId = this.step.id;
        }
    },
    methods: {
        tabSwitched(item) {
            this.scrollToFormDelay(item.tab.hash);
        },
        scrollToFormDelay(hash) {
            clearTimeout(this.scrollingTimeout);
            this.scrollingTimeout = setTimeout(() => this.scrollToForm(hash), 500);
        },
        scrollToForm(hash) {
            if (!hash) return;

            this.$refs[hash][0].$el.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                alignToTop: false
            });
        },
        async onSubmit(step) {
            this.v$.$validate();

            if (this.v$.form.$error) return;

            this.loader = true;
            const comments = [
                {
                    timeline_id: step.timeline_id,
                    timeline_step_id: step.id,
                    timeline_step_number: step.number,
                    title: this.THIS_USER.userProfile.short_name,
                    comment: this.form.comment,
                    type: 3
                }
            ];

            if (await api.timeline.addActionComments(comments)) {
                this.$emit('commentAdded');
                this.form.comment = null;
                this.v$.$reset();
                this.scrollToFormDelay('#' + step.id);
            }

            this.loader = false;
        },
        async viewLetter(letterID) {
            this.viewingLetterID = letterID;
            this.letterViewIsVisible = true;
        }
    },
    beforeUnmount() {
        clearTimeout(this.scrollingTimeout);
    }
};
</script>
