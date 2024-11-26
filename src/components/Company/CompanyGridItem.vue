<template>
    <div class="col-xxl-4 col-md-6 col-12" :class="{ inactive: company.active === 0 }">
        <div class="company-grid-card">
            <div class="row no-gutters">
                <a
                    class="company-grid-card__preview col-lg-4 col-12"
                    :href="$url.company(company.id)"
                    target="_blank"
                >
                    <p class="company-grid-card__id">
                        <span class="mr-2">ID:</span>
                        <span>{{ company.id }}</span>
                    </p>
                    <h3 class="company-grid-card__name">{{ companyName }}</h3>
                    <p class="company-grid-card__date">
                        {{ company.created_at }}
                    </p>
                </a>
                <div class="company-grid-card__body col-lg-8 col-12">
                    <div class="row no-gutters">
                        <div class="col-12">
                            <div
                                v-if="company.categories?.length"
                                class="company-grid-card__list mb-2"
                            >
                                <DashboardChip
                                    v-for="(category, key) in categories"
                                    :key="key"
                                    class="dashboard-bg-primary-l company-grid-card__category"
                                >
                                    {{ category }}
                                </DashboardChip>
                            </div>
                            <Progress :percent="company.progress_percent" />
                        </div>
                        <div v-if="company.contacts?.length" class="col-12">
                            <p class="company-grid-card__subtitle">
                                Контакты ({{ company.contacts_count }})
                            </p>
                            <div
                                v-if="company.contacts?.length"
                                class="company-grid-card__contacts"
                            >
                                <CompanyContact
                                    v-for="contact in company.contacts"
                                    :key="contact.id"
                                    :contact="contact"
                                    :inactive="contact.status === 0"
                                />
                            </div>
                            <EmptyLabel v-else>Список контактов пуст</EmptyLabel>
                        </div>
                        <div class="col-12 align-self-end mt-2">
                            <div class="company-grid-card__footer">
                                <div class="company-grid-card__counts">
                                    <DashboardChip class="dashboard-bg-light">
                                        Запросы: {{ company.requests_count }}
                                    </DashboardChip>
                                    <DashboardChip class="dashboard-bg-light">
                                        Предложения: {{ company.offers_count ?? '-' }}
                                    </DashboardChip>
                                    <DashboardChip class="dashboard-bg-light">
                                        Сделки: {{ company.objects_count }}
                                    </DashboardChip>
                                </div>
                                <div class="company-grid-card__consultant mt-2">
                                    <span>Консультант:</span>
                                    <div
                                        v-if="company.consultant"
                                        class="company-grid-card__consultant ml-auto"
                                    >
                                        <Avatar
                                            :src="company.consultant?.userProfile?.avatar"
                                            size="30"
                                        />
                                        <span>
                                            {{ company.consultant?.userProfile?.medium_name }}
                                        </span>
                                    </div>
                                    <p v-else class="ml-auto">Консультант отсутствует</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { CompanyCategories } from '@/const/const.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import Progress from '@/components/common/Progress.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import Avatar from '@/components/common/Avatar.vue';

const props = defineProps({ company: { type: Object, required: true } });

const categories = computed(() =>
    props.company.categories.map(({ category }) => CompanyCategories[category])
);
const companyName = computed(() => getCompanyName(props.company, props.company.id));
</script>
