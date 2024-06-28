<template>
    <CompanyBoxLayout class="company-box-main">
        <template #header>
            <div class="company-box-main__header">
                <span class="company-box-main__title">
                    {{ company.full_name }}
                </span>
                <div class="company-box-main__actions">
                    <HoverActionsButton @click="$emit('edit-company')" small label="Редактировать">
                        <i class="fa-solid fa-pen" />
                    </HoverActionsButton>
                </div>
                <div class="company-box-main__info ml-auto">
                    <DashboardChip
                        v-for="(category, key) in categories"
                        :key="key"
                        class="dashboard-bg-success-l"
                    >
                        {{ category }}
                    </DashboardChip>
                    <span>ID {{ company.id }}</span>
                    <Rating v-if="company.rating" :rating="company.rating" color="yellow" />
                </div>
            </div>
        </template>
        <template #content>
            <div class="company-box-main__content">
                <div class="company-box-main__block">
                    <ul class="company-box-main__list">
                        <CompanyBoxRow label="Вебсайт">
                            <div v-if="websites.length" class="company-box-main__vertical-list">
                                <a
                                    v-for="website in websites"
                                    :key="website"
                                    :href="$formatter.toCorrectUrl(website)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ website }}
                                </a>
                            </div>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Группа деятельности">
                            <span v-if="!!company.activityGroup">
                                {{ activityGroup }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Профиль деятельности">
                            <span v-if="!!company.activityProfile">
                                {{ activityProfile }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Номенклатура товара">
                            <span v-if="company.productRanges?.length">
                                {{ productRanges }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Внес">
                            <span v-if="company.consultant?.userProfile?.short_name">
                                {{ company.consultant.userProfile.short_name }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Поступление">
                            <span v-if="company.created_at">
                                {{ $formatter.toDate(company.created_at, 'DD.MM.YY, HH:mm') }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Обновление">
                            <span v-if="company.updated_at">
                                {{ $formatter.toDate(company.updated_at, 'DD.MM.YY, HH:mm') }}
                            </span>
                        </CompanyBoxRow>
                    </ul>
                </div>
                <div class="company-box-main__block">
                    <Tabs :options="{ useUrlFragment: false }">
                        <Tab name="Описание">
                            <span v-if="!!company.description">{{ company.description }}</span>
                            <span v-else>Не указано</span>
                        </Tab>
                        <Tab name="Адрес">
                            <span v-if="!!company.officeAdress">
                                {{ company.officeAdress }}
                            </span>
                            <span v-else>Не указан</span>
                        </Tab>
                        <Tab name="Ревизиты">
                            <div class="d-flex">
                                <ul class="company-box-main__list">
                                    <CompanyBoxRow label="Юр. адрес">
                                        <span v-if="company.legalAddress">
                                            {{ company.legalAddress }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="ОГРН">
                                        <span v-if="company.ogrn">
                                            {{ company.ogrn }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="ИНН">
                                        <span v-if="company.inn">
                                            {{ company.inn }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="КПП">
                                        <span v-if="company.kpp">
                                            {{ company.kpp }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="Расчетный счет">
                                        <span v-if="company.checkingAccount">
                                            {{ company.checkingAccount }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="Кор. счет">
                                        <span v-if="company.correspondentAccount">
                                            {{ company.correspondentAccount }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="В банке">
                                        <span v-if="company.inTheBank">
                                            {{ company.inTheBank }}
                                        </span>
                                    </CompanyBoxRow>
                                </ul>
                                <ul class="company-box-main__list">
                                    <CompanyBoxRow label="БИК">
                                        <span v-if="company.bik">
                                            {{ company.bik }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="ОКПО">
                                        <span v-if="company.okpo">
                                            {{ company.okpo }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="ОКВЭД">
                                        <span v-if="company.okved">
                                            {{ company.okved }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="Имя подписанта">
                                        <span v-if="company.signatoryName">
                                            {{ company.signatoryName }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="Фамилия подписанта">
                                        <span v-if="company.signatoryMiddleName">
                                            {{ company.signatoryMiddleName }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="Отчество подписанта">
                                        <span v-if="company.signatoryLastName">
                                            {{ company.signatoryLastName }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="№ документа">
                                        <span v-if="company.documentNumber">
                                            {{ company.documentNumber }}
                                        </span>
                                    </CompanyBoxRow>
                                    <CompanyBoxRow label="Действует на основе">
                                        <span v-if="company.basis">
                                            {{ company.basis }}
                                        </span>
                                    </CompanyBoxRow>
                                </ul>
                            </div>
                        </Tab>
                        <Tab name="Документы">
                            <div v-if="company.files?.length" class="row">
                                <File
                                    v-for="file in company.files"
                                    :key="file.id"
                                    :file="file"
                                    class="col-4 col-md-2 col-lg-3 col-xl-2"
                                    read-only
                                />
                            </div>
                            <EmptyLabel v-else class="mx-auto">Список файлов пуст...</EmptyLabel>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <hr />
            <CompanyBoxContactList @create="$emit('create-contact')" :contacts="contacts" />
        </template>
    </CompanyBoxLayout>
</template>

<script>
import CompanyBoxContactList from './CompanyBoxContactList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import { ActivityGroupList, ActivityProfileList, CompanyCategories } from '@/const/const';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import CompanyBoxRow from '@/components/Company/Box/CompanyBoxRow.vue';
import File from '@/components/common/Forms/File.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';

export default {
    name: 'CompanyBox',
    components: {
        EmptyLabel,
        File,
        CompanyBoxRow,
        HoverActionsButton,
        DashboardChip,
        Rating,
        CompanyBoxLayout,
        CompanyBoxContactList
    },
    emits: ['create-contact', 'edit-company'],
    inject: ['isMobile'],
    props: {
        company: {
            type: Object,
            default: () => {}
        },
        contacts: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        productRanges() {
            return this.company.productRanges
                .map(range => range.product[0].toUpperCase() + range.product.slice(1))
                .join(', ');
        },
        categories() {
            return this.company.categories.map(item => CompanyCategories[item.category]);
        },
        websites() {
            let commonContact = this.company.contacts.find(contact => contact.type === 1);
            if (commonContact) return commonContact.websites.map(item => item.website);
            return [];
        },
        activityGroup() {
            return ActivityGroupList[this.company.activityGroup].label;
        },
        activityProfile() {
            return ActivityProfileList[this.company.activityProfile].label;
        }
    }
};
</script>
