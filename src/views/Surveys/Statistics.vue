<template>
    <section>
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block">
                        <div class="row">
                            <UiDateInput
                                v-model="form.after"
                                placeholder="Дата начала"
                                label="Статистика после"
                                :max-date="new Date()"
                                class="col-5"
                            />
                            <UiDateInput
                                v-model="form.before"
                                placeholder="Дата окончания"
                                label="Статистика до"
                                class="col-5"
                                :min-date="form.after"
                            />
                            <UiCol :cols="2" class="align-self-end">
                                <UiButton
                                    @click="fetchStatistics"
                                    icon="fa-solid fa-refresh"
                                    color="success-light"
                                    class="ml-auto"
                                >
                                    Загрузить статистику
                                </UiButton>
                            </UiCol>
                        </div>
                    </div>
                </UiCol>
                <UiCol :cols="12">
                    <div class="white-block">
                        <div v-if="statistics" class="row mb-2">
                            <UiCol :cols="12">
                                <p class="font-weight-semi fs-4">
                                    Результаты с {{ startDate }} по {{ endDate }}
                                </p>
                            </UiCol>
                        </div>
                        <div v-if="statistics" class="row">
                            <Loader v-if="isLoading" />
                            <div v-for="entity in users" :key="entity.user.id" class="col-4">
                                <AccountConsultant :user="entity.user" :size="70">
                                    <div>
                                        <p>
                                            <span class="mr-1 text-grey">Заполнено опросов:</span>
                                            <span class="font-weight-semi">
                                                {{ entity.statistics.surveys_count }}
                                            </span>
                                        </p>
                                        <p>
                                            <span class="mr-1 text-grey">
                                                Поставлено задач в опросах:
                                            </span>
                                            <span class="font-weight-semi">
                                                {{ entity.statistics.survey_tasks_count }}
                                            </span>
                                        </p>
                                        <p>
                                            <span class="mr-1 text-grey"> Выполнено звонков: </span>
                                            <span class="mr-1 font-weight-semi">
                                                {{ entity.statistics.calls_total_count }}
                                            </span>
                                            <span>(</span>
                                            <span class="text-success_alt font-weight-semi">
                                                {{ entity.statistics.calls_accepted_count }}
                                            </span>
                                            <span>/</span>
                                            <span class="text-danger font-weight-semi">
                                                {{ entity.statistics.calls_rejected_count }}
                                            </span>
                                            <span>)</span>
                                        </p>
                                        <p>
                                            <span class="mr-1 text-grey"> Выполнено задач: </span>
                                            <span class="font-weight-semi">
                                                {{ entity.statistics.completed_tasks_count }}
                                            </span>
                                        </p>
                                    </div>
                                </AccountConsultant>
                            </div>
                        </div>
                        <div v-else>
                            <Spinner v-if="isLoading" center />
                            <p v-else class="text-center">Нет данных..</p>
                        </div>
                    </div>
                </UiCol>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import api from '@/api/api.js';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useAsync } from '@/composables/useAsync.js';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import { computed, reactive } from 'vue';
import dayjs from 'dayjs';
import { toDateFormat, toServerDate } from '@/utils/formatters/date';
import AccountConsultant from '@/components/Account/AccountConsultant.vue';
import Spinner from '@/components/common/Spinner.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import Loader from '@/components/common/Loader.vue';

// TODO: Refactor me

const form = reactive({
    after: dayjs().subtract(30, 'd').toDate(),
    before: dayjs().toDate()
});

function createPayload() {
    return { after: toServerDate(form.after), before: toServerDate(form.before) };
}

const {
    execute: fetchStatistics,
    isLoading,
    data: statistics
} = useAsync(() => api.survey.statistics(createPayload()), {
    immediate: true
});

const users = computed(() => {
    if (statistics.value) {
        return statistics.value.users;
    }

    return [];
});

const startDate = computed(() => toDateFormat(statistics.value.start_date, 'D.MM.YY'));
const endDate = computed(() => toDateFormat(statistics.value.end_date, 'D.MM.YY'));
</script>
