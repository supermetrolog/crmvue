<template>
    <div @drop.prevent @dragover.prevent class="file-input">
        <div class="file-input__container">
            <label class="file-input__label" :class="{ required: required }" :for="$id('file')">
                <span v-if="label">
                    {{ label }}
                </span>
            </label>
            <div
                v-if="!readOnly"
                @click="clickOpenFile"
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
            <input
                :id="$id('file')"
                ref="fileInput"
                @change.stop="onChange"
                type="file"
                :multiple="!single"
                :accept="acceptList"
            />
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

<script>
import { fileTypes } from '@/const/types';
import File from '@/components/common/Forms/File.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import imageCompression from 'browser-image-compression';
import { blobToFile } from '@/utils/helpers/forms/blobToFile.js';
import { SIZE_TO_COMPRESSION } from '@/const/messenger.js';

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

export default {
    name: 'FileInput',
    components: { VueDraggableNext, File },
    props: {
        data: {
            type: [Array, String],
            default: () => []
        },
        native: {
            type: [Array, FileList],
            default: () => []
        },
        label: {
            type: String,
            default: ''
        },
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
    },
    data() {
        return {
            localFiles: [],
            files: [],
            isDragEnter: false,
            unknownFileType: {
                name: 'unknown',
                title: 'Не установлено',
                icon: 'fa-solid fa-file-circle-question'
            }
        };
    },
    computed: {
        allowedTypeList: () => Object.values(fileTypes),
        acceptList() {
            return this.onlyImages ? 'image/*' : this.accept;
        },
        fileWidthClass() {
            if (this.itemClass) return this.itemClass;

            return [
                {
                    'col-6': this.single && this.onlyImages,
                    'col-4': this.onlyImages
                },
                'col-2'
            ];
        }
    },
    watch: {
        localFiles: {
            handler() {
                this.$emit('update:native', this.localFiles);
                this.$emit('updated', this.localFiles);
            },
            deep: true
        },
        data() {
            this.setExistFiles();
        }
    },
    methods: {
        clickOpenFile() {
            this.$refs.fileInput.click();
        },
        deleteFile(index) {
            let files = null;

            if (!this.single) {
                files = this.data.filter((_, idx) => idx != index);
            }

            this.$emit('update:data', files);
        },
        deleteLocalFile(index) {
            this.localFiles = this.localFiles.filter((_, idx) => idx != index);
        },
        getFileTypeByName(meta) {
            let extension = meta.split('.').slice(-1)[0];
            return this.getFileTypeByExtension(extension);
        },
        getFileTypeByExtension(extension) {
            return (
                this.allowedTypeList.find(element => element.extensions.includes(extension)) ||
                this.unknownFileType
            );
        },
        onChange($event) {
            const files = Array.from($event.target.files);

            if (this.single) {
                this.files = [];
                this.localFiles = [];
                this.$emit('update:data', null);
            }

            this.setProperties(files);
        },
        setProperties(files) {
            files.forEach(file => {
                file.fileType = this.getFileTypeByName(file.name);

                if (file.type.match('image')) {
                    if (file.size >= SIZE_TO_COMPRESSION) {
                        imageCompression(file, compressionOptions).then(async compressed => {
                            const _file = blobToFile(compressed, file);
                            _file.src = await imageCompression.getDataUrlFromFile(compressed);
                            this.localFiles.push(_file);
                        });
                    } else {
                        imageCompression.getDataUrlFromFile(file).then(src => {
                            file.src = src;
                            this.localFiles.push(file);
                        });
                    }
                    return file;
                } else {
                    this.localFiles.push(file);
                    return file;
                }
            });
        },
        createFileObject(element) {
            if (element.extension) {
                return {
                    ...element,
                    fileType: this.getFileTypeByExtension(element.extension)
                };
            }

            if (element.type) {
                return {
                    ...element,
                    fileType: this.getFileTypeByName(element.name, true)
                };
            }

            return {
                src: (this.apiUrl || this.$url.api.objects()) + element,
                fileType: this.getFileTypeByName(element)
            };
        },
        setExistFiles() {
            if (this.data instanceof Array) {
                this.files = this.data.map(fileUrl => this.createFileObject(fileUrl));
            } else if (this.data) {
                this.files = [this.createFileObject(this.data)];
            } else {
                this.files = [];
            }
        },
        dropHandler(event) {
            this.isDragEnter = false;
            let files = Array.from(event.dataTransfer.files);

            if (this.single) {
                this.files = [];
                this.localFiles = [];
                this.$emit('update:data', null);
                files = files.slice(-1);
            }

            this.setProperties(files);
        },
        clear() {
            this.localFiles = [];
            this.$emit('update:native', this.localFiles);
        }
    },
    created() {
        if (!this.custom) this.setExistFiles();
    },
    mounted() {
        if (this.native && !this.custom) {
            this.localFiles = this.native;
        }
    }
};
</script>
<style>
.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
</style>
