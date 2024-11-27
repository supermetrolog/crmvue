<template>
    <div class="form-company-logo">
        <Loader v-if="isUpdating" class="small" />
        <div class="row mb-1">
            <div class="col-12">
                <div class="d-flex align-items-center mb-2">
                    <p class="form__subtitle">Текущий логотип</p>
                    <AnimationTransition :speed="0.4">
                        <Button
                            v-if="logoShouldBeDeleted"
                            @click="unmarkCurrentLogoAsDeleted"
                            icon
                            small
                            class="ml-1"
                        >
                            <span>Отменить удаление</span>
                            <i class="fa-solid fa-rotate-left" />
                        </Button>
                        <Button
                            v-else
                            @click="markCurrentLogoAsDeleted"
                            class="ml-2"
                            small
                            icon
                            danger
                            :disabled="logoShouldBeDeleted || !currentLogo"
                        >
                            <span>Удалить логотип</span>
                            <i class="fa-solid fa-trash" />
                        </Button>
                    </AnimationTransition>
                    <Button
                        @click="cropperIsVisible = true"
                        :disabled="!canBeEdit"
                        class="ml-2"
                        small
                        icon
                    >
                        <span>Редактировать</span>
                        <i class="fa-solid fa-crop-simple"></i>
                    </Button>
                    <AnimationTransition>
                        <Button @click="toInitial" class="ml-2" small icon :disabled="!newLogo">
                            <span>Вернуть исходный</span>
                            <i class="fa-solid fa-angles-left"></i>
                        </Button>
                    </AnimationTransition>
                </div>
                <div class="form-company-logo__preview">
                    <div v-if="isCompressing" class="form-company-logo__compression">
                        <div class="file__body file__body--loading">
                            <Progress :percent="compressionProgress" title="загрузки" :height="4" />
                        </div>
                    </div>
                    <CompanyLogo
                        v-else
                        :src="currentLogo?.src"
                        as="div"
                        :class="{
                            'form-company-logo__deleted-logo': logoShouldBeDeleted
                        }"
                        :company-id="currentCompanyId"
                        :size="100"
                    />
                    <div v-if="company" class="form-company-logo__description">
                        <p class="form-company-logo__company">
                            <i
                                v-if="company.is_individual"
                                v-tippy="'Физ.лицо'"
                                class="fa-solid fa-user-tie mr-1"
                            ></i>
                            <span>{{ companyName }}</span>
                        </p>
                        <div class="form-company-logo__categories mt-1">
                            <DashboardChip
                                v-for="category in categories"
                                :key="category.id"
                                class="dashboard-bg-gray-l form-company-logo__category"
                            >
                                {{ category.label }}
                            </DashboardChip>
                        </div>
                        <p class="form-company-logo__address mt-1">
                            <span v-if="company.officeAdress || company.office_address">
                                {{ company.officeAdress ?? company.office_address }}
                            </span>
                            <span v-else class="messenger-warning">Адрес офиса не заполнен</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <FileInput
            v-model:native="loadedImages"
            @updated="onFileInputUpdated"
            single
            label="Новый логотип"
            only-images
            class="form-company-logo__picker"
            custom
        >
            Выбрать файлы
        </FileInput>
        <div class="d-flex gap-2 justify-content-center w-100 mt-3">
            <Button @click="editLogo" success :disabled="!canBeSaved">Сохранить</Button>
            <Button @click="emit('canceled')">Закрыть</Button>
        </div>
        <teleport to="body">
            <Modal
                @close="closeCropper"
                title="Редактирование размера"
                :show="cropperIsVisible"
                :close-on-press-esc="false"
                :close-on-outside-click="false"
            >
                <ImageCropper
                    ref="cropperEl"
                    :src="currentLogo.src"
                    :need-transform="!newLogo"
                    :height="400"
                    :width="400"
                >
                    <template #footer>
                        <div class="d-flex gap-2">
                            <Button
                                @click="saveCropped"
                                class="form-company-logo__button"
                                success
                                small
                                icon
                            >
                                Сохранить
                            </Button>
                            <Button
                                @click="closeCropper"
                                class="form-company-logo__button"
                                small
                                icon
                            >
                                Отменить
                            </Button>
                        </div>
                    </template>
                </ImageCropper>
            </Modal>
        </teleport>
    </div>
</template>

