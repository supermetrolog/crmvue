<template>
    <div class="companies-deals">
        <div class="row">
            <div class="col-12">
                <div class="objects">
                    <!-- <ObjectsSearch @search="search" class="mb-2" /> -->
                    <CompanyObjectsList
                        :objects="allObjects"
                        :current-objects="[]"
                        :selected-objects="[]"
                        :disabled="true"
                        :loader="allObjectsLoader"
                        :view-mode="viewMode"
                        col="col-2"
                    />
                    <Pagination @loadMore="loadMore" :pagination="pagination" class="text-center" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MixinAllObject } from '@/components/Company/Object/mixins';

export default {
    name: 'CompaniesDeals',
    mixins: [MixinAllObject],
    methods: {
        async getPreventStepObjects() {}
    }
};
</script>

<style></style>