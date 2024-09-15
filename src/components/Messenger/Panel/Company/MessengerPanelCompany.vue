<template>
    <div class="messenger-panel-company">
        <div class="messenger-panel-company__card">
            <HoverActionsButton
                @click="$emit('edit')"
                label="Редактировать компанию"
                class="messenger-panel-company__action"
            >
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
            <a
                :href="'/companies/' + company.id"
                target="_blank"
                class="messenger-panel-company__name"
            >
                {{ companyName }}
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
            <p v-if="website" class="messenger-panel-company__site">
                <span>Сайт: </span>
                <a :href="website" target="_blank" class="link">
                    {{ website }}
                </a>
            </p>
            <p v-else class="messenger-panel-company__site messenger-warning">
                Сайт: требуется внести
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
    </div>
</template>
<script setup>
import Rating from '@/components/common/Rating.vue';
import MessengerPanelCompanyTabs from '@/components/Messenger/Panel/Company/MessengerPanelCompanyTabs.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed } from 'vue';
import { getCompanyName, toCorrectUrl, ucFirst } from '@/utils/formatter.js';
import { companyOptions } from '@/const/options/company.options.js';
import { contactOptions } from '@/const/options/contact.options.js';

defineEmits(['edit']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
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
</script>
