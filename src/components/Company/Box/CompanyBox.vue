<template>
    <CompanyBoxLayout class="company-box-main">
        <template #before>
            <div class="d-flex gap-2 mb-2 align-items-center">
                <CompanyBoxStatus :company />
                <CompanyBoxActions
                    @create-task="$emit('create-task')"
                    @schedule-call="$emit('schedule-call')"
                    @schedule-visit="$emit('schedule-visit')"
                    @open-in-chat="$emit('open-in-chat')"
                    @open-in-survey="openInSurvey"
                    @change-consultant="$emit('change-consultant')"
                    @enable="$emit('enable')"
                    @delete="$emit('delete')"
                    @change-logo="logoFormIsVisible = true"
                    @request-delete="$emit('request-delete')"
                    @request-enable="$emit('request-enable')"
                    @request-change-consultant="$emit('request-change-consultant')"
                    :company
                />
                <span>|</span>
                <UiButton @click="$emit('edit-company')" small color="light" icon="fa-solid fa-pen">
                    Редактировать
                </UiButton>
            </div>
        </template>
        <template #header>
            <div class="company-box-main__header">
                <div>
                    <p class="company-box-main__title">
                        <UiTooltipIcon
                            v-if="company.is_individual"
                            icon="fa-solid fa-user-tie"
                            tooltip="Физ.лицо"
                            class="mr-1"
                        />
                        <span>{{ companyName }}</span>
                    </p>
                    <p v-if="company.companyGroup" class="company-box-main__group">
                        {{ company.companyGroup.full_name }}
                    </p>
                </div>
                <div class="company-box-main__info ml-md-auto">
                    <UiField
                        v-for="category in categories"
                        :key="category.id"
                        color="success-light"
                        class="text-white"
                    >
                        {{ category.label }}
                    </UiField>
                    <span>ID {{ company.id }}</span>
                    <Rating v-if="company.rating" :rating="company.rating" />
                </div>
            </div>
        </template>
        <template #content>
            <div class="company-box-main__content">
                <CompanyBoxInfo :company class="company-box-main__block" />
                <div class="company-box-main__block">
                    <Tabs nav-item-link-class="company-box-main__tab dashboard-chip">
                        <Tab name="Описание">
                            <div class="d-flex gap-3">
                                <CompanyLogo
                                    ref="companyLogoEl"
                                    @click="logoFormIsVisible = true"
                                    as="div"
                                    :company-id="company.id"
                                    :src="company.logo?.src"
                                    class="company-box-main__logo"
                                    :size="130"
                                />
                                <div class="company-box-main__description">
                                    <p v-if="company.description">
                                        {{ company.description }}
                                    </p>
                                    <p v-else>Описание не указано</p>
                                </div>
                            </div>
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
                                    <CompanyBoxRow
                                        label="Юр. адрес"
                                        :value="company.legalAddress"
                                    />
                                    <CompanyBoxRow label="ОГРН" :value="company.ogrn" />
                                    <CompanyBoxRow label="ИНН" :value="company.inn" />
                                    <CompanyBoxRow label="КПП" :value="company.kpp" />
                                    <CompanyBoxRow
                                        label="Расчетный счет"
                                        :value="company.checkingAccount"
                                    />
                                    <CompanyBoxRow
                                        label="Кор. счет"
                                        :value="company.correspondentAccount"
                                    />
                                    <CompanyBoxRow label="В банке" :value="company.inTheBank" />
                                </ul>
                                <ul class="company-box-main__list">
                                    <CompanyBoxRow label="БИК" :value="company.bik" />
                                    <CompanyBoxRow label="ОКПО" :value="company.okpo" />
                                    <CompanyBoxRow label="ОКВЭД" :value="company.okved" />
                                    <CompanyBoxRow
                                        label="Имя подписанта"
                                        :value="company.signatoryName"
                                    />
                                    <CompanyBoxRow
                                        label="Фамилия подписанта"
                                        :value="company.signatoryMiddleName"
                                    />
                                    <CompanyBoxRow
                                        label="Отчество подписанта"
                                        :value="company.signatoryLastName"
                                    />
                                    <CompanyBoxRow
                                        label="№ документа"
                                        :value="company.documentNumber"
                                    />
                                    <CompanyBoxRow
                                        label="Действует на основе"
                                        :value="company.basis"
                                    />
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
            <CompanyBoxContactList
                @create="$emit('create-contact')"
                @delete="$emit('delete-contact', $event)"
                @enable="$emit('enable-contact', $event)"
                @disable="$emit('disable-contact', $event)"
                @edit="$emit('edit-contact', $event)"
                @change-company="$emit('change-company', $event)"
                :contacts="contacts"
                editable
            />
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
import { CompanyCategories } from '@/const/const';
import { computed, ref, useTemplateRef } from 'vue';
import CompanyBoxContactList from '@/components/Company/Box/CompanyBoxContactList.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import File from '@/components/common/Forms/File.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import CompanyBoxRow from '@/components/Company/Box/CompanyBoxRow.vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import Rating from '@/components/common/Rating.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import Modal from '@/components/common/Modal.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useStore } from 'vuex';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import CompanyBoxStatus from '@/components/Company/Box/CompanyBoxStatus.vue';
import CompanyBoxActions from '@/components/Company/Box/CompanyBoxActions.vue';
import CompanyBoxInfo from '@/components/Company/Box/CompanyBoxInfo.vue';

defineEmits([
    'create-contact',
    'edit-company',
    'delete',
    'enable',
    'enable-contact',
    'disable-contact',
    'edit-contact',
    'delete-contact',
    'open-in-chat',
    'create-task',
    'schedule-call',
    'schedule-visit',
    'change-consultant',
    'change-company',
    'request-delete',
    'request-enable',
    'request-change-consultant'
]);

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

const categories = computed(() => {
    return props.company.categories.map(item => ({
        id: item.id,
        label: CompanyCategories[item.category]
    }));
});

const companyName = computed(() => getCompanyName(props.company));

function closeForm() {
    logoFormIsVisible.value = false;
    logoEdited.value = false;
}

function onUpdateLogo(logo) {
    closeForm();

    notify.success('Логотип компании обновлен');
    store.commit('setCompanyLogo', logo);
}

function onDeleteLogo() {
    closeForm();

    notify.success('Логотип компании удален');
    store.commit('setCompanyLogo', null);
}

// tippy

useTippyText(useTemplateRef('companyLogoEl'), 'Нажмите, чтобы редактировать логотип');

// survey

const { openSurvey } = useSurveyForm();

const openInSurvey = () => {
    openSurvey(props.company.id);
};
</script>
