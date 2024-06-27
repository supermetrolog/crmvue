<template>
    <DashboardCard>
        <div class="company-detail-info">
            <div class="company-detail-info__actions">
                <a :href="$url.company(company.id)" target="_blank">
                    <HoverActionsButton label="Перейти на страницу компании">
                        <i class="fa-solid fa-eye"></i>
                    </HoverActionsButton>
                </a>
                <HoverActionsButton @click="$emit('start-editing')" label="Редактировать">
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
            </div>
            <div class="row">
                <div class="col-12">
                    <DashboardChip class="dashboard-bg-light w-100">
                        <span class="company-detail-info__title">
                            {{ company.full_name }} (ID: {{ company.id }})
                        </span>
                    </DashboardChip>
                </div>
                <div class="col-12">
                    <Progress :percent="company.progress_percent" :height="8" />
                </div>
                <div class="col-12 mb-2">
                    <div class="d-flex align-items-end gap-2">
                        <DashboardChip class="dashboard-cl-white" :class="statusColor">
                            <div class="d-flex align-items-center">
                                <span>{{ status }}</span>
                                <i
                                    v-if="!company.status"
                                    v-tippy="statusTippy"
                                    class="fa-regular fa-question-circle ml-2 icon"
                                />
                            </div>
                        </DashboardChip>
                        <DashboardChip v-if="company.rating" class="dashboard-bg-light">
                            <Rating
                                class="company-detail-info__rating"
                                :rating="rating"
                                :max="3"
                                color="yellow"
                            />
                        </DashboardChip>
                    </div>
                    <div v-if="company.categories?.length" class="d-flex gap-2 mt-2">
                        <DashboardChip
                            v-for="(category, key) in categories"
                            :key="key"
                            class="dashboard-bg-light"
                        >
                            {{ category }}
                        </DashboardChip>
                    </div>
                </div>
                <CompanyDetailRow label="Адрес">
                    {{ company.officeAdress || '&#8212;' }}
                </CompanyDetailRow>
                <CompanyDetailRow label="Общий телефон">
                    <div v-if="generalContact?.phones?.length" class="vertical-list">
                        <PhoneNumber
                            v-for="phone in generalContact.phones"
                            :key="phone.id"
                            :phone="phone"
                            :contact="generalContact"
                            class-list="text-left font-weight-bold"
                        />
                    </div>
                </CompanyDetailRow>
                <CompanyDetailRow label="Email">
                    <div v-if="generalContact?.emails?.length" class="vertical-list">
                        <a
                            v-for="email of generalContact.emails"
                            :key="email.id"
                            :href="'mailto:' + email.email"
                        >
                            {{ email.email }}
                        </a>
                    </div>
                </CompanyDetailRow>
                <CompanyDetailRow label="Вебсайт">
                    <div v-if="generalContact?.websites?.length" class="vertical-list">
                        <a
                            v-for="website of generalContact.websites"
                            :key="website.id"
                            :href="$formatter.toCorrectUrl(website.website)"
                            target="_blank"
                        >
                            {{ website.website }}
                        </a>
                    </div>
                </CompanyDetailRow>
                <CompanyDetailRow label="Группа компаний">
                    <span v-if="company.companyGroup">
                        {{ company.companyGroup.full_name }}
                    </span>
                </CompanyDetailRow>
                <CompanyDetailRow label="Форма организации">
                    <span v-if="company.formOfOrganization !== null">
                        {{ formOfOrganization }}
                    </span>
                </CompanyDetailRow>
                <CompanyDetailRow label="Группа деятельности">
                    <span v-if="company.activityGroup !== null">
                        {{ activityGroup }}
                    </span>
                </CompanyDetailRow>
                <CompanyDetailRow label="Профиль деятельности">
                    <span v-if="company.activityProfile !== null">
                        {{ activityProfile }}
                    </span>
                </CompanyDetailRow>
                <CompanyDetailRow label="Номенклатура товара">
                    <div v-if="company.productRanges.length" class="d-flex gap-1 flex-wrap">
                        <DashboardChip
                            v-for="product of company.productRanges"
                            :key="product.id"
                            class="dashboard-bg-light"
                        >
                            <span class="company-detail-info__product">{{ product.product }}</span>
                        </DashboardChip>
                    </div>
                </CompanyDetailRow>
                <CompanyDetailRow label="Внёс">
                    <span v-if="company.consultant">
                        {{ company.consultant.userProfile.short_name }}
                    </span>
                </CompanyDetailRow>
                <CompanyDetailRow label="Поступление">
                    {{ company.created_at_format }}
                </CompanyDetailRow>
                <CompanyDetailRow label="Обновление">
                    {{ company.updated_at_format || '&#8212;' }}
                </CompanyDetailRow>
                <CompanyDetailRow label="Обработано">
                    {{ company.processed ? 'Да' : 'Нет' }}
                </CompanyDetailRow>
                <CompanyDetailRow label="Описание">
                    {{ company.description || '&#8212;' }}
                </CompanyDetailRow>
                <CompanyDetailRow label="Документы">
                    <AccordionSimple v-if="company.files.length" without-render>
                        <template #title>
                            <AccordionSimpleTriggerButton
                                :label="`Просмотреть документы (${company.files.length})`"
                            />
                        </template>
                        <template #body>
                            <div class="row mt-2">
                                <File
                                    v-for="(file, index) in company.files"
                                    :key="index"
                                    :file="file"
                                    read-only
                                    class="col-4"
                                />
                            </div>
                        </template>
                    </AccordionSimple>
                    <span v-else>&#8212;</span>
                </CompanyDetailRow>
                <div class="col-12">
                    <AccordionSimple>
                        <template #title>
                            <AccordionSimpleTrigger>
                                <DashboardChip class="dashboard-bg-light w-100">
                                    <div class="d-flex justify-content-center gap-2">
                                        <span>Дополнительная информация</span>
                                        <AccordionSimpleTriggerIcon />
                                    </div>
                                </DashboardChip>
                            </AccordionSimpleTrigger>
                        </template>
                        <template #body>
                            <CompanyDetailExternal class="mt-2" :company="company" />
                        </template>
                    </AccordionSimple>
                </div>
            </div>
        </div>
    </DashboardCard>
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import CompanyDetailRow from '@/components/Company/CompanyDetailRow.vue';
import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    CompanyFormOrganization,
    PassiveWhy
} from '@/const/const.js';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import CompanyDetailExternal from '@/components/Company/CompanyDetailExternal.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';
import Rating from '@/components/common/Rating.vue';
import Progress from '@/components/common/Progress.vue';
import File from '@/components/common/Forms/File.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';

