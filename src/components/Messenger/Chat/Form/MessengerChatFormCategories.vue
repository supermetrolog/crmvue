<template>
    <div class="messenger-chat-form__categories">
        <RadioChip
            v-for="category in categories"
            :key="category"
            v-model="currentID"
            :value="category.id"
            :label="category.label"
            unselect
            class="messenger-chat-form__category"
        />
    </div>
</template>
<script>
import { messenger } from '@/const/messenger';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'MessengerChatFormCategories',
    components: { RadioChip },
    emits: ['change'],
    props: {
        current: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        categories() {
            return Object.keys(messenger.categories).map(key => ({
                id: key,
                label: messenger.categories[key]
            }));
        },
        currentID: {
            get() {
                return this.current;
            },
            set(value) {
                this.$emit('change', value);
            }
        }
    }
};
</script>
