<template>
    <div class="objects-controll-panel row px-2 py-2">
        <div class="col-12">
            <div class="timeline-actions row no-gutters">
                <div v-for="(button, index) in buttons" :key="index" :class="button.classes">
                    <CustomButton
                        @extraVisibleOpen="$emit('openExtraVisible')"
                        @extraVisibleClose="$emit('closeExtraVisible')"
                        @confirm="$emit(button.emited_event, { comment: $event, wayOfSending })"
                        :title="button.title"
                        :options="button"
                    >
                        <template #btnContent>
                            <i :class="button.icon"></i>
                            <span class="ml-1">{{ button.text }}</span>
                        </template>
                    </CustomButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CustomButton from '@/components/common/CustomButton.vue';

export default {
    name: 'ButtonList',
    components: {
        CustomButton
    },
    emits: [
        'reset',
        'send',
        'alreadySent',
        'done',
        'negative',
        'changeViewMode',
        'openExtraVisible',
        'closeExtraVisible',
        'favorites'
    ],
    props: {
        buttons: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style></style>