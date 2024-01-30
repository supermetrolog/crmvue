<template>
    <div class="object-holding-contact">
        <div class="object-holding-contact__avatar">
            <span>{{ avatarText }}</span>
        </div>
        <div class="object-holding-contact__description">
            <p class="object-holding-contact__name">
                <span>{{ contact.full_name }}</span>
                <span v-if="contact.position" class="object-holding-contact__message">
                    {{ position }}
                </span>
            </p>
            <ul class="object-holding-contact__list">
                <li
                    v-for="phone in contact.phones"
                    :key="phone.id"
                    class="object-holding-contact__item"
                >
                    {{ phone.phone }}
                </li>
                <li v-if="!contact.phones.length" class="object-holding-contact__item">
                    Телефон не указан
                </li>
                <li
                    v-for="email in contact.emails"
                    :key="email.id"
                    class="object-holding-contact__item"
                >
                    {{ email.email }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { PositionList } from '@/const/const';

export default {
    name: 'ComplexHoldingCompanyContact',
    props: {
        contact: {
            type: Object,
            required: true
        }
    },
    computed: {
        avatarText() {
            if (this.contact.middle_name && this.contact.first_name)
                return `${this.contact.first_name[0]}${this.contact.middle_name[0]}`;

            if (this.contact.full_name) return this.$formatter.initials(this.contact.full_name);
            else return '?';
        },
        position() {
            return PositionList[this.contact.position].label;
        }
    }
};
</script>
