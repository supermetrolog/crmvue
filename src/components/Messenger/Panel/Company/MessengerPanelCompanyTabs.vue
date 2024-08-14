<template>
    <div class="messenger-panel-company__tabs">
        <Tabs ref="tabs" @changed="setCurrentTab" closed :options="{ useUrlFragment: false }">
            <Tab :id="`object-${company.id}`" :name="`Объекты (${company.objects_count})`">
                <MessengerPanelCompanyObjects
                    v-if="currentTab === `object-${company.id}`"
                    :companyID="company.id"
                />
            </Tab>
            <Tab :id="`request-${company.id}`" :name="`Запросы (${company.requests_count})`">
                <MessengerPanelCompanyRequests
                    v-if="currentTab === `request-${company.id}`"
                    :companyID="company.id"
                />
            </Tab>
            <Tab :name="`Услуги (0)`">
                <InProgress />
            </Tab>
            <Tab :name="`Сделки (0)`">
                <InProgress />
            </Tab>
        </Tabs>
    </div>
</template>
<script>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import InProgress from '@/components/common/InProgress.vue';
import { mapState } from 'vuex';
import MessengerPanelCompanyObjects from '@/components/Messenger/Panel/Company/MessengerPanelCompanyObjects.vue';
import MessengerPanelCompanyRequests from '@/components/Messenger/Panel/Company/MessengerPanelCompanyRequests.vue';

export default {
    name: 'MessengerPanelCompanyTabs',
    components: { MessengerPanelCompanyRequests, MessengerPanelCompanyObjects, InProgress, Tabs },
    provide() {
        return {
            lastRenderedObjectCount: () => this.lastRenderedObjectsCount,
            setLastRendererObjectCount: value => this.setLastRendererObjectCount(value)
        };
    },
    props: {
        company: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentTab: null,
            lastRenderedObjectsCount: 1
        };
    },
    computed: {
        ...mapState({
            currentPanelCompanyID: state => state.Messenger.currentPanelCompanyID,
            currentDialogType: state => state.Messenger.currentDialogType
        })
    },
    methods: {
        setCurrentTab(tabName) {
            this.currentTab = tabName;
        },
        setLastRendererObjectCount(value) {
            this.lastRenderedObjectsCount = value;
        }
    },
    mounted() {
        if (this.currentPanelCompanyID === this.company.id) {
            this.$refs.tabs.selectTab(`#${this.currentDialogType}-${this.company.id}`);
        }
    }
};
</script>
