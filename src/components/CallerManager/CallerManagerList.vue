<template>
    <div class="caller-manager__list">
        <CallerManagerListItem
            v-for="call in SESSION_CALLS"
            :key="call.id"
            @clickItem="clickItem"
            :class="{ active: activeItem == call }"
            :call="call"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CallerManagerListItem from '@/components/CallerManager/CallerManagerListItem.vue';

export default {
    name: 'CallerManagerList',
    components: {
        CallerManagerListItem
    },
    props: {
        activeItem: {
            type: Object
        }
    },
    data() {
        return {
            sessionCalls: []
        };
    },
    computed: {
        ...mapGetters(['CURRENT_CALLS', 'SESSION_CALLS'])
    },
    watch: {
        SESSION_CALLS() {
            if (!this.activeItem) return;
            let item = this.SESSION_CALLS.find(item => item.id == this.activeItem.id);
            if (item) {
                this.$emit('updateItem', item);
            }
        }
    },
    methods: {
        clickItem(call) {
            this.$emit('clickItem', call);
        }
    }
};
</script>

<style></style>
