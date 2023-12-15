<template>
    <div class="row no-gutters caller-manager__header">
        <div class="col-12 agregator-info"><p>cian.ru</p></div>
        <div class="col-12 phone-info">
            <div class="icon">
                <img src="@/assets/image/phone-voluem-icon.png" alt="" />
            </div>
            <div class="phone">
                <p class="call-type">Исходящий вызов</p>
                <p class="phone-number">{{ call.to }}</p>
            </div>
        </div>
        <div v-if="call.call_ended_status == null" class="col-12 text-center actions">
            <button class="btn btn-danger">Сбросить</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CallerManagerOutcomingHeader',
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
