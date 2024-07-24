<template>
    <Modal
        v-if="isOpened"
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
<script setup>
import Modal from '@/components/common/Modal.vue';
import VLazyImage from 'v-lazy-image';
import Button from '@/components/common/Button.vue';
import { computed, ref, shallowRef } from 'vue';
import { $generatorURL as $url } from '@/plugins/url.js';

const isOpened = shallowRef(false);
const photos = ref([]);
const downloads = ref({});

const downloadsCount = computed(() => {
    return Object.values(downloads.value).filter(Boolean).length;
});

const open = _photos => {
    photos.value = _photos;
    downloads.value = _photos.reduce((acc, _, key) => ({ ...acc, [key]: false }), {});
    isOpened.value = true;
};

defineExpose({ open });
const close = () => {
    isOpened.value = false;
    downloads.value = {};
    photos.value = [];
};
const toggleDownload = index => {
    downloads.value[index] = !downloads.value[index];
};
const createLink = params => {
    return $url.api.archiver() + '?files[]=' + params.join('&files[]=');
};
const download = () => {
    const link = createLink(
        photos.value.filter((_, key) => downloads.value[key]).map(photo => photo.src)
    );

    window.open(link, '_blank').focus();
};
const downloadAll = () => {
    const link = createLink(photos.value.map(photo => photo.src));
    window.open(link, '_blank').focus();
};
const selectAll = () => {
    downloads.value = photos.value.reduce((acc, _, key) => ({ ...acc, [key]: true }), {});
};
</script>
