<template>
    <div class="messenger-quiz-question">
        <AccordionSimple opened>
            <template #title>
                <div class="messenger-quiz-question__actions">
                    <Button @click="$emit('edit')" small>Редактировать</Button>
                    <Button @click="$emit('delete')" small>Удалить</Button>
                </div>
                <div class="messenger-quiz-question__header">
                    <p class="messenger-quiz-question__title">
                        <span class="mr-1">#{{ question.id }}</span>
                        <span>{{ question.text }}</span>
                    </p>
                    <div v-if="hasMainQuestion" class="messenger-quiz-question__main">
                        <RadioChip :value="true" unselect label="Да" />
                        <RadioChip :value="false" unselect label="Нет" />
                        <RadioChip unselect label="Не ответил" />
                    </div>
                    <MessengerButton
                        v-else
                        @click="$emit('add-answer', question.id, 'yes-no')"
                        color="success"
                        class="messenger-quiz-question__button"
                    >
                        <i class="fa-solid fa-plus mr-1" />
                        <span>Добавить "Да/Нет"</span>
                    </MessengerButton>
                    <AccordionSimpleTrigger />
                </div>
            </template>
            <template #body>
                <DashboardChip class="dashboard-bg-warning-l mb-1"> Основные опции </DashboardChip>
                <div class="messenger-quiz-question__additions">
                    <template v-if="hasTabQuestions">
                        <CheckboxChip
                            v-for="answer in checkboxTabs"
                            :key="answer.id"
                            @icon-clicked="$emit('edit-answer', answer)"
                            handled-icon
                            :value="answer.id"
                            :text="answer.value"
                            icon="fa-solid fa-pen"
                            icon-label="Редактировать"
                            class="mr-1"
                        />
                        <RadioChip
                            v-for="answer in radioTabs"
                            :key="answer.id"
                            :value="answer.id"
                            :label="answer.value"
                            unselect
                        />
                    </template>
                    <MessengerButton
                        @click="$emit('add-answer', question.id, 'tab')"
                        color="primary"
                        class="messenger-quiz-question__button ml-1"
                    >
                        <i class="fa-solid fa-plus mr-1" />
                        <span>Добавить</span>
                    </MessengerButton>
                </div>
                <div>
                    <DashboardChip class="dashboard-bg-warning-l mt-2 mb-1">
                        Текстовые поля
                    </DashboardChip>
                    <template v-if="hasTextQuestions">
                        <div v-for="answer in texts" :key="answer.id" class="position-relative">
                            <Textarea
                                :placeholder="answer.value"
                                class="messenger-quiz-question__field"
                                auto-height
                                :min-height="80"
                            />
                            <div class="messenger-quiz-question__edits">
                                <HoverActionsButton
                                    @click="$emit('edit-answer', answer)"
                                    label="Редактировать"
                                    small
                                >
                                    <i class="fa-solid fa-pen" />
                                </HoverActionsButton>
                            </div>
                        </div>
                    </template>
                    <MessengerButton
                        @click="$emit('add-answer', question.id, 'text-answer')"
                        color="primary"
                        class="messenger-quiz-question__button mt-1 mb-2"
                    >
                        <i class="fa-solid fa-plus mr-1" />
                        <span>Добавить</span>
                    </MessengerButton>
                </div>
                <DashboardChip class="dashboard-bg-warning-l mb-2">
                    Дополнительные возможности
                </DashboardChip>
                <div class="d-flex gap-1 flex-wrap">
                    <template v-if="hasCheckboxQuestions">
                        <CheckboxChip
                            v-for="answer in checkboxes"
                            :key="answer.id"
                            @icon-clicked="$emit('edit-answer', answer)"
                            handled-icon
                            :value="answer.id"
                            :text="answer.value"
                            icon="fa-solid fa-pen"
                            icon-label="Редактировать"
                        />
                    </template>
                    <MessengerButton
                        @click="$emit('add-answer', question.id, 'checkbox')"
                        color="primary"
                        class="messenger-quiz-question__button"
                    >
                        <i class="fa-solid fa-plus mr-1" />
                        <span>Добавить</span>
                    </MessengerButton>
                </div>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import { computed } from 'vue';
import Button from '@/components/common/Button.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

defineEmits(['edit', 'delete', 'edit-answer', 'add-answer']);
const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const hasMainQuestion = computed(() => Boolean(props.question.answers?.['yes-no']));
const hasTabQuestions = computed(() => Boolean(props.question.answers?.tab));
const hasTextQuestions = computed(() => Boolean(props.question.answers?.['text-answer']));
const hasCheckboxQuestions = computed(() => Boolean(props.question.answers?.checkbox));

const checkboxTabs = computed(() => tabs.value.filter(element => element.field_id === 2));
const radioTabs = computed(() => tabs.value.filter(element => element.field_id === 4));

const tabs = computed(() =>
    props.question.answers.tab.filter(element => element.deleted_at === null)
);

const texts = computed(() =>
    props.question.answers['text-answer'].filter(element => element.deleted_at === null)
);

const checkboxes = computed(() =>
    props.question.answers.checkbox.filter(element => element.deleted_at === null)
);
</script>
