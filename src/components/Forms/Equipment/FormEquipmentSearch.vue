<template>
    <UiForm>
        <FormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end flex-column flex-md-row">
                    <Input
                        v-model="querySearch"
                        label="Поиск"
                        placeholder="ID, адрес, собственник, название, описание"
                        class="w-100"
                        disabled
                    />
                    <div class="ml-md-2 mt-2 mt-md-0 d-flex gap-2 w-100">
                        <Button
                            @click="filtersIsVisible = true"
                            :badge="filtersCount > 0 ? filtersCount : false"
                            class="flex-grow-1 flex-md-grow-0"
                        >
                            Фильтры
                        </Button>
                        <Button
                            @click="clearQuery"
                            class="flex-grow-1 flex-md-grow-0"
                            :disabled="!hasDifference"
                            danger
                        >
                            Очистить
                        </Button>
                    </div>
                </div>
            </div>
        </FormGroup>
        <teleport to="body">
            <FormEquipmentFilters v-if="filtersIsVisible" @close="filtersIsVisible = false" />
        </teleport>
    </UiForm>
</template>

<script>
import UiForm from '@/components/common/Forms/UiForm.vue';
import Button from '@/components/common/Button.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import FormEquipmentFilters from '@/components/Forms/Equipment/FormEquipmentFilters.vue';

export default {
    name: 'FormEquipmentSearch',
    components: {
        FormEquipmentFilters,
        FormGroup: UiFormGroup,
        Input: UiInput,
        Button,
        Form
    },
    emits: ['changed'],
    data() {
        return {
            filtersIsVisible: false,
            filtersCount: 0,
            querySearch: null
        };
    },
    computed: {
        hasDifference() {
            return this.filtersCount > 0 || this.querySearch?.length > 0;
        }
    },
    watch: {
        async querySearch(value) {
            const query = { ...this.$route.query };
            delete query.page;

            if (value?.length) query.all = value;
            else delete query.all;

            await this.$router.replace({ query });
        },
        '$route.query': function () {
            this.updateFiltersCount();
            this.$emit('changed');
        }
    },
    methods: {
        async clearQuery() {
            const query = this.$route.query?.sort ? { sort: this.$route.query.sort } : {};

            await this.$router.replace({ query });
            this.querySearch = '';
        },
        updateFiltersCount() {
            const query = { ...this.$route.query };
            delete query.page;
            delete query.all;
            delete query.sort;

            this.filtersCount = Object.keys(query).length;
        }
    },
    created() {
        this.updateFiltersCount();
    }
};
</script>

<style></style>
