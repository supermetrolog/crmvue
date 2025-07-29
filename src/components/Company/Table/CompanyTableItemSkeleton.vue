<template>
    <Tr class="company-table-item skeleton-body">
        <Td class="text-center company-table-item__id">
            <p class="mb-1 skeleton">#1234</p>
            <div class="avatar skeleton mx-auto" :style="{ '--size': `${35}px` }"></div>
        </Td>
        <Td class="company-table-item__name position-relative">
            <div class="company-table-item__main">
                <CompanyLogoSkeleton />
                <div>
                    <p>
                        <span class="skeleton fs-4">Default company name skeleton</span>
                    </p>
                    <p class="mt-1">
                        <span class="skeleton">Default category</span>
                    </p>
                    <UiButton class="skeleton skeleton--rect skeleton-button mt-1" mini>
                        Product range
                    </UiButton>
                </div>
            </div>
            <div class="d-flex gap-1 mt-3">
                <UiButton class="skeleton skeleton--rect skeleton-button" mini>
                    Relations (none)
                </UiButton>
                <UiButton class="skeleton skeleton--rect skeleton-button" mini>
                    Relations (none)
                </UiButton>
            </div>
        </Td>
        <Td class="company-table-item__comment">
            <CompanyTableItemSummarySkeleton />
        </Td>
    </Tr>
</template>
<script setup>
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import CompanyLogoSkeleton from '@/components/Company/CompanyLogoSkeleton.vue';
import CompanyTableItemSummarySkeleton from '@/components/Company/Table/Summary/CompanyTableItemSummarySkeleton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
</script>
