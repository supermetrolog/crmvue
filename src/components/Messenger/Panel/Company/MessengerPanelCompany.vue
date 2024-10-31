<template>
    <div class="messenger-panel-company">
        <div class="messenger-panel-company__card">
            <div class="messenger-panel-company__actions">
                <HoverActionsButton
                    @click="$emit('edit')"
                    label="Редактировать компанию"
                    class="messenger-panel-company__action"
                    small
                >
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton
                    @click="toChat"
                    label="Перейти в чат компании"
                    class="messenger-panel-company__action"
                    small
                >
                    <i class="fa-solid fa-comment"></i>
                </HoverActionsButton>
            </div>
            <div class="messenger-panel-company__header">
                <CompanyLogo
                    v-tippy="'Нажмите, чтобы изменить логотип'"
                    @click="logoFormIsVisible = true"
                    as="div"
                    class="messenger-panel-company__logo"
                    :company-id="company.id"
                    :src="updatedLogo?.src ?? company.logo?.src"
                    :size="60"
                />
                <div>
                    <a
                        :href="'/companies/' + company.id"
                        target="_blank"
                        class="messenger-panel-company__name"
                    >
                        <span v-if="hasUndefinedName" class="messenger-warning bold">
                            НЕТ УНИКАЛЬНОГО НАЗВАНИЯ
                        </span>
                        <span v-else>{{ companyName }}</span>
                    </a>
                    <div class="messenger-panel-company__subtitle">
                        <span>ID{{ company.id }} | </span>
                        <Rating
                            class="messenger-panel-company__rating"
                            :rating="company.rating"
                            :max="3"
                            color="yellow"
                        />
                    </div>
                </div>
            </div>
            <p v-if="website" class="messenger-panel-company__site">
                <span>Сайт: </span>
                <a :href="website" target="_blank" class="link">
                    {{ website }}
                </a>
            </p>
            <p v-else class="messenger-panel-company__site messenger-warning bold">
                Сайт: не заполнен
            </p>
            <ul class="messenger-panel-company__options">
                <li v-if="activityGroup" class="messenger-panel-company__option">
                    <span>- {{ activityGroup }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning">- Группа деятельности не заполнена</span>
                </li>
                <li v-if="activityProfile" class="messenger-panel-company__option">
                    <span>- {{ activityProfile }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning">- Профиль деятельности не заполнен</span>
                </li>
                <li v-if="productRanges" class="messenger-panel-company__option">
                    <span>- {{ productRanges }}</span>
                </li>
                <li v-else class="messenger-panel-company__option">
                    <span class="messenger-warning">- Номенклатура товара не заполнена</span>
                </li>
            </ul>
        </div>
        <MessengerPanelCompanyTabs :key="company.id" :company="company" />
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
    </div>
</template>
<script setup>
import Rating from '@/components/common/Rating.vue';
import MessengerPanelCompanyTabs from '@/components/Messenger/Panel/Company/MessengerPanelCompanyTabs.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed, ref } from 'vue';
import { getCompanyName, toCorrectUrl, ucFirst } from '@/utils/formatter.js';
import { companyOptions } from '@/const/options/company.options.js';
import { contactOptions } from '@/const/options/contact.options.js';
import { alg } from '@/utils/alg.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import Modal from '@/components/common/Modal.vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/useNotify.js';
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';

defineEmits(['edit']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const { openChat } = useMessenger();
const store = useStore();
const notify = useNotify();

const updatedLogo = ref(null);
const logoFormIsVisible = ref(false);
const logoEdited = ref(false);

const hasUndefinedName = computed(() => {
    return (
        props.company.noName ||
        ((!props.company.nameRu ||
            (alg.isNumeric(props.company.nameRu) &&
                Number(props.company.nameRu) === props.company.id)) &&
            !props.company.nameEng)
    );
});

const website = computed(() => {
    const generalContact = props.company.contacts.find(
        contact => contact.type === contactOptions.typeStatement.GENERAL
    );

    if (generalContact && generalContact.websites.length) {
        return toCorrectUrl(generalContact.websites[0].website);
    }

    return null;
});
const activityGroup = computed(() => {
    return companyOptions.activityGroup[props.company.activityGroup];
});
const activityProfile = computed(() => {
    return companyOptions.activityProfile[props.company.activityProfile];
});
const productRanges = computed(() => {
    return props.company.productRanges.map(element => ucFirst(element.product)).join(', ');
});

const companyName = computed(() => getCompanyName(props.company, props.company.id));

const toChat = () => {
    openChat(props.company.id, props.company.id, messenger.dialogTypes.COMPANY);
};

const closeForm = () => {
    logoFormIsVisible.value = false;
    logoEdited.value = false;
};

const onUpdateLogo = logo => {
    closeForm();

    notify.success('Логотип компании обновлен');
    store.commit('Messenger/onCompanyLogoUpdated', { id: props.company.id, logo });
};

const onDeleteLogo = () => {
    closeForm();

    notify.success('Логотип компании удален');
    store.commit('Messenger/onCompanyLogoUpdated', { id: props.company.id });
};
</script>
