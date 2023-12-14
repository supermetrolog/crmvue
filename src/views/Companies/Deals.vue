<template>
    <div class="companies-deals">
        <div class="row">
            <div class="col-12">
                <div class="objects">
                    <!-- <ObjectsSearch @search="search" class="mb-2" /> -->
                    <CompanyObjectsList
                        :objects="allObjects"
                        :currentObjects="[]"
                        :selectedObjects="[]"
                        :disabled="true"
                        :loader="allObjectsLoader"
                        :viewMode="viewMode"
                        col="col-2"
                    />
                    <Pagination
                        :pagination="pagination"
                        @loadMore="loadMore"
                        class="text-center"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {MixinAllObject} from "@/components/Company/Object/mixins";

export default {
    mixins: [MixinAllObject],
    name: "CompaniesDeals",
    methods: {
        async getPreventStepObjects() {
        },
    },
};
</script>

<style>
</style>