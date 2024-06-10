<template>
    <div class="file">
        <a :href="filePath" class="file__body" target="_blank">
            <VLazyImage
                v-if="fileType.name === 'image'"
                @click.prevent.stop="$openPreviewer(filePath)"
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
<script>
import VLazyImage from 'v-lazy-image';
import Tooltip from '@/components/common/Tooltip.vue';
import { fileTypes } from '@/const/types';

const fileTypesList = Object.values(fileTypes);

export default {
    name: 'File',
    components: {
        Tooltip,
        VLazyImage
    },
    emits: ['delete'],
    inject: ['$openPreviewer'],
    props: {
        file: {
            type: Object,
            required: true
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        fileName() {
            if (this.file.original_name) return this.file.original_name;
            return this.file.name || this.file.src.split('/').slice(-1)[0];
        },
        fileSize() {
            let size = +this.file.size;
            let i = 0,
                type = ['б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб'];
            while ((size / 1000) | 0 && i < type.length - 1) {
                size /= 1024;
                i++;
            }

            return size.toFixed(2) + ' ' + type[i];
        },
        fileType() {
            let extension = this.file.extension ?? this.fileName.split('.').slice(-1)[0];

            return (
                fileTypesList.find(element => element.extensions.includes(extension)) || {
                    name: 'unknown',
                    title: 'Не установлено',
                    icon: 'fa-solid fa-file-circle-question'
                }
            );
        },
        filePath() {
            return this.file.src ?? this.$url.api.getUploadedFileUrl(this.file.path);
        }
    }
};
</script>
