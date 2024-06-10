<template>
    <div ref="list" class="file-list">
        <InfiniteLoading @infinite="$emit('load', $event)">
            <template #complete><span></span></template>
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
<script>
import File from '@/components/common/Forms/File.vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ScrollToEndMixin } from '@/components/common/mixins';
import Spinner from '@/components/common/Spinner.vue';
import InfiniteLoading from 'v3-infinite-loading';

dayjs.extend(customParseFormat);

export default {
    name: 'FileList',
    components: { Spinner, File, InfiniteLoading },
    mixins: [ScrollToEndMixin],
    emits: ['delete', 'load'],
    props: {
        files: {
            type: Array,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        preparedFiles() {
            const sections = this.files.reduce((acc, file) => {
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
        }
    },
    methods: {
        getLabel(date) {
            if (date.isSame(Date.now(), 'year')) return date.format('MMMM');
            return date.format('MMMM, YYYY');
        }
    }
};
</script>
