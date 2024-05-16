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
            <p class="messenger-panel-company__name">{{ companyName }}</p>
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
<script>
import Rating from '@/components/common/Rating.vue';
import { entityOptions } from '@/const/options/options';
import MessengerPanelCompanyTabs from '@/components/Messenger/Panel/Company/MessengerPanelCompanyTabs.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'MessengerPanelCompany',
    components: { HoverActionsButton, MessengerPanelCompanyTabs, Rating },
    emits: ['edit'],
    props: {
        company: {
            type: Object,
            required: true
        }
    },
    computed: {
        companyName() {
            return this.company.nameRu || this.company.nameEng || 'Без названия';
        },
        website() {
            const generalContact = this.company.contacts.find(
                contact => contact.type === entityOptions.contact.typeStatement.GENERAL
            );

            if (generalContact && generalContact.websites.length) {
                const link = generalContact.websites[0].website;
                return this.$formatter.toCorrectUrl(link);
            }

            return null;
        },
        activityGroup() {
            return entityOptions.company.activityGroup[this.company.activityGroup];
        },
        activityProfile() {
            return entityOptions.company.activityProfile[this.company.activityProfile];
        },
        productRanges() {
            return this.company.productRanges
                .map(element => this.$formatter.text().ucFirst(element.product))
                .join(', ');
        }
    }
};
</script>
