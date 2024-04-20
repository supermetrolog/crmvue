<template>
    <div class="messenger-quiz-question">
        <AccordionSimple opened>
            <template #title>
                <div class="messenger-quiz-question__header">
                    <i
                        v-if="hasFullAnswer"
                        class="fa-solid fa-circle-check color-success animate__animated animate__tada"
                    ></i>
                    <i
                        v-else-if="form.answer !== null"
                        class="fa-solid fa-circle-exclamation color-warning animate__animated animate__pulse"
                    ></i>
                    <i
                        v-else
                        class="fa-solid fa-circle-exclamation color-danger animate__animated animate__flash"
                    ></i>
                    <p class="messenger-quiz-question__title">
                        {{ question.text }}
                    </p>
                    <RadioGroup v-model="form.answer" unselect />
                    <AccordionSimpleTrigger />
                </div>
            </template>
            <template #body>
                <div class="messenger-quiz-question__additions">
                    <CheckboxChip
                        v-for="addition in question.additions"
                        :key="addition.id"
                        v-model="form.additions"
                        :value="addition.id"
                        :text="addition.label"
                    />
                </div>
                <Textarea
                    v-model="form.description"
                    placeholder="Описание.."
                    class="messenger-quiz-question__field"
                    auto-height
                />
                <div class="messenger-quiz-question__interests">
                    <CheckboxChip
                        v-for="interest in question.interests"
                        :key="interest.id"
                        v-model="form.interests"
                        :value="interest.id"
                        :text="interest.label"
                    />
                </div>
            </template>
        </AccordionSimple>
    </div>
</template>
<script>
import RadioGroup from '@/components/common/Forms/RadioGroup.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';

export default {
    name: 'MessengerQuizQuestion',
    components: { AccordionSimpleTrigger, AccordionSimple, Textarea, CheckboxChip, RadioGroup },
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            form: {
                answer: null,
                additions: [],
                interests: [],
                description: ''
            }
        };
    },
    computed: {
        hasFullAnswer() {
            return (
                this.form.answer !== null &&
                this.form.description.length &&
                this.form.additions.length
            );
        }
    }
};
</script>
