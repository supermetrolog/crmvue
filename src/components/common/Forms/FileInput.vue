<template>
    <div @drop.prevent @dragover.prevent class="file-input">
        <div class="file-input__container">
            <label class="file-input__label" :class="{ required: required }" :for="$id('file')">
                <span v-if="label">
                    {{ label }}
                </span>
            </label>
            <div
                v-if="!reedOnly"
                @click="clickOpenFile"
                @dragover.prevent="isDragEnter = true"
                @dragleave.prevent="isDragEnter = false"
                @drop.prevent="dropHandler"
                @dragenter.prevent="isDragEnter = true"
                class="file-input__field"
                :class="{ 'file-input__field--dragenter': isDragEnter }"
            >
                <i class="file-input__icon fa-solid fa-download" />
                <p class="file-input__title">Загрузите файл</p>
                <p class="file-input__description">
                    Переместите файлы в эту зону или просто кликните для выбора файлов
                </p>
            </div>
            <input
                :id="$id('file')"
                ref="fileInput"
                @change.stop="onChange"
                type="file"
                :multiple="!single"
                :accept="acceptList"
            />
            <div v-if="files.length || localFiles.length" class="file-input__list row">
                <File
                    v-for="(file, index) in localFiles"
                    :key="index"
                    @delete="deleteLocalFile(index)"
                    :file="file"
                    class="file--new"
                    :class="fileWidthClass"
                />
                <File
                    v-for="(file, index) in files"
                    :key="index"
                    @delete="deleteFile(index)"
                    :file="file"
                    :class="fileWidthClass"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { fileTypes } from '@/const/types';
import File from '@/components/common/Forms/File.vue';

export default {
    name: 'FileInput',
    components: { File },
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
        single: {
            type: Boolean,
            default: false
        },
        accept: {
            type: String,
            default: '.*'
        },
        reedOnly: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        onlyImages: {
            type: Boolean,
            default: false
        },
        apiUrl: {
            type: String,
            default: null
        },
        onlyLinks: {
            type: Boolean,
            default: false
        }
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
        getFileType(meta) {
            let extension = meta.split('.').slice(-1)[0];

            const currentType =
                this.allowedTypeList.find(element => element.extensions.includes(extension)) ||
                this.unknownFileType;

            return currentType;
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
            files.map(file => {
                file.created_at = 'Только что';
                file.fileType = this.getFileType(file.name);

                if (file.type.match('image')) {
                    const reader = new FileReader();
                    reader.onload = ev => {
                        file.src = ev.target.result;
                        this.localFiles.push(file);
                    };
                    reader.readAsDataURL(file);

                    return file;
                } else {
                    this.localFiles.push(file);
                    return file;
                }
            });
        },
        createFileObject(element) {
            if (element.type) {
                return {
                    ...element,
                    fileType: this.getFileType(element.name, true)
                };
            }

            return {
                src: (this.apiUrl || this.$url.api.objects()) + element,
                fileType: this.getFileType(element)
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
        }
    },
    created() {
        this.setExistFiles();
    }
};
</script>
