<template>
    <div class="messenger-chat-form__categories">
        <RadioOptions
            v-model="currentID"
            :v="v"
            unselect
            required
            :options="tags"
            item-class="messenger-chat-form__category"
        />
    </div>
</template>
<script setup>
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const currentID = defineModel();
defineProps({
    v: { type: Object }
});

const tags = computed(() =>
    store.state.Messenger.tags.map(element => ({ value: element.id, label: element.name }))
);

store.dispatch('Messenger/fetchTags');
</script>
