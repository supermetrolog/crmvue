<template>
    <Tr class="skeleton-body">
        <Td class="text-center request-table-item__id">
            <p class="mb-1">#1234</p>
            <div class="request-table-item__buttons">
                <UiButtonIcon class="skeleton" />
                <UiButtonIcon class="skeleton" />
            </div>
        </Td>
        <Td class="request-table__deal">
            <div class="row no-gutters">
                <div class="col-6">
                    <h4 class="skeleton">Аренда</h4>
                </div>
                <div class="col-12">
                    <span class="skeleton">Звездочки</span>
                </div>
            </div>
        </Td>
        <Td class="text-center request-table__area request-table-item__area">
            <b class="skeleton">12345 - 12345</b>
        </Td>
        <Td class="text-center request-table__price">
            <b class="skeleton">12345 12345</b>
            <br />
            <b class="skeleton">12345</b>
        </Td>
        <Td class="text-center request-table__region">
            <div>
                <p class="skeleton mb-1">Регион</p>
                <p class="skeleton mb-1"><b>Какая-то область:</b></p>
                <p class="skeleton">до 123 км до МКАД</p>
            </div>
        </Td>
        <Td class="request-table__company pt-2">
            <CompanyElementSkeleton />
            <CompanyContactSkeleton />
        </Td>
        <Td class="text-center">
            <div class="avatar skeleton mx-auto" :style="{ '--size': `${55}px` }"></div>
        </Td>
        <Td class="text-center request-table__status">
            <UiField class="skeleton mb-1">Статус</UiField>
            <UiField class="skeleton">Дата создания</UiField>
        </Td>
    </Tr>
</template>

<script setup>
import Tr from '@/components/common/Table/Tr.vue';
import UiField from '@/components/common/UI/UiField.vue';
import Td from '@/components/common/Table/Td.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import CompanyElementSkeleton from '@/components/Company/CompanyElementSkeleton.vue';
import CompanyContactSkeleton from '@/components/Company/CompanyContactSkeleton.vue';
</script>
