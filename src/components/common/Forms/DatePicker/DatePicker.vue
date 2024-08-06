<template>
    <div class="schedule">
        <VueDatePicker
            ref="datePicker"
            v-model="value"
            locale="ru"
            inline
            :markers="markers"
            select-text="Выбрать"
            auto-apply
            month-name-format="long"
            :highlight="{ weekdays: [0, 6] }"
            :style="{ '--dp-cell-size': size }"
        >
            <template #calendar-header="{ index, day }">
                <div :class="index === 5 || index === 6 ? 'color-success' : ''">
                    {{ day }}
                </div>
            </template>
            <template #left-sidebar>
                <div class="schedule-sidebar">
                    <AnimationTransition>
                        <div v-if="value" class="schedule-sidebar__body">
                            <div class="schedule-sidebar__day">
                                <span class="schedule-sidebar__day-title">Выбрано</span>
                                <span>{{ formattedDate.day }}</span>
                                <span>{{ formattedDate.time }}</span>
                            </div>
                        </div>
                    </AnimationTransition>
                    <div class="schedule-sidebar__footer">
                        <MessengerButton
                            @click="switchView('сalendar')"
                            class="schedule-sidebar__button"
                        >
                            Указать день
                        </MessengerButton>
                        <MessengerButton
                            @click="switchView('time')"
                            class="schedule-sidebar__button"
                        >
                            Указать время
                        </MessengerButton>
                        <MessengerButton
                            @click="value = new Date()"
                            class="schedule-sidebar__button"
                        >
                            Сегодня
                        </MessengerButton>
                        <MessengerButton
                            @click="$emit('select')"
                            :disabled="!value"
                            color="success"
                            class="schedule-sidebar__button"
                        >
                            Выбрать дату
                        </MessengerButton>
                    </div>
                </div>
            </template>
            <template #marker-tooltip="{ tooltip }">
                <DatePickerTooltip :tooltip="tooltip" />
            </template>
            <template #action-row></template>
        </VueDatePicker>
    </div>
</template>
<script>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import DatePickerTooltip from '@/components/common/Forms/DatePicker/DatePickerTooltip.vue';
import dayjs from 'dayjs';

export default {
    name: 'DatePicker',
    components: { DatePickerTooltip, VueDatePicker, MessengerButton, AnimationTransition },
    emits: ['update:modelValue', 'select'],
    props: {
        modelValue: {
            type: [String, Date, Number],
            default: null
        },
        markers: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: '100px'
        }
    },
    computed: {
        value: {
            set(value) {
                this.$emit('update:modelValue', value);
            },
            get() {
                return this.modelValue;
            }
        },
        formattedDate() {
            const dayjs_date = dayjs(this.value);

            return {
                day: dayjs_date.format('D MMMM'),
                time: dayjs_date.format('HH:mm')
            };
        }
    },
    methods: {
        switchView(view) {
            this.$refs.datePicker.switchView(view);
        }
    }
};
</script>
