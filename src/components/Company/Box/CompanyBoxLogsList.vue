<template>
    <div class="CompanyLogsList" :class="[target]">
        <InfiniteLoading v-bind="$attrs" top :target="`.${target}`">
            <template #complete><span></span></template>
        </InfiniteLoading>
        <div v-if="logsCount == 0" class="CompanyLogsList-empty">
            <span>Будьте первым!</span>
            <span>Не оставлено ни единого комментария.</span>
        </div>
        <CompanyLogsItem
            v-for="(comment, idx) in formattedLogs"
            :key="comment.id"
            class="result"
            :log-item="comment"
            :prevent-log-item="getPreventLogItem(idx)"
        />
        <div class="CompanyLogsList-scroll"></div>
    </div>
</template>

<script>
import InfiniteLoading from 'v3-infinite-loading';
import { logHandler } from '@/utils/logs.js';
import 'v3-infinite-loading/lib/style.css';
import CompanyLogsItem from '@/components/Company/Box/CompanyBoxLogsListItem.vue';

export default {
    name: 'CompanyLogsList',
    components: { CompanyLogsItem, InfiniteLoading },
    props: {
        logs: {
            type: Array,
            required: true
        },
        logsCount: {
            type: Number,
            default: 0
        },
        target: {
            type: String,
            default: 'infinite-loading'
        }
    },
    computed: {
        formattedLogs() {
            return logHandler.logListFormat(this.logs);
        },
        lastMessage() {
            let [result] = this.formattedLogs.slice(-1);
            return result;
        }
    },
    watch: {
        lastMessage: {
            handler: function (newItem, oldItem) {
                if (newItem?.id !== oldItem?.id) {
                    this.lastMessageScroll();
                }
            },
            deep: true
        }
    },
    methods: {
        getPreventLogItem(index) {
            if (!index) {
                return null;
            }
            if (Array.isArray(this.formattedLogs) && this.formattedLogs[index - 1]) {
                return this.formattedLogs[index - 1];
            }
        },
        lastMessageScroll(b) {
            let e = document.querySelector('.CompanyLogsList-scroll');
            if (!e) return;

            e.scrollIntoView({
                behavior: b || 'auto',
                block: 'end'
            });
        }
    }
};
</script>