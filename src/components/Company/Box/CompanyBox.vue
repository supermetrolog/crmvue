<template>
    <CompanyBoxLayout :class="'grid-a'" class="CompanyBoxMain">
        <template #header>
            <div class="CompanyBoxMain-header">
                <div class="CompanyBoxMain-header-name">
                    <span
                        >{{ company.full_name }}
                        <small @click="$emit('editCompany')" class="edit_btn">[редактировать]</small></span
                    >
                </div>
                <div class="CompanyBoxMain-header-about">
                    <span>{{ categoryHandler }} ID {{ company.id }}</span>
                    <div class="CompanyBoxMain-header-about-rating">
                        <i :class="rating(1)"></i>
                        <i :class="rating(3)"></i>
                        <i :class="rating(5)"></i>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <div class="CompanyBoxMain-content">
                <div id="left-box" class="CompanyBoxMain-left">
                    <ul class="CompanyBoxMain-left-list">
                        <li class="CompanyBoxMain-left-list-websites">
                            <span
v-if="!!websitesHandler"
                                ><a
                                    v-for="website in websitesHandler"
                                    :key="website"
                                    :href="`http://${website}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :title="website"
                                    >{{ website }}</a
                                ></span
                            >
                            <span v-else>Нет данных</span>
                            <span>Вебсайт</span>
                        </li>
                        <li>
                            <span v-if="!!company.activityGroup">{{
                                activityGroupOptions[company.activityGroup].label
                            }}</span>
                            <span v-else>Нет данных</span>
                            <span>Группа деятельности</span>
                        </li>
                        <li>
                            <span v-if="!!company.activityProfile">{{
                                activityProfileOptions[company.activityProfile].label
                            }}</span>
                            <span v-else>Нет данных</span>
                            <span>Профиль деятельности</span>
                        </li>
                        <li class="CompanyBoxMain-left-list-range">
                            <span v-if="!!productRangesHandler">
                                {{ productRangesHandler }}
                            </span>
                            <span v-else>Нет данных</span>
                            <span>Номенклатура товара</span>
                        </li>
                        <li>
                            <span v-if="!!company.consultant.userProfile.short_name">{{
                                company.consultant.userProfile.short_name
                            }}</span>
                            <span v-else>Нет данных</span>
                            <span>Внес</span>
                        </li>
                        <li>
                            <span v-if="!!company.created_at">{{ dateFormatter(company.created_at) }}</span>
                            <span v-else>Нет данных</span>
                            <span>Поступление</span>
                        </li>
                        <li>
                            <span v-if="!!company.updated_at">{{ dateFormatter(company.updated_at) }}</span>
                            <span v-else>Нет данных</span>
                            <span>Обновление</span>
                        </li>
                    </ul>
                </div>
                <div id="right-box" class="CompanyBoxMain-right">
                    <Tabs :options="{ useUrlFragment: false }">
                        <Tab name="Описание">
                            <div>
                                <span v-if="company.description">{{ company.description }}</span>
                                <span v-else>Не указано</span>
                            </div>
                        </Tab>
                        <Tab name="Адрес">
                            <div>
                                <span v-if="!!company.officeAdress">{{ company.officeAdress }}</span>
                                <span v-else>Не указан</span>
                            </div>
                        </Tab>
                        <Tab name="Ревизиты">
                            <div>
                                <ul class="CompanyBoxMain-requisites">
                                    <li>
                                        <span>Юр. адрес</span>
                                        <span v-if="company.legalAddress">{{ company.legalAddress }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>ОГРН</span>
                                        <span v-if="company.ogrn">{{ company.ogrn }}</span>
                                        <span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>ИНН</span>
                                        <span v-if="company.inn">{{ company.inn }}</span>
                                        <span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>КПП</span>
                                        <span v-if="company.kpp">{{ company.kpp }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>Расчетный счет</span>
                                        <span v-if="company.checkingAccount">{{ company.checkingAccount }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>Кор. счет</span>
                                        <span v-if="company.correspondentAccount">{{
                                            company.correspondentAccount
                                        }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>В банке</span>
                                        <span v-if="company.inTheBank">{{ company.inTheBank }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>БИК</span>
                                        <span v-if="company.bik">{{ company.bik }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>ОКПО</span>
                                        <span v-if="company.okpo">{{ company.okpo }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>ОКВЭД</span>
                                        <span v-if="company.okved">{{ company.okved }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>Имя подписанта</span>
                                        <span v-if="company.signatoryName">{{ company.signatoryName }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>Фамилия подписанта</span>
                                        <span v-if="company.signatoryMiddleName">{{ company.signatoryMiddleName }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>Отчество подписанта</span>
                                        <span v-if="company.signatoryLastName">{{ company.signatoryLastName }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>№ документа</span>
                                        <span v-if="company.documentNumber">{{ company.documentNumber }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                    <li>
                                        <span>Действует на основе</span>
                                        <span v-if="company.basis">{{ company.basis }}</span
                                        ><span v-else>нет данных</span>
                                    </li>
                                </ul>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <hr />
            <div class="CompanyBoxMain-contacts">
                <CompanyBoxContactList @clickCreateContact="$emit('createContact')" :contacts="contacts" />
            </div>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import CompanyBoxContactList from './CompanyBoxContactList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import { MixinCompanyDetailInfo } from '@/components/Company/mixins.js';
import { CompanyCategories } from '@/const/const';
import moment from 'moment';

export default {
    name: 'CompanyBox',
    components: { CompanyBoxLayout, CompanyBoxContactList },
    mixins: [MixinCompanyDetailInfo],
    emits: ['createContact', 'editCompany'],
    inject: ['isMobile'],
    props: {
        company: {
            type: Object,
            default: () => {}
        },
        contacts: {
            type: Array
        }
    },
    data() {
        return {
            leftBoxHeight: null
        };
    },
    computed: {
        productRangesHandler() {
            let result;
            result = this.company.productRanges.map(function (range) {
                return range.product[0].toUpperCase() + range.product.slice(1);
            });
            result = result.join(', ');
            return result;
        },
        categoryHandler() {
            return this.company.categories
                .map(item => CompanyCategories[item.category].name)
                .join(' ')
                .toUpperCase();
        },
        websitesHandler() {
            let commonContact = this.company.contacts.find(contact => contact.type == 1);
            if (commonContact) {
                return commonContact.websites.map(item => item.website);
            } else {
                return false;
            }
        }
    },
    methods: {
        dateFormatter(date) {
            return moment(date).format('DD.MM.YYYY');
        }
    },
    mounted() {
        if (this.isMobile) {
            return;
        } else {
            let divElement = document.querySelector('#left-box');
            let elemHeight = divElement.offsetHeight;
            this.leftBoxHeight = elemHeight;
            document.querySelector('#right-box').style.height = `${this.leftBoxHeight}px`;
        }
    }
};
</script>