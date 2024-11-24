<template>
    <CompanyBoxLayout class="company-box-main">
        <template #header>
            <div class="company-box-main__header">
                <span class="company-box-main__title">
                    <i
                        v-if="company.is_individual"
                        v-tippy="'Физ.лицо'"
                        class="fa-solid fa-user-tie mr-1"
                    ></i>
                    <span>{{ companyName }}</span>
                </span>
                <div class="company-box-main__actions">
                    <HoverActionsButton @click="$emit('edit-company')" small label="Редактировать">
                        <i class="fa-solid fa-pen" />
                    </HoverActionsButton>
                </div>
                <div class="company-box-main__info ml-md-auto">
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
                        <Tab name="Логотип">
                            <CompanyLogo
                                v-tippy="'Нажмите, чтобы редактировать логотип'"
                                @click="logoFormIsVisible = true"
                                as="div"
                                :company-id="company.id"
                                :src="company.logo?.src"
                                class="company-box-main__logo mr-2"
                                :size="90"
                            />
                        </Tab>
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
            <teleport to="body">
                <Modal
                    @close="closeForm"
                    :show="logoFormIsVisible"
                    :close-on-outside-click="!logoEdited"
                    :close-on-press-esc="!logoEdited"
                    :min-height="200"
                    title="Обновление логотипа"
                    width="800"
                >
                    <FormCompanyLogo
                        @updated="onUpdateLogo"
                        @deleted="onDeleteLogo"
                        @canceled="closeForm"
                        @edited="logoEdited = true"
                        :company="company"
                    />
                </Modal>
            </teleport>
        </template>
    </CompanyBoxLayout>
</template>

<script setup>
import { ActivityGroupList, ActivityProfileList, CompanyCategories } from '@/const/const';
import { computed, ref } from 'vue';
import CompanyBoxContactList from '@/components/Company/Box/CompanyBoxContactList.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import File from '@/components/common/Forms/File.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import CompanyBoxRow from '@/components/Company/Box/CompanyBoxRow.vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import Rating from '@/components/common/Rating.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import Modal from '@/components/common/Modal.vue';
import { useNotify } from '@/utils/useNotify.js';
import { useStore } from 'vuex';
import { getCompanyName } from '@/utils/formatter.js';

defineEmits(['create-contact', 'edit-company']);

const props = defineProps({
    company: {
        type: Object,
        default: () => ({})
    },
    contacts: {
        type: Array,
        default: () => []
    }
});

const notify = useNotify();
const store = useStore();

const logoFormIsVisible = ref(false);
const logoEdited = ref(false);

const productRanges = computed(() => {
    return props.company.productRanges
        .map(range => range.product[0].toUpperCase() + range.product.slice(1))
        .join(', ');
});

const categories = computed(() => {
    return props.company.categories.map(item => CompanyCategories[item.category]);
});

const websites = computed(() => {
    let commonContact = props.company.contacts.find(contact => contact.type === 1);
    if (commonContact) return commonContact.websites.map(item => item.website);
    return [];
});

const activityGroup = computed(() => {
    return ActivityGroupList[props.company.activityGroup].label;
});

const activityProfile = computed(() => {
    return ActivityProfileList[props.company.activityProfile].label;
});

const companyName = computed(() => getCompanyName(props.company));

const closeForm = () => {
    logoFormIsVisible.value = false;
    logoEdited.value = false;
};

const onUpdateLogo = logo => {
    closeForm();

    notify.success('Логотип компании обновлен');
    store.commit('setCompanyLogo', logo);
};

const onDeleteLogo = () => {
    closeForm();

    notify.success('Логотип компании удален');
    store.commit('setCompanyLogo', null);
};
</script>
