<template>
    <div class="ComplexView container-fluid">
        <Loader v-if="isLoading" center />
        <template v-else-if="complex">
            <teleport to="body">
                <FormComplex
                    v-if="formIsVisible"
                    @close="formIsVisible = false"
                    :complex="complex"
                />
                <ComplexPhotoDownloader ref="downloader" />
            </teleport>
            <div class="ComplexHeader">
                <div class="ComplexHeader-content">
                    <h1 class="ComplexHeader-name">{{ complex.title || 'Нет названия' }}</h1>
                    <span class="ComplexHeader-description">
                        <strong>ID комплекса {{ complex.id }}, </strong>
                        поступление {{ formattedDate }},
                        <span v-if="complex.author">
                            {{ complex.author.userProfile.full_name }}
                        </span>
                        <span v-else>без автора</span>, последнее обновление
                        {{ updatedDate }}
                    </span>
                </div>
                <div class="complex-header__actions">
                    <a class="button button--icon" :href="oldComplexUrl" target="_blank">
                        <span>Перейти на старую версию</span>
                        <i class="fas fa-eye edit"></i>
                    </a>
                    <template v-if="editAccess">
                        <Button @click="formIsVisible = true" icon>
                            <span>Редактировать</span>
                            <i class="fas fa-pen edit"></i>
                        </Button>
                        <Button @click="deleteComplex" danger icon>
                            <span>Удалить</span>
                            <i class="fas fa-trash edit"></i>
                        </Button>
                    </template>
                </div>
            </div>
            <ComplexMap :location="location" />
            <ComplexAbout :complex="complex" />
            <ComplexHoldings :objects="complex.objects" />
        </template>
        <EmptyData v-else>Комплекс не найден..</EmptyData>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import ComplexAbout from '@/components/Complex/ComplexAbout.vue';
import ComplexMap from '@/components/Complex/ComplexMap.vue';
import ComplexHoldings from '@/components/Complex/Holding/ComplexHoldings.vue';
import Button from '@/components/common/Button.vue';
import FormComplex from '@/components/Forms/Complex/FormComplex.vue';
import ComplexPhotoDownloader from '@/components/Complex/ComplexPhotoDownloader.vue';
import { computed, onBeforeMount, provide, shallowRef, useTemplateRef, watch } from 'vue';
import { getLinkComplexOld } from '@/utils/url.js';
import { useRoute, useRouter } from 'vue-router';
import EmptyData from '@/components/common/EmptyData.vue';
import Loader from '@/components/common/Loader.vue';
import { useDocumentTitle } from '@/composables/useDocumentTitle.ts';
import { toDateFormat } from '@/utils/formatters/date.js';
import { useAsync } from '@/composables/useAsync.js';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { setTitle } = useDocumentTitle();

const isLoading = shallowRef(false);
const downloader = useTemplateRef('downloader');
const editAccess = shallowRef(true);
const formIsVisible = shallowRef(false);

provide('openDownloader', (photos, zipName = null) => downloader.value.open(photos, zipName));

const complex = computed(() => store.state.Complex.complex);
const oldComplexUrl = computed(() => getLinkComplexOld(complex.value.id, route.query.offer_id));
const location = computed(() => {
    const _location = {
        ...complex.value.location,
        fromMkad: complex.value.from_mkad
    };

    if (complex.value.latitude) {
        _location.latitude = complex.value.latitude;
        _location.longitude = complex.value.longitude;
    } else if (complex.value.objects?.length) {
        _location.latitude = complex.value.objects[0].latitude;
        _location.longitude = complex.value.objects[0].longitude;
    }

    return _location;
});

const locationShortText = computed(() => {
    if (complex.value.objects?.length) return complex.value.objects[0].address;

    return null;
});

const formattedDate = computed(() =>
    toDateFormat(complex.value.publ_time * 1000, 'D MMMM YYYY г., в HH:mm')
);
const updatedDate = computed(() =>
    toDateFormat(complex.value.last_update * 1000, 'D MMMM YYYY г., в HH:mm')
);

watch(
    () => complex.value?.id,
    value => {
        if (value) {
            const title = [
                complex.value.title || locationShortText.value || 'Нет названия',
                `Комплекс #${complex.value.id}`
            ];

            setTitle(title);
        }
    },
    { immediate: true }
);

const { execute: deleteComplex } = useAsync(
    () => store.dispatch('Complex/DELETE_COMPLEX', complex.value.id),
    {
        onFetchResponse() {
            router.push({ name: 'OffersMain' });
        },
        confirmation: true,
        confirmationContent: {
            title: 'Удалить комплекс',
            message:
                'Вы уверены, что хотите удалить комплекс? Удаленный комплекс нельзя восстановить.',
            okButton: 'Удалить',
            okIcon: 'fa-solid fa-trash'
        }
    }
);

onBeforeMount(async () => {
    isLoading.value = true;
    await store.dispatch('Complex/FETCH_COMPLEX', route.params.complex_id);
    isLoading.value = false;
});
</script>