export default {
    name: 'Company',
    components: {
        AccordionSimpleTriggerButton,
        File,
        Progress,
        Rating,
        AccordionSimpleTriggerIcon,
        AccordionSimpleTrigger,
        CompanyDetailExternal,
        AccordionSimple,
        CompanyDetailRow,
        DashboardChip,
        DashboardCard,
        HoverActionsButton
    },
    emits: ['start-editing'],
    props: {
        company: {
            type: Object,
            required: true
        }
    },
    computed: {
        generalContact() {
            return this.company.contacts.find(item => item.type === 1);
        },
        formOfOrganization() {
            return CompanyFormOrganization[this.company.formOfOrganization].label;
        },
        activityGroup() {
            return ActivityGroupList[this.company.activityGroup].label;
        },
        activityProfile() {
            return ActivityProfileList[this.company.activityProfile].label;
        },
        status() {
            return this.company.active ? 'Актив' : 'Пассив';
        },
        statusColor() {
            return this.company.active ? 'dashboard-bg-success' : 'dashboard-bg-danger';
        },
        categories() {
            return this.company.categories.map(element => CompanyCategories[element.category]);
        },
        statusTippy() {
            let text = PassiveWhy[this.company.passive_why].label;
            if (this.company.passive_why_comment) text += ': ' + this.company.passive_why_comment;
            return text;
        },
        rating() {
            return (this.company.rating + 3) / 3;
        }
    }
};
</script>
