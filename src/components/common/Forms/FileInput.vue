<template>
    <div @drop.prevent @dragover.prevent class="file-input">
        <div class="file-input__container">
            <label class="file-input__label" :class="{ required: required }">
                <span v-if="label">
                    {{ label }}
                </span>
            </label>
            <div
                v-if="!readOnly"
                @click="open"
                @dragover.prevent="isDragEnter = true"
                @dragleave.prevent="isDragEnter = false"
                @drop.prevent="dropHandler"
                @dragenter.prevent="isDragEnter = true"
                class="file-input__field"
                :class="[
                    {
                        'file-input__field--dragenter': isDragEnter,
                        'file-input__field--short': short
                    },
                    fieldClass
                ]"
            >
                <i class="file-input__icon fa-solid fa-download" />
                <div class="file-input__helper">
                    <p class="file-input__title">Загрузите файл</p>
                    <p class="file-input__description">
                        Переместите файлы в эту зону или просто кликните для выбора файлов
                    </p>
                </div>
            </div>
            <div
                v-if="(localFiles.length || files.length) && !custom"
                class="d-flex gap-2 flex-wrap mt-2"
            >
                <UiButton @click="clearAll" icon="fa-solid fa-xmark" small color="light">
                    Удалить все
                </UiButton>
                <UiButton
                    v-if="files.length"
                    @click="clear"
                    icon="fa-solid fa-xmark"
                    small
                    color="light"
                    :disabled="!localFiles.length"
                >
                    Удалить добавленные
                </UiButton>
            </div>
            <VueDraggableNext
                v-if="localFiles.length && !custom"
                v-model="localFiles"
                group="local-files"
                class="file-input__list row"
                :animation="false"
                :disabled="!sortable || readOnly"
            >
                <transition-group type="transition" name="flip-list">
                    <File
                        v-for="(file, index) in localFiles"
                        :key="file.src"
                        @delete="deleteLocalFile(index)"
                        :file="file"
                        class="file--new"
                        :class="fileWidthClass"
                        :read-only="readOnly"
                        :draggable="sortable"
                    />
                </transition-group>
            </VueDraggableNext>
            <VueDraggableNext
                v-if="files.length && !custom"
                v-model="files"
                group="files"
                class="file-input__list row"
                :animation="false"
                :disabled="!sortable || readOnly"
            >
                <transition-group type="transition" name="flip-list">
                    <File
                        v-for="(file, index) in files"
                        :key="file.src"
                        @delete="deleteFile(index)"
                        :file="file"
                        :class="fileWidthClass"
                        :read-only="readOnly"
                        :draggable="sortable"
                    />
                </transition-group>
            </VueDraggableNext>
        </div>
    </div>
</template>

<script setup>
import { fileTypes } from '@/const/types';
import File from '@/components/common/Forms/File.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import imageCompression from 'browser-image-compression';
import { blobToFile } from '@/utils/helpers/forms/blobToFile.js';
import { SIZE_TO_COMPRESSION } from '@/const/messenger.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useFileDialog } from '@vueuse/core';
import { getApiObjects } from '@/utils/url.js';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

const unknownFileType = {
    name: 'unknown',
    title: 'Не установлено',
    icon: 'fa-solid fa-file-circle-question'
};

const allowedTypeList = Object.values(fileTypes);

const emit = defineEmits(['update:data', 'update:native', 'updated']);
const props = defineProps({
    data: {
        type: [Array, String],
        default: () => []
    },
    native: {
        type: [Array, FileList],
        default: () => []
    },
    label: String,
    single: Boolean,
    accept: {
        type: String,
        default: '.*'
    },
    readOnly: Boolean,
    required: Boolean,
    onlyImages: Boolean,
    apiUrl: String,
    onlyLinks: Boolean,
    itemClass: String,
    fieldClass: [String, Array, Object],
    itemSize: {
        type: Number,
        default: 50
    },
    sortable: Boolean,
    custom: Boolean,
    short: Boolean
});
const files = ref([]);

const isDragEnter = ref(false);

const acceptList = computed(() => (props.onlyImages ? 'image/*' : props.accept));

const fileWidthClass = computed(() => {
    if (props.itemClass) return props.itemClass;

    return [
        {
            'col-6': props.single && props.onlyImages,
            'col-4': props.onlyImages
        },
        'col-2'
    ];
});

const localFiles = ref([]);

watch(
    localFiles,
    () => {
        emit('update:native', localFiles.value);
        emit('updated', localFiles.value);
    },
    { deep: true }
);

watch(
    () => props.data,
    () => {
        setExistFiles();
    }
);

const { open, reset, onChange } = useFileDialog({
    accept: acceptList.value,
    multiple: !props.single
});

onChange(_files => {
    if (props.single) {
        files.value = [];
        localFiles.value = [];
        emit('update:data', null);
    }

    if (isNotNullish(_files)) {
        setProperties(Array.from(_files));
    }
});

function setProperties(files) {
    files.forEach(file => {
        file.fileType = getFileTypeByName(file.name);

        if (file.type.match('image')) {
            if (file.size >= SIZE_TO_COMPRESSION) {
                imageCompression(file, compressionOptions).then(async compressed => {
                    const _file = blobToFile(compressed, file);
                    _file.src = await imageCompression.getDataUrlFromFile(compressed);
                    localFiles.value.push(_file);
                });
            } else {
                imageCompression.getDataUrlFromFile(file).then(src => {
                    file.src = src;
                    localFiles.value.push(file);
                });
            }

            return file;
        }

        localFiles.value.push(file);

        return file;
    });
}

function deleteFile(key) {
    if (props.single) {
        emit('update:data', null);
    }

    emit(
        'update:data',
        props.data.filter((file, index) => index !== key)
    );
}

function deleteLocalFile(index) {
    localFiles.value = localFiles.value.filter((_, idx) => idx !== index);
}

function getFileTypeByExtension(extension) {
    return (
        allowedTypeList.find(element => element.extensions.includes(extension)) || unknownFileType
    );
}

function getFileTypeByName(meta) {
    let extension = meta.split('.').slice(-1)[0];
    return getFileTypeByExtension(extension);
}

function createFileObject(element) {
    if (element.extension) {
        return {
            ...element,
            fileType: getFileTypeByExtension(element.extension)
        };
    }

    if (element.type) {
        return {
            ...element,
            fileType: getFileTypeByName(element.name)
        };
    }

    return {
        src: (props.apiUrl ?? getApiObjects()) + element,
        fileType: getFileTypeByName(element)
    };
}

function setExistFiles() {
    if (isArray(props.data)) {
        files.value = props.data.map(fileUrl => createFileObject(fileUrl));
    } else if (isNotNullish(props.data)) {
        files.value = [createFileObject(props.data)];
    } else {
        files.value = [];
    }
}

function dropHandler(event) {
    isDragEnter.value = false;
    let files = Array.from(event.dataTransfer.files);

    if (props.single) {
        files.value = [];
        localFiles.value = [];
        emit('update:data', null);
        files = files.slice(-1);
    }

    setProperties(files);
}

function clear() {
    localFiles.value = [];
    reset();

    emit('update:native', []);
}

function clearAll() {
    files.value = [];
    localFiles.value = [];
    reset();

    emit('update:data', props.single ? null : []);
    emit('update:native', localFiles.value);
}

if (!props.custom) {
    setExistFiles();
}

onMounted(() => {
    if (isNotNullish(props.native) && !props.custom) {
        localFiles.value = [...props.native];
    }
});

defineExpose({ clear, clearAll, open });
</script>
<style>
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}
</style>
