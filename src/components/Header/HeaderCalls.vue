<template>
    <div class="comments-panel">
        <div class="comments-panel__content" :class="{ loading: loader }">
            <div class="row header no-gutters">
                <div class="col-6 title text-left align-self-center">
                    <p>Звонки</p>
                </div>
                <div class="col-6 readAll text-right align-self-center">
                    <a @click.prevent="viewedAll" href="#"> прочитать все </a>
                </div>
            </div>
            <Loader v-if="loader" class="center" />
            <div v-if="!loader" class="row no-gutters">
                <div class="col-12">
                    <div class="comments-item">
                        <div v-if="CURRENT_CALLS.length" class="old header">
                            <p class="title text-left">текущие звонки</p>
                        </div>
                        <HeaderCallsItem v-for="call of CURRENT_CALLS" :key="call.id" :call="call" is-new />
                        <div class="new header">
                            <p class="text-left title">новые звонки</p>
                        </div>
                        <div v-if="!newCall.length" class="new header mt-4 mb-5">
                            <p class="text-center title no-data">нет новых</p>
                        </div>
                        <HeaderCallsItem v-for="call of newCall" :key="call.id" :call="call" is-new />
                        <div v-if="oldCall.length" class="old header">
                            <p class="title text-left">просмотренные</p>
                        </div>
                        <HeaderCallsItem v-for="call of oldCall" :key="call.id" :call="call" />
                        <div class="col-12 text-center">
                            <Pagination @next="next" :pagination="CALLS_PAGINATION" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//Передать (модератор) Передать админу только с комментарием - передавать с комментарием всем - Там же переать админу
//Для брокеров только кнопка ОТКАЗ и причина отказа - комментарий (галочки - далбаеб, пидорас, не берет трубку)
//Статистика отказов и причина
import Pagination from '@/components/common/Pagination/Pagination.vue';
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import HeaderCallsItem from '@/components/Header/HeaderCallsItem.vue';

export default {
    name: 'HeaderCalls',
    components: {
        HeaderCallsItem,
        Loader,
        Pagination
    },
    data() {
        return {
            loader: false,
            query: null
        };
    },
    computed: {
        ...mapGetters(['CALLS_PAGINATION', 'THIS_USER', 'CALLS', 'CURRENT_CALLS']),
        oldCall() {
            return this.CALLS.filter(
                item => item.status != 0 && item.status != -1 && item.status != 3 && item.status != 2
            );
        },
        newCall() {
            return this.CALLS.filter(item => item.status == 0 || item.status == -1 || item.status == 3);
        }
    },
    methods: {
        ...mapActions([
            'FETCH_CALLS',
            'RESET_CALLS',
            'SEARCH_CALLS',
            'VIEWED_NOT_COUNT_CALLS',
            'VIEWED_ALL_CALLS',
            'FETCH_CALLS_COUNT_POOL'
        ]),
        init() {
            this.query = {
                page: 1,
                caller_id: this.THIS_USER.userProfile.caller_id
            };
        },
        async next(page) {
            this.query.page = page;
            await this.SEARCH_CALLS({ query: this.query, concat: true });
            this.FETCH_CALLS_COUNT_POOL(this.THIS_USER.userProfile.caller_id);
        },
        async viewedAll() {
            this.loader = true;
            await this.VIEWED_ALL_CALLS(this.THIS_USER.userProfile.caller_id);
            this.RESET_CALLS();
            await this.next(1);
            this.loader = false;
        }
    },
    async mounted() {
        this.init();
        this.loader = true;
        await this.SEARCH_CALLS({ query: this.query, concat: true });
        this.FETCH_CALLS_COUNT_POOL(this.THIS_USER.userProfile.caller_id);

        this.loader = false;
    },
    beforeUnmount() {
        this.RESET_CALLS();
        this.VIEWED_NOT_COUNT_CALLS(this.THIS_USER.userProfile.caller_id);
    }
};
</script>

<style></style>