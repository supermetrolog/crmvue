<template>
    <div class="scheduler">
        <div class="scheduler__header">
            <DashboardChip class="dashboard-bg-success-l mb-1">
                {{ formattedDate }}
            </DashboardChip>
            <Switch
                v-model="isMonthMode"
                @change="onModeChanged"
                false-title="По дням"
                true-title="По месяцам"
            />
        </div>
        <VueDatePicker
            ref="datePicker"
            v-model="value"
            @date-update="onDateClicked"
            @update-month-year="onMonthOrYearUpdated"
            locale="ru"
            inline
            :markers="markers"
            select-text="Выбрать"
            auto-apply
            month-name-format="long"
            :highlight="{ weekdays: [0, 6] }"
            :enable-time-picker="false"
            :month-picker="isMonthMode"
            style="--dp-cell-size: max-width"
        >
            <template #calendar-header="{ index, day }">
                <div :class="index === 5 || index === 6 ? 'color-success' : ''">
                    {{ day }}
                </div>
            </template>
            <template #marker-tooltip="{ tooltip }">
                <DatePickerTooltip :tooltip="tooltip" />
            </template>
        </VueDatePicker>
    </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import DatePickerTooltip from '@/components/common/Forms/DatePicker/DatePickerTooltip.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import Switch from '@/components/common/Forms/Switch.vue';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(objectSupport);

export default {
    name: 'Scheduler',
    components: { Switch, DashboardChip, DatePickerTooltip, VueDatePicker },
    emits: ['update:modelValue', 'select', 'changed', 'mode-changed'],
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
    data() {
        return {
            isMonthMode: false
        };
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
            return this.$formatter.text().ucFirst(dayjs(this.value).format('MMMM, YYYY'));
        }
    },
    methods: {
        onDateClicked(date) {
            if (!dayjs(date).isSame(dayjs(this.value))) this.$emit('changed');
        },
        onMonthOrYearUpdated(obj) {
            if (this.isMonthMode && obj.year === this.value.year) this.$emit('changed');
        },
        onModeChanged() {
            this.$refs.datePicker.selectDate();
            this.$emit('mode-changed', this.isMonthMode);
        }
    }
};
</script>
