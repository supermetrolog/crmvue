<template>
    <div class="messenger-aside-header">
        <UiForm class="messenger-aside-header__form">
            <UiInput v-model="querySearch" class="w-100" rounded placeholder="Поиск.." />
            <button
                v-tippy="'Очистить'"
                @click.prevent="clearQuery"
                :disabled="!querySearch.length"
                class="messenger-aside-header__button rounded-icon"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
            <button
                v-tippy="'Обновить выдачу'"
                @click.prevent="$emit('load')"
                class="messenger-aside-header__button rounded-icon"
            >
                <i class="fa-solid fa-rotate"></i>
            </button>
        </UiForm>
    </div>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { debounce } from '@/utils/common/debounce.js';

const emit = defineEmits(['load']);

const store = useStore();

const querySearch = computed({
    get() {
        return store.state.Messenger.consultantsQuerySearch;
    },
    set(value) {
        store.state.Messenger.consultantsQuerySearch = value;
        debouncedUpdate();
    }
});

const debouncedUpdate = debounce(() => {
    emit('load');
}, 500);

const clearQuery = () => {
    querySearch.value = '';
};
</script>
