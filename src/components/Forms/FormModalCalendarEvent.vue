<template>
    <Modal @close="cancel" :show="isVisible" title="Новое событие" width="1200">
        <Stepper @complete="submit" :steps="steps" :v="v$.form" keep-alive>
            <template #1>
                <UiForm>
                    <FormGroup>
                        <Input
                            v-model="form.description.title"
                            class="col-7"
                            label="Заголовок"
                            placeholder="Название события"
                            :v="v$.form.title"
                            required
                        />
                        <MultiSelect
                            v-model="form.category"
                            label="Категория"
                            class="col-5"
                            :options="[]"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Textarea
                            v-model="form.description.content"
                            class="col-12"
                            label="Описание задачи"
                        />
                    </FormGroup>
                    <FormGroup>
                        <div class="col-12">
                            <div class="d-flex gap-4">
                                <ColorPicker
                                    v-model="form.description.color"
                                    :colors="['#ffffff', '#000000']"
                                    label="Цвет текста"
                                    circle
                                />
                                <ColorPicker
                                    v-model="form.description.background"
                                    :colors="defaultColors"
                                    label="Цвет фона"
                                    circle
                                />
                            </div>
                        </div>
                    </FormGroup>
                </UiForm>
            </template>
            <template #2>
                <UserPicker v-model="form.user_id" single :users="consultants" />
            </template>
            <template #3>
                <div class="row align-items-center">
                    <div class="col-12 col-lg-5">
                        <VueDatePicker
                            v-model="form.date.day"
                            locale="ru"
                            inline
                            auto-apply
                            class="multi-datepicker mx-auto"
                        />
                    </div>
                    <div class="col-12 col-lg-7">
                        <div class="d-flex align-items-end justify-content-between">
                            <DashboardChip class="dashboard-bg-success-l mb-2">
                                Дата начала и окончания
                            </DashboardChip>
                            <Switch
                                v-model="form.allDay"
                                false-title="Начало и конец"
                                true-title="Весь день"
                                class="mb-2"
                            />
                        </div>
                        <VueDatePicker
                            v-model="form.date.time"
                            locale="ru"
                            inline
                            range
                            time-picker
                            multi-calendars
                            auto-apply
                            class="mx-auto"
                            :disabled="form.allDay"
                        />
                    </div>
                </div>
            </template>
        </Stepper>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UserPicker from '@/components/common/Forms/UserPicker/UserPicker.vue';
import Stepper from '@/components/common/Stepper.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { ref } from 'vue';
import { useStore } from 'vuex';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import dayjs from 'dayjs';
import ColorPicker from '@/components/common/Forms/ColorPicker.vue';

export default {
    name: 'FormModalCalendarEvent',
    components: {
        UiForm,
        ColorPicker,
        Switch,
        DashboardChip,
        Stepper,
        UserPicker,
        MultiSelect,
        Textarea: UiTextarea,
        FormGroup: UiFormGroup,
        Input: UiInput,
        Modal,
        VueDatePicker
    },
    emits: ['close'],
    setup() {
        const form = ref({});

        const setDefaultForm = () => {
            form.value = {
                date: {
                    day: null,
                    time: []
                },
                user_id: null,
                description: {
                    title: null,
                    content: null,
                    category: null,
                    color: '#ffffff',
                    background: '#77e8b0'
                },
                allDay: false
            };
        };

        const store = useStore();
        const {
            isVisible,
            onPopupShowed,
            destroy,
            props,
            cancel,
            submit: _submit
        } = useAsyncPopup('calendarEventCreator');

        const submit = () => {
            const start = dayjs(form.value.date.day)
                .hour(form.value.date.time[0].hours)
                .minute(form.value.date.time[0].minutes)
                .toDate();
            const end = dayjs(form.value.date.day)
                .hour(form.value.date.time[1].hours)
                .minute(form.value.date.time[1].minutes)
                .toDate();

            _submit({
                ...form.value.description,
                start,
                end,
                user_id: form.value.user_id,
                allDay: form.value.allDay
            });
        };

        onPopupShowed(() => {
            setDefaultForm();

            form.value.user_id = store.getters.THIS_USER.id;
            form.value.date.day = props.value.start;

            const startDate = dayjs(props.value.start);
            const endDate = dayjs(props.value.end);

            form.value.date.time = [
                { hours: startDate.hour(), minutes: startDate.minute() },
                { hours: endDate.hour(), minutes: endDate.minute() }
            ];
        });

        return { isVisible, onPopupShowed, destroy, props, cancel, submit, form };
    },
    data() {
        return {
            defaultColors: ['#77e8b0'],
            v$: useValidate(),
            isLoading: false,
            consultants: [],
            steps: [
                {
                    name: 'description',
                    title: 'Описание события'
                },
                {
                    name: 'user_id',
                    title: 'Выбор исполнителя'
                },
                {
                    name: 'date',
                    title: 'Выбор даты события'
                }
            ]
        };
    },
    methods: {
        async fetchConsultants() {
            this.isLoading = true;
            this.consultants = await this.$store.dispatch('getConsultants');
            this.isLoading = false;
        }
    },
    validations() {
        return {
            form: {
                user_id: {
                    required: helpers.withMessage('Выберите сотрудника!', required)
                },
                description: {
                    title: {
                        required: helpers.withMessage('Укажите заголовок события', required)
                    }
                }
            }
        };
    },
    created() {
        this.fetchConsultants();
    },
    unmounted() {
        this.destroy();
    }
};
</script>
