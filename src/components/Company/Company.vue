<template>
    <div v-if="company" class="row no-gutters company-detail-info">
        <div class="col-12">
            <div class="row">
                <div v-if="!company.status" class="col-12 text-center mb-3">
                    <h3 class="text-warning">Пассив!</h3>
                    <p class="text-dark">
                        <b>{{ passiveWhyOptions[company.passive_why].label }}</b>
                    </p>
                    <p class="text-dark">{{ company.passive_why_comment }}</p>
                    <hr />
                </div>
                <div class="col-12 text-center mb-2">
                    <i :class="rating(1)"></i>
                    <i :class="rating(3)"></i>
                    <i :class="rating(5)"></i>
                </div>
                <div class="col-12 text-center mb-3">
                    <p class="d-inline-block pl-2 status">
                        <span
                            :class="{
                                'bg-dark': !company.active,
                                'bg-success': company.active
                            }"
                            >{{ status }}</span
                        >
                    </p>
                    <p
                        v-for="categoryItem of company.categories"
                        :key="categoryItem.id"
                        class="d-inline-block pl-2 pb-2 category"
                    >
                        <span>{{ category(categoryItem.category) }}</span>
                    </p>
                </div>
                <div class="col-12 text-center">
                    <Progress :percent="company.progress_percent" />
                </div>
            </div>
        </div>
        <div class="col-12 text-center mt-2">
            <h4 class="m-0">ID: {{ company.id }}</h4>
        </div>
        <div class="col-12 text-center px-3 pb-3 pt-0">
            <h3>
                {{ company.full_name }}
            </h3>
        </div>
        <div class="col-12">
            <div class="row no-gutters">
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-3">
                            <strong> Адрес: </strong>
                        </div>
                        <div class="col-9 text-right align-self-center">
                            <p>
                                {{ company.officeAdress || '&#8212;' }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Телефон: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <template v-if="generalContact && generalContact.phones.length">
                                <PhoneNumber
                                    v-for="phone in generalContact.phones"
                                    :key="phone.id"
                                    :phone="phone"
                                    :contact="generalContact"
                                    class-list="text-right"
                                />
                            </template>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Email: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <template v-if="generalContact && generalContact.emails.length">
                                <a
                                    v-for="email of generalContact.emails"
                                    :key="email.id"
                                    :href="'mailto:' + email.email"
                                >
                                    {{ email.email }}
                                </a>
                            </template>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Вебсайт: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <template v-if="generalContact && generalContact.websites.length">
                                <a
                                    v-for="website of generalContact.websites"
                                    :key="website.id"
                                    :href="href(website.website)"
                                    target="_blank"
                                >
                                    {{ website.website }}
                                </a>
                            </template>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="row no-gutters">
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-5">
                            <strong>ГК: </strong>
                        </div>
                        <div class="col-7 text-right align-self-center">
                            <p v-if="company.companyGroup">
                                {{ company.companyGroup.full_name }}
                            </p>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-5">
                            <strong>Форма Организации: </strong>
                        </div>
                        <div class="col-7 text-right align-self-center">
                            <p v-if="company.formOfOrganization !== null">
                                {{ formOfOrganizationOptions[company.formOfOrganization].label }}
                            </p>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-5">
                            <strong>Группа деятельности: </strong>
                        </div>
                        <div class="col-7 text-right align-self-center">
                            <p v-if="company.activityGroup !== null">
                                {{ activityGroupOptions[company.activityGroup].label }}
                            </p>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-5">
                            <strong>Профиль деятельности: </strong>
                        </div>
                        <div class="col-7 text-right align-self-center">
                            <p v-if="company.activityProfile !== null">
                                {{ activityProfileOptions[company.activityProfile].label }}
                            </p>
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item" :class="{ 'product-range': company.productRanges.length }">
                    <div class="row no-gutters">
                        <div class="col-5">
                            <strong>Наменклатура товара: </strong>
                        </div>
                        <div class="col-7 text-right align-self-center">
                            <p
                                v-for="product of company.productRanges"
                                :key="product.id"
                                class="d-inline-block"
                                style="line-break: anywhere; white-space: break-spaces !important"
                            >
                                {{ product.product }}
                            </p>
                            <p
                                v-if="!company.productRanges.length"
                                class="d-inline-block"
                                style="line-break: anywhere; white-space: break-spaces !important"
                            >
                                &#8212;
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-3">
                            <strong>Внес: </strong>
                        </div>
                        <div class="col-9 text-right align-self-center">
                            <p>
                                {{ company.consultant.userProfile.short_name }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Описание: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <p>
                                {{ company.description || '&#8212;' }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Поступление: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <p>
                                {{ company.created_at_format }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Обновление: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <p>
                                {{ company.updated_at_format || '&#8212;' }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Обработано: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <p>
                                {{ company.processed ? 'Да' : 'Нет' }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 company-detail-info-item">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <strong>Документы: </strong>
                        </div>
                        <div class="col-8 text-right align-self-center">
                            <FileInput v-if="company.files.length" :data="company.files" :reed-only="true" />
                            <p v-else>&#8212;</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 text-center mt-3">
            <h4 @click.prevent="toggleRequisistesVisible" class="requisistes-show-btn">
                дополнительно
                <i v-if="!requisistesVisible" class="fas fa-sort-down visible"></i>
                <i v-else class="fas fa-sort-up unvisible"></i>
            </h4>
        </div>
        <div v-show="requisistesVisible" class="col-12 requisistes pt-3">
            <div class="row">
                <div class="col-12">
                    <div class="row no-gutters">
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>Юр. адрес: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.legalAddress">
                                        {{ company.legalAddress }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>ОГРН: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.ogrn" class="text-primary">
                                        {{ company.ogrn }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>ИНН: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.inn">
                                        {{ company.inn }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>КПП: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.kpp">
                                        {{ company.kpp }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>БИК: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.bik">
                                        {{ company.bik }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>ОКПО: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.okpo">
                                        {{ company.okpo }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>ОКВЭД: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.okved">
                                        {{ company.okved }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row no-gutters">
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>Рсч/сч: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.checkingAccount">
                                        {{ company.checkingAccount }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>Крсп/сч: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.correspondentAccount">
                                        {{ company.correspondentAccount }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>В банке: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.inTheBank">
                                        {{ company.inTheBank }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-5">
                                    <strong>Имя подписанта: </strong>
                                </div>
                                <div class="col-7 text-right align-self-center">
                                    <p v-if="company.signatoryName">
                                        {{ company.signatoryName }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-5">
                                    <strong>Фамилия подписанта: </strong>
                                </div>
                                <div class="col-7 text-right align-self-center">
                                    <p v-if="company.signatoryMiddleName">
                                        {{ company.signatoryMiddleName }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-5">
                                    <strong>Отчество подписанта: </strong>
                                </div>
                                <div class="col-7 text-right align-self-center">
                                    <p v-if="company.signatoryLastName">
                                        {{ company.signatoryLastName }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-3">
                                    <strong>№ документа: </strong>
                                </div>
                                <div class="col-9 text-right align-self-center">
                                    <p v-if="company.documentNumber">
                                        {{ company.documentNumber }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 company-detail-info-item">
                            <div class="row no-gutters">
                                <div class="col-5">
                                    <strong>Действует на основе: </strong>
                                </div>
                                <div class="col-7 text-right align-self-center">
                                    <p v-if="company.basis">
                                        {{ company.basis }}
                                    </p>
                                    <p v-else>&#8212;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>Компания не найдена</div>
</template>

<script>
import { MixinCompanyDetailInfo } from '@/components/Company/mixins.js';

export default {
    name: 'Company',
    mixins: [MixinCompanyDetailInfo]
};
</script>