<script setup>
import FileInput from '@/components/common/Forms/FileInput.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import Button from '@/components/common/Button.vue';
import api from '@/api/api.js';
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { CompanyCategories } from '@/const/const.js';
import { useEventListener } from '@vueuse/core';
import { SIZE_TO_COMPRESSION } from '@/const/messenger.js';
import imageCompression from 'browser-image-compression';
import { blobToFile } from '@/utils/helpers/forms/blobToFile.js';
import { useNotify } from '@/utils/useNotify.js';
import Progress from '@/components/common/Progress.vue';
import ImageCropper from '@/components/common/ImageCropper.vue';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import { getCompanyName } from '@/utils/formatters/models/company.js';

const emit = defineEmits(['updated', 'deleted', 'canceled', 'edited']);
const props = defineProps({
    company: {
        type: Object,
        default: null
    },
    companyId: {
        type: Number,
        default: null
    },
    logo: {
        type: Object,
        default: null
    }
});

const notify = useNotify();
const cropperEl = useTemplateRef('cropperEl');

const newLogo = shallowRef(null);
const croppedLogo = shallowRef(null);
const logoShouldBeDeleted = ref(false);
const isUpdating = ref(false);
const cropperIsVisible = ref(false);
const compressionProgress = ref(0);
const isCompressing = ref(false);

const loadedImages = shallowRef([]);

const currentCompanyId = computed(() => {
    if (props.company) return props.company.id;
    return props.companyId;
});

const currentLogo = computed(() => {
    if (croppedLogo.value) return croppedLogo.value;
    if (newLogo.value) return newLogo.value;

    if (props.company?.logo) return props.company.logo;
    return props.logo;
});

const canBeSaved = computed(() => newLogo.value || logoShouldBeDeleted.value);
const canBeEdit = computed(() => newLogo.value && !logoShouldBeDeleted.value);

const companyName = computed(() => getCompanyName(props.company));
const categories = computed(() => {
    return props.company.categories.map(element => {
        return {
            id: element.id,
            label: CompanyCategories[element.category]
        };
    });
});

const markCurrentLogoAsDeleted = () => {
    emit('edited');
    logoShouldBeDeleted.value = true;
};

const unmarkCurrentLogoAsDeleted = () => {
    logoShouldBeDeleted.value = false;
};

const toInitial = () => {
    newLogo.value = null;
    croppedLogo.value = null;
    unmarkCurrentLogoAsDeleted();
};

const deleteLogo = async () => {
    const deleted = await api.companies.deleteLogo(currentCompanyId.value);
    if (deleted) emit('deleted');
};

const updateLogo = async () => {
    const updatedLogo = await api.companies.updateLogo(currentCompanyId.value, newLogo.value);
    if (updatedLogo) emit('updated', updatedLogo);
};

const editLogo = async () => {
    if (!newLogo.value && !logoShouldBeDeleted.value) {
        emit('canceled');
        return;
    }

    isUpdating.value = true;

    if (logoShouldBeDeleted.value) await deleteLogo();
    else await updateLogo();

    isUpdating.value = false;
};

const onFileInputUpdated = files => {
    if (files?.length) {
        newLogo.value = files[0];
        loadedImages.value = [];
        logoShouldBeDeleted.value = false;
        emit('edited');
    }
};

const generateFileUrl = async file => {
    file.src = await imageCompression.getDataUrlFromFile(file);
    newLogo.value = file;
};

const closeCropper = () => {
    cropperIsVisible.value = false;
};

const generateCroppedFileName = () => {
    return `company-${currentCompanyId.value}-cropped-logo.png`;
};

const saveCropped = async () => {
    const blob = await cropperEl.value.getBlob();
    const url = cropperEl.value.getUrl();

    const file = blobToFile(blob, { name: generateCroppedFileName() });

    croppedLogo.value = {
        src: url
    };

    newLogo.value = file;

    closeCropper();
};

const pasteHandler = event => {
    if (!event.clipboardData.files.length) return;

    emit('edited');
    logoShouldBeDeleted.value = false;
    const file = Array.from(event.clipboardData.files)[0];

    if (file.size >= SIZE_TO_COMPRESSION) {
        compressionProgress.value = 0;
        isCompressing.value = true;

        try {
            imageCompression(file, {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                onProgress: value => {
                    compressionProgress.value = value;
                }
            }).then(async compressed => {
                const _file = blobToFile(compressed, file);
                _file.src = await imageCompression.getDataUrlFromFile(compressed);

                newLogo.value = _file;
                isCompressing.value = false;
                compressionProgress.value = 0;
            });
        } catch (e) {
            notify.error(
                'Произошла ошибка при оптимизации изображения. Попробуйте еще раз или используйте другое изображение',
                'Загрузка изображения'
            );

            newLogo.value = null;
            isCompressing.value = false;
            compressionProgress.value = 0;
        }
    } else {
        generateFileUrl(file);
    }
};

useEventListener('paste', pasteHandler);
</script>
