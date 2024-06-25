<template>
    <a
        @click.prevent.stop="openExternal"
        class="phone-number"
        :class="classList"
        :href="'tel:' + phone.phone"
    >
        {{ phoneText }}
    </a>
</template>

<script>
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

export default {
    name: 'PhoneNumber',
    emits: ['created-contact'],
    props: {
        phone: {
            type: Object,
            default: null
        },
        text: {
            type: String,
            default: null
        },
        contact: {
            type: Object,
            default: null
        },
        classList: {
            type: String,
            default: 'text-center'
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const { show } = useAsyncPopup('PhoneNumber');
        return { show };
    },
    computed: {
        phoneText() {
            if (this.text) return this.text;
            let name = this.phone.phone;
            if (this.phone.exten) name += ' => ' + this.phone.exten;
            return name;
        }
    },
    methods: {
        async openExternal() {
            const newContactCreated = this.show({
                phone: this.phone,
                contact: this.contact,
                classList: this.classList,
                readOnly: this.readOnly
            });

            if (newContactCreated) this.$emit('created-contact');
        }
    }
};
</script>
