<template>
    <Modal
        v-if="opened"
        @close="close"
        title="Выбор изображений для скачивания"
        class="complex-photo-downloader"
        width="1100"
    >
        <div class="row">
            <div class="complex-photo-downloader__options col-3">
                <p class="complex-photo-downloader__text">
                    Выбрано изображений: <span>{{ downloadsCount }}</span> из
                    <span>{{ photos.length }}</span>
                </p>
                <div class="complex-photo-downloader__actions">
                    <Button @click="download" success :disabled="!downloadsCount">
                        Скачать выбранное
                    </Button>
                    <Button @click="downloadAll">Скачать все изображения</Button>
                </div>
            </div>
            <div class="complex-photo-downloader__body col-9">
                <Button
                    @click="selectAll"
                    :disabled="downloadsCount === photos.length"
                    class="complex-photo-downloader__select"
                    small
                >
                    Выбрать все
                </Button>
                <ul class="complex-photo-downloader__list row">
                    <li v-for="(photo, key) in photos" :key="key" class="col-3">
                        <div
                            @click="toggleDownload(key)"
                            class="complex-photo-downloader__item"
                            :class="{ active: downloads[key] }"
                        >
                            <VLazyImage
                                :ref="`image-${key}`"
                                class="complex-photo-downloader__image"
                                :src="photo.src || photo"
                            />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import VLazyImage from 'v-lazy-image';
import Button from '@/components/common/Button.vue';
import useValidate from '@vuelidate/core';

export default {
    name: 'ComplexPhotoDownloader',
    components: { Button, Modal, VLazyImage },
    data() {
        return {
            opened: false,
            photos: [],
            downloads: {},
            v$: useValidate()
        };
    },
    computed: {
        downloadsCount() {
            return Object.values(this.downloads).filter(Boolean).length;
        }
    },
    methods: {
        open(photos) {
            this.photos = photos;
            this.downloads = photos.reduce((acc, _, key) => ({ ...acc, [key]: false }), {});
            this.opened = true;
        },
        close() {
            this.opened = false;
            this.downloads = {};
            this.photos = [];
        },
        toggleDownload(index) {
            this.downloads[index] = !this.downloads[index];
        },
        createLink(params) {
            return this.$url.api.archiver() + '?files[]=' + params.join('&files[]=');
        },
        download() {
            const link = this.createLink(
                this.photos.filter((_, key) => this.downloads[key]).map(photo => photo.src)
            );

            window.open(link, '_blank').focus();
        },
        downloadAll() {
            const link = this.createLink(this.photos.map(photo => photo.src));
            window.open(link, '_blank').focus();
        },
        selectAll() {
            this.downloads = this.photos.reduce((acc, _, key) => ({ ...acc, [key]: true }), {});
        }
    }
};
</script>
