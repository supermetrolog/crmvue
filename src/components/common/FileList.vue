<template>
    <div ref="list" class="file-list">
        <InfiniteLoading v-if="isScrolled" @infinite="$emit('load', $event)">
            <template #complete>
                <EmptyLabel>Файлов больше нет..</EmptyLabel>
            </template>
            <template #spinner>
                <Spinner />
            </template>
        </InfiniteLoading>
        <div v-for="(section, id) in preparedFiles" :key="id" class="file-list__section">
            <span class="file-list__label">
                {{ getLabel(section.label) }}
            </span>
            <div class="file-list__row">
                <File
                    v-for="file in section.files"
                    :key="file.id"
                    @delete="$emit('delete')"
                    :file="file"
                    :read-only="!editable"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import File from '@/components/common/Forms/File.vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Spinner from '@/components/common/Spinner.vue';
import InfiniteLoading from 'v3-infinite-loading';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue';

dayjs.extend(customParseFormat);

defineEmits(['delete', 'load']);
const props = defineProps({
    files: {
        type: Array,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    }
});

const list = ref(null);
const isScrolled = shallowRef(false);

const getLabel = date => {
    if (date.isSame(Date.now(), 'year')) return date.format('MMMM');
    return date.format('MMMM, YYYY');
};

const preparedFiles = computed(() => {
    const sections = props.files.reduce((acc, file) => {
        const dayjsObjectFormat = dayjs(file.created_at).format('MM-YYYY');

        if (dayjsObjectFormat in acc) acc[dayjsObjectFormat].push(file);
        else acc[dayjsObjectFormat] = [file];

        return acc;
    }, {});

    return Object.keys(sections)
        .map(key => ({
            label: dayjs(key, 'MM-YYYY'),
            files: sections[key]
        }))
        .sort((first, second) => first.label - second.label);
});

const scrollToEnd = async () => {
    await nextTick();
    if (list.value) list.value.scrollTop = list.value.scrollHeight;
};

onMounted(async () => {
    await scrollToEnd();
    isScrolled.value = true;
});
</script>
