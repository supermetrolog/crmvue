<template>
    <div class="file">
        <a :href="filePath" class="file__body" target="_blank">
            <VLazyImage
                v-if="fileType.name === 'image'"
                @click.prevent.stop="onImageClick"
                :src="filePath"
                class="file__image"
                alt="file image"
            />
            <template v-else>
                <div class="file__icon">
                    <i :class="fileType.icon" />
                </div>
                <p class="file__name">{{ fileName }}</p>
            </template>
            <div class="file__actions">
                <Tooltip>
                    <template #trigger>
                        <button @click.prevent class="file__action">
                            <i class="fa-solid fa-question"></i>
                        </button>
                    </template>
                    <template #content>
                        <div class="file__description">
                            <p class="file__subtitle">Описание файла:</p>
                            <ul class="file__description-list">
                                <li class="file__option">
                                    <span>Название: </span>
                                    <span>{{ fileName }}</span>
                                </li>
                                <li class="file__option">
                                    <span>Тип файла: </span>
                                    <span>{{ fileType.title }}</span>
                                </li>
                                <li v-if="file.size" class="file__option">
                                    <span>Размер: </span>
                                    <span>{{ fileSize }}</span>
                                </li>
                                <li v-if="file.originalSize" class="file__option">
                                    <span>Оргинитальный размер (до сжатия): </span>
                                    <span>{{ originalFileSize }}</span>
                                </li>
                                <li v-if="file.created_at" class="file__option">
                                    <span>Добавлен: </span>
                                    <span>{{ file.created_at }}</span>
                                </li>
                            </ul>
                        </div>
                    </template>
                </Tooltip>
                <button
                    v-if="!readOnly"
                    v-tippy="'Удалить'"
                    @click.prevent="$emit('delete')"
                    class="file__action"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </a>
    </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import Tooltip from '@/components/common/Tooltip.vue';
import { fileTypes } from '@/const/types';
import { computed } from 'vue';
import { toFileSizeFormat } from '@/utils/formatters/number.js';
import { getLinkUploadedFile } from '@/utils/url.js';
import { usePreviewer } from '@/composables/usePreviewer.js';

const fileTypesList = Object.values(fileTypes);

const emit = defineEmits(['delete', 'preview']);
const props = defineProps({
    file: {
        type: Object,
        required: true
    },
    readOnly: {
        type: Boolean,
        default: false
    },
    draggable: {
        type: Boolean,
        default: false
    },
    customPreview: {
        type: Boolean,
        default: false
    }
});

const { preview } = usePreviewer();

const fileName = computed(() => {
    if (props.file.original_name) return props.file.original_name;
    return props.file.name || props.file.src.split('/').slice(-1)[0];
});

const fileSize = computed(() => toFileSizeFormat(Number(props.file.size)));
const originalFileSize = computed(() => toFileSizeFormat(Number(props.file.originalSize)));

const fileType = computed(() => {
    let extension = props.file.extension ?? fileName.value.split('.').slice(-1)[0];

    return (
        fileTypesList.find(element => element.extensions.includes(extension)) || {
            name: 'unknown',
            title: 'Не установлено',
            icon: 'fa-solid fa-file-circle-question'
        }
    );
});

const filePath = computed(() => {
    return props.file.src ?? getLinkUploadedFile(props.file.path);
});

const onImageClick = () => {
    if (props.customPreview) emit('preview');
    else {
        preview({
            src: props.file.src,
            id: props.file.id
        });
    }
};
</script>
