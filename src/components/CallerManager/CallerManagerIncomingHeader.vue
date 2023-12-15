<template>
    <div class="row no-gutters caller-manager__header">
        <div class="col-12 agregator-info"><p>cian.ru</p></div>
        <div class="col-12 phone-info">
            <div class="icon">
                <img src="@/assets/image/phone-voluem-icon.png" alt="" />
            </div>
            <div class="phone">
                <p class="call-type">Входящий вызов</p>
                <p class="phone-number">{{ call.from }}</p>
            </div>
        </div>
        <div v-if="call.call_ended_status == null" class="col-12 actions">
            <button class="btn btn-success">Принять</button>
            <button class="btn btn-danger">На удержании</button>
        </div>
        <div v-else class="col-12 actions text-center">
            <button class="btn btn-success">Завершить обработку</button>
        </div>
        <CallerManagerTransitionList />
    </div>
</template>

<script>
import CallerManagerTransitionList from '@/components/CallerManager/CallerManagerTransitionList.vue';

export default {
    name: 'CallerManagerIncomingHeader',
    components: {
        CallerManagerTransitionList
    },
    props: {
        call: {
            type: Object
        }
    },
    computed: {},
    methods: {
        getCompanyUrl(id) {
            return this.$apiUrlHelper.url() + '/companies/' + id;
        }
    }
};
</script>

<style></style>
