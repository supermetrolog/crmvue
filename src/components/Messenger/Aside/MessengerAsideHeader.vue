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
<script>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import { debounce } from '@/utils/debounce.js';
import { mapActions } from 'vuex';

export default {
    name: 'MessengerAsideHeader',
    components: { Input, Form },
    data() {
        return {
            debouncedUpdateDialogs: null
        };
    },
    computed: {
        querySearch: {
            get() {
                return this.$store.state.Messenger.querySearch;
            },
            set(value) {
                this.$store.commit('Messenger/setQuerySearch', value);
                this.debouncedUpdateDialogs(value);
            }
        }
    },
    methods: {
        ...mapActions({ updateDialogs: 'Messenger/updateDialogs' }),
        clearQuery() {
            this.querySearch = '';
        }
    },
    created() {
        this.debouncedUpdateDialogs = debounce(this.updateDialogs, 200);
    }
};
</script>
