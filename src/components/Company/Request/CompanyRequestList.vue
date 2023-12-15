<template>
    <div class="company-request-list fuck">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <Modal v-if="deletedRequestItem" @close="clickCloseModal" title="Удаление запроса " class="action-modal">
                <div class="row no-gutters">
                    <div class="col-12 text-center">
                        <h4 class="text-dark">Вы уверены что хотите удалить запрос?</h4>
                        <CompanyRequestItem :request="deletedRequestItem" :reedOnly="true" />
                    </div>
                    <div class="col-12 mt-4 text-center">
                        <Loader v-if="deleteLoader" class="center small" />
                        <button
                            @click="deleteRequest(deletedRequestItem)"
                            class="btn btn-danger"
                            :disabled="deleteLoader"
                        >
                            Удалить
                        </button>
                        <button @click="clickCloseModal" class="btn btn-primary ml-1" :disabled="deleteLoader">
                            Нет
                        </button>
                    </div>
                </div>
            </Modal>
        </transition>
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <Modal v-if="clonedRequestItem" @close="clickCloseModal" title="Клонирование запроса " class="action-modal">
                <div class="row no-gutters">
                    <div class="col-12 text-center">
                        <h4 class="text-dark">Вы уверены, что хотите клонировать этот запрос?</h4>
                        <CompanyRequestItem :request="clonedRequestItem" :reedOnly="true" :withDeal="false" />
                    </div>
                    <div class="col-12 mt-4 text-center">
                        <Loader v-if="cloneLoader" class="center small" />
                        <button
                            @click="cloneRequest(clonedRequestItem)"
                            class="btn btn-success"
                            :disabled="cloneLoader"
                        >
                            Клонировать
                        </button>
                        <button @click="clickCloseModal" class="btn btn-primary ml-1" :disabled="cloneLoader">
                            Нет
                        </button>
                    </div>
                </div>
            </Modal>
        </transition>
        <div v-if="requests.length" class="row mb-2">
            <div class="col-12 p-0">
                <div class="row no-gutters">
                    <div class="col-6 pr-2">
                        <div class="row no-gutters">
                            <div class="col-6"><p>Запросы</p></div>
                            <div class="col-6 text-right">
                                <p>{{ requests.length }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 pl-2">
                        <div class="row no-gutters">
                            <div class="col-6"><p>Сделки</p></div>
                            <div class="col-6 text-right">
                                <p>{{ dealsCount }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CompanyRequestItem
            v-for="request of requests"
            :key="request.id"
            @openCompanyRequestFormForUpdate="openCompanyRequestFormForUpdate"
            @deleteRequest="clickDeleteRequest"
            @cloneRequest="clickCloneRequest"
            :request="request"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyRequestItem from '@/components/Company/Request/CompanyRequestItem.vue';

export default {
    name: 'CompanyRequestList',
    components: {
        Loader,
        Modal,
        CompanyRequestItem
    },
    props: {
        requests: {
            type: Array
        }
    },
    data() {
        return {
            deletedRequestItem: null,
            deleteLoader: false,
            clonedRequestItem: null,
            cloneLoader: false
        };
    },
    computed: {
        dealsCount() {
            const requestsWithDeal = this.requests.filter(item => item.deal != null);
            if (Array.isArray(requestsWithDeal)) {
                return requestsWithDeal.length;
            }
            return 0;
        }
    },
    methods: {
        ...mapActions(['DELETE_REQUEST', 'CREATE_REQUEST']),
        openCompanyRequestFormForUpdate(request) {
            this.$emit('openCompanyRequestFormForUpdate', request);
        },
        clickCloseModal() {
            this.deletedRequestItem = null;
            this.clonedRequestItem = null;
        },
        clickDeleteRequest(request) {
            this.deletedRequestItem = request;
        },
        clickCloneRequest(request) {
            this.clonedRequestItem = request;
        },
        async cloneRequest(request) {
            this.cloneLoader = true;
            await this.CREATE_REQUEST(request);
            this.cloneLoader = false;
            this.clonedRequestItem = null;
            this.$emit('cloned');
        },
        async deleteRequest(request) {
            this.deleteLoader = true;
            await this.DELETE_REQUEST(request);
            this.deleteLoader = false;
            this.deletedRequestItem = null;
        }
    },
    emits: ['openCompanyRequestFormForUpdate', 'cloned']
};
</script>

<style></style>