<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="1. Знакомство с клиентом"
                    :success="step.done"
                >
                    <p>
                        1.2. Проверьте правильность заполнения запроса, отредактируйте при
                        необходимости и затем утвердите
                    </p>
                    <template #footer>
                        <div class="d-flex gap-2">
                            <TimelineButton
                                @click="selectDone"
                                success
                                :active="data.done"
                                :disabled
                            >
                                <span>Подтвердить</span>
                                <i class="fa-solid fa-thumbs-up icon"></i>
                            </TimelineButton>
                            <TimelineButton @click="$emit('edit-request')" solid icon danger>
                                <span>Редактировать</span>
                                <i class="fa-solid fa-pen icon"></i>
                            </TimelineButton>
                            <TimelineButton :active="data.negative" solid icon warning disabled>
                                <span>Шаг на паузу</span>
                                <i class="fa-regular fa-circle-pause icon"></i>
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-12">
                <Loader v-if="isLoading" />
                <RequestPreview
                    v-else-if="request"
                    @edit="$emit('edit-request')"
                    :request="request"
                    read-only
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { MeetingDoneComment } from '@/components/Timeline/comments.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Loader from '@/components/common/Loader.vue';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';
import RequestPreview from '@/components/Request/RequestPreview.vue';

const emit = defineEmits(['update-step', 'updated-objects', 'next-step', 'edit-request']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const { data, request } = useTimelineContext(() => props.step);

const { isLoading } = useDelayedLoader();

function selectDone() {
    if (data.value.done) {
        data.value.done = 0;
        data.value.newActionComments = [];
        data.value.status = 0;
    } else {
        data.value.done = 1;
        data.value.status = 1;
        data.value.newActionComments = [new MeetingDoneComment(data.value)];
    }

    emit('update-step', data.value, data.value.done);
}
</script>
