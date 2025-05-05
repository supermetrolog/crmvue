<template>
    <Tr class="offer-table-item skeleton-body">
        <Td class="offer-table-item__id text-center">
            <div class="offer-table-item__aside">
                <p class="mb-1 skeleton">#1234</p>
                <div class="offer-table-item__actions">
                    <UiButtonIcon class="skeleton" />
                    <UiButtonIcon class="skeleton" />
                    <UiButtonIcon class="skeleton" />
                </div>
            </div>
        </Td>
        <Td class="offer-table-item__preview">
            <OfferTableItemPreviewSkeleton />
        </Td>
        <Td class="offer-table-item__region text-center">
            <div class="d-flex flex-column align-items-center gap-1">
                <p class="skeleton">Регион России</p>
                <p class="skeleton">Округ Москвы</p>
                <p class="skeleton">Направление по Москве</p>
                <p class="skeleton">Направление по Москве</p>
                <p class="skeleton">Направление</p>
                <p class="skeleton">Направление по Москве</p>
            </div>
        </Td>
        <Td class="offer-table-item__from-mkad text-center">
            <p class="skeleton fs-4">123</p>
        </Td>
        <Td class="offer-table-item__area">
            <div class="d-flex justify-content-center">
                <div class="offer-table-item-area">
                    <p class="skeleton fs-4 mb-1">12345 м</p>
                    <div class="gap-1 flex-column d-flex">
                        <p class="offer-table-item-area__item skeleton fs-1">12345 м - мезонин</p>
                        <p class="offer-table-item-area__item skeleton fs-1">12345 м - офисы</p>
                        <p class="offer-table-item-area__item skeleton fs-1">12345 м - офисы</p>
                    </div>
                </div>
            </div>
        </Td>
        <Td class="offer-table-item__price">
            <div class="d-flex justify-content-center">
                <div class="gap-1 flex-column d-flex">
                    <p class="offer-table-item-price__item skeleton fs-4">OPEX - 1234</p>
                    <p class="offer-table-item-price__item skeleton fs-1">OPEX - 1234</p>
                    <p class="offer-table-item-price__item skeleton fs-1">OPEX - 1234</p>
                </div>
            </div>
        </Td>
        <Td class="offer-table-item__company">
            <CompanyElementSkeleton class="offer-table-item__company-element mb-2" />
            <CompanyContactSkeleton class="offer-table-item__company-element" />
        </Td>
        <Td class="offer-table-item__consultant">
            <div class="d-flex justify-content-center">
                <div class="d-flex flex-column align-items-center gap-1">
                    <div class="avatar skeleton" :style="{ '--size': `${55}px` }"></div>
                    <div class="d-flex gap-1 align-items-center">
                        <div class="offer-table-item__icon skeleton">
                            <i class="fa-solid fa-person-walking"></i>
                        </div>
                    </div>
                </div>
            </div>
        </Td>
        <Td class="offer-table-item__advertisement">
            <div class="d-flex flex-wrap gap-1">
                <UiField class="skeleton fs-1">Raysarma.ru</UiField>
                <UiField class="skeleton fs-1">Avito</UiField>
                <UiField class="skeleton fs-1">Cian</UiField>
                <UiField class="skeleton fs-1">Raysarma.ru</UiField>
            </div>
        </Td>
        <Td class="offer-table-item__date">
            <UiField class="skeleton mb-1 w-100">Статус</UiField>
            <UiField class="skeleton w-100">Дата создания</UiField>
        </Td>
    </Tr>
</template>
<script setup>
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import OfferTableItemPreviewSkeleton from '@/components/Offer/TableItem/Preview/OfferTableItemPreviewSkeleton.vue';
import CompanyElementSkeleton from '@/components/Company/CompanyElementSkeleton.vue';
import CompanyContactSkeleton from '@/components/Company/CompanyContactSkeleton.vue';
import UiField from '@/components/common/UI/UiField.vue';
</script>
