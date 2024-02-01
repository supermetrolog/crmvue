<template>
    <div class="file">
        <a :href="file.src" class="file__body" target="_blank">
            <VLazyImage
                v-if="file.fileType.name === 'image'"
                :src="file.src"
                class="file__image"
                alt="file image"
            />
            <template v-else>
                <i class="file__icon" :class="file.fileType.icon" />
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
                                    <span>{{ file.fileType.title }}</span>
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
                    v-if="!reedOnly"
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

export default {
    name: 'File',
    components: {
        Tooltip,
        VLazyImage
    },
    emits: ['delete'],
    props: {
        file: {
            type: Object,
            required: true
        },
        reedOnly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        fileName() {
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
        }
    }
};
</script>
