<template>
    <div class="messenger-aside-header">
        <Form class="messenger-aside-header__form">
            <Input v-model="querySearch" class="w-100" rounded placeholder="Поиск.." />
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
                @click.prevent="updateDialogs"
                class="messenger-aside-header__button rounded-icon"
            >
                <i class="fa-solid fa-rotate"></i>
            </button>
        </Form>
    </div>
</template>
<script setup>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import { debounce } from '@/utils/debounce.js';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const updateDialogs = () => store.dispatch('Messenger/updateDialogs');
const debouncedUpdateDialogs = debounce(updateDialogs, 400);

const querySearch = computed({
    get() {
        return store.state.Messenger.querySearch;
    },
    set(value) {
        store.commit('Messenger/setQuerySearch', value);
        debouncedUpdateDialogs(value);
    }
});

const clearQuery = () => {
    querySearch.value = '';
};
</script>
