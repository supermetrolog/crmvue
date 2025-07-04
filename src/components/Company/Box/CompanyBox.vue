<template>
    <CompanyBoxLayout class="company-box-main">
        <template #before>
            <div class="d-flex gap-2 justify-content-end mb-2 align-items-center">
                <UiDropdownActions label="Действия над компанией" :title="companyShortName" small>
                    <template #trigger>
                        <UiButton small color="light" icon="fa-solid fa-gear">Действия</UiButton>
                    </template>
                    <template #menu>
                        <UiDropdownActionsGroup>
                            <UiDropdownActionsButton
                                @handle="$emit('create-task')"
                                icon="fa-solid fa-bolt"
                                label="Создать задачу"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('schedule-call')"
                                icon="fa-solid fa-phone"
                                label="Запланировать звонок"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('schedule-visit')"
                                icon="fa-solid fa-people-arrows"
                                label="Запланировать встречу"
                            />
                        </UiDropdownActionsGroup>
                        <UiDropdownActionsGroup>
                            <!--                            <UiDropdownActionsButton-->
                            <!--                                @handle="$emit('create-pinned-message')"-->
                            <!--                                icon="fa-solid fa-thumbtack"-->
                            <!--                                label="Добавить сообщение"-->
                            <!--                            />-->
                            <UiDropdownActionsButton
                                @handle="openInSurvey"
                                :icon="
                                    company.has_pending_survey
                                        ? 'fa-solid fa-play'
                                        : 'fa-solid fa-square-poll-horizontal'
                                "
                                :label="
                                    company.has_pending_survey ? 'Продолжить опрос' : 'Начать опрос'
                                "
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('open-in-chat')"
                                icon="fa-solid fa-comment"
                                label="Открыть в чате"
                            />
                        </UiDropdownActionsGroup>
                        <UiDropdownActionsGroup>
                            <UiCan moderator-or-higher>
                                <UiDropdownActionsButton
                                    v-if="!isPassive"
                                    @handle="$emit('change-consultant')"
                                    label="Изменить консультанта"
                                    icon="fa-solid fa-user-tag"
                                />
                            </UiCan>
                            <UiDropdownActionsButton
                                v-if="isPassive"
                                @handle="$emit('enable')"
                                icon="fa-solid fa-undo"
                                label="Восстановить из архива"
                            />
                            <UiDropdownActionsButton
                                v-else
                                @handle="$emit('disable')"
                                icon="fa-solid fa-ban"
                                label="Отправить в архив"
                            />
                            <UiDropdownActionsButton
                                @handle="logoFormIsVisible = true"
                                label="Изменить логотип"
                                icon="fa-solid fa-image"
                            />
                        </UiDropdownActionsGroup>
                    </template>
                </UiDropdownActions>
                <span>|</span>
                <UiButton @click="$emit('edit-company')" small color="light" icon="fa-solid fa-pen">
                    Редактировать
                </UiButton>
            </div>
            <UiField v-if="isPassive" class="company-page__chip w-100 mb-2" color="danger">
                <div class="d-flex align-items-center justify-content-center w-100">
                    <p>Пассив</p>
                    <UiTooltipIcon
                        v-if="company.passive_why !== null"
                        :tooltip="passiveWhyComment"
                        icon="fa-regular fa-question-circle"
                        class="ml-2 icon"
                    />
                </div>
            </UiField>
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
                <div class="company-box-main__block">
                    <ul class="company-box-main__list">
                        <CompanyBoxRow label="Вебсайт">
                            <div v-if="websites.length" class="company-box-main__vertical-list">
                                <a
                                    v-for="website in websites"
                                    :key="website"
                                    :href="toCorrectUrl(website)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ website }}
                                </a>
                            </div>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Группа деятельности">
                            <span v-if="hasActivityGroup">
                                {{ activityGroups }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Профиль деятельности">
                            <span v-if="hasActivityProfile">
                                {{ activityProfiles }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow
                            v-if="company.show_product_ranges"
                            label="Номенклатура товара"
                        >
                            <span v-if="company.productRanges?.length">
                                {{ productRanges }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Внес">
                            <span v-if="company.consultant">
                                {{ company.consultant.userProfile.short_name }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Поступление">
                            <span v-if="company.created_at">
                                {{ createdAt }}
                            </span>
                        </CompanyBoxRow>
                        <CompanyBoxRow label="Обновление">
                            <span v-if="company.updated_at">
                                {{ updatedAt }}
                            </span>
                        </CompanyBoxRow>
                    </ul>
                </div>
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
import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    PassiveWhy
} from '@/const/const';
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
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { toDateFormat } from '@/utils/formatters/date.js';
import { toCorrectUrl } from '@/utils/formatters/string.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import UiCan from '@/components/common/UI/UiCan.vue';

defineEmits([
    'create-contact',
    'edit-company',
    'disable',
    'enable',
    'enable-contact',
    'disable-contact',
    'edit-contact',
    'delete-contact',
    'open-in-chat',
    'create-task',
    'schedule-call',
    'schedule-visit',
    'change-consultant'
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

const productRanges = computed(() => {
    return props.company.productRanges
        .map(range => range.product[0].toUpperCase() + range.product.slice(1))
        .join(', ');
});

const categories = computed(() => {
    return props.company.categories.map(item => ({
        id: item.id,
        label: CompanyCategories[item.category]
    }));
});

const websites = computed(() => {
    let commonContact = props.company.generalContact;
    if (commonContact) return commonContact.websites.map(item => item.website);
    return [];
});

const createdAt = computed(() => toDateFormat(props.company.created_at, 'DD.MM.YYYY'));
const updatedAt = computed(() => toDateFormat(props.company.updated_at, 'DD.MM.YYYY'));

const hasActivityGroup = computed(() => isNotNullish(props.company.activity_groups?.length));
const hasActivityProfile = computed(() => isNotNullish(props.company.activity_profiles?.length));

const activityGroups = computed(() => {
    return props.company.activity_groups
        .map(el => ActivityGroupList[el.activity_group_id].label)
        .join(', ');
});

const activityProfiles = computed(() => {
    return props.company.activity_profiles
        .map(el => ActivityProfileList[el.activity_profile_id].label)
        .join(', ');
});

const companyName = computed(() => getCompanyName(props.company));
const companyShortName = computed(() => getCompanyShortName(props.company));

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

// status

const isPassive = computed(() => props.company.status === 0);

const passiveWhyComment = computed(() => {
    let text = PassiveWhy[props.company.passive_why].label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

// tippy

useTippyText(useTemplateRef('companyLogoEl'), 'Нажмите, чтобы редактировать логотип');

// survey

const { openSurvey } = useSurveyForm();

const openInSurvey = () => {
    openSurvey(props.company.id);
};
</script>
