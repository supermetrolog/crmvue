<template>
    <div class="filters">
        <template v-for="(category, key) in filters" :key="key">
            <FiltersCategory
                v-if="category.options?.length || category.inputs?.length"
                :title="category.title"
                :class="{ selected: categoryIsActive(form[category.name]) }"
            >
                <FiltersOptions
                    v-if="category.options?.length"
                    v-model="form[category.name]"
                    :category="category"
                />
                <FiltersGroup v-else v-model="form[category.name]" :category="category" />
            </FiltersCategory>
            <slot v-else-if="category.custom" :name="category.name" :form="form" :v$="v$" />
            <div v-else class="filters__item">
                <CheckboxChip v-model="form[category.name]" :text="category.text" multiple />
            </div>
        </template>
        <div class="filters__footer">
            <Button @click="select" success class="w-100">Применить</Button>
            <Button
                @click="clear"
                :disabled="!filtersCount && !hasRouteFilters"
                danger
                class="w-100"
            >
                Сбросить
            </Button>
        </div>
    </div>
</template>
<script>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import FiltersGroup from '@/components/common/Forms/Filters/FiltersGroup.vue';
import FiltersOptions from '@/components/common/Forms/Filters/FiltersOptions.vue';
import FiltersCategory from '@/components/common/Forms/Filters/FiltersCategory.vue';
import Button from '@/components/common/Button.vue';
import { getObjectWithoutEmptyFields, waitHash } from '@/utils/index.js';
import useVuelidate from '@vuelidate/core';

export default {
    name: 'Filters',
    components: { Button, FiltersCategory, FiltersOptions, FiltersGroup, CheckboxChip },
    props: {
        urlDisabled: {
            type: Boolean,
            default: false
        },
        filters: {
            type: Array,
            default: () => []
        },
        validation: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            form: {},
            v$: useVuelidate(),
            hasRouteFilters: false
        };
    },
    computed: {
        filtersCount() {
            return Object.values(this.form).reduce((acc, element) => {
                return acc + this.categoryIsActive(element);
            }, 0);
        }
    },
    watch: {
        '$route.query': function (newQuery, oldQuery) {
            delete newQuery.page;
            delete oldQuery.page;
            delete newQuery.all;
            delete oldQuery.all;

            if (waitHash(newQuery) !== waitHash(oldQuery)) {
                this.setQueryToForm();
            }
        }
    },
    methods: {
        categoryIsActive(value) {
            return !(value === null || (value instanceof Array && !value.length));
        },
        clear() {
            this.initForm();
            this.updateQuery();
            this.$notify('Фильтры успешно очищены');
        },
        initForm() {
            this.form = this.filters.reduce(
                (acc, element) => ({ ...acc, [element.name]: element.multiple ? [] : null }),
                {}
            );

            this.hasRouteFilters = false;
        },
        setQueryToForm() {
            this.initForm();

            const query = { ...this.$route.query };

            delete query.page;
            delete query.all;

            Object.keys(query).forEach(key => {
                if (Array.isArray(this.form[key])) {
                    this.form[key] = Array.isArray(query[key]) ? query[key] : [query[key]];
                } else {
                    this.form[key] = query[key];
                }
            });

            if (this.filtersCount) this.hasRouteFilters = true;
        },
        async updateQuery() {
            let query = getObjectWithoutEmptyFields(this.form);
            await this.$router.replace({ query });
        },
        async select() {
            if (this.v$) {
                this.v$.$touch();
                if (this.v$.$error) return;
            }

            await this.updateQuery();
            this.$notify('Фильтры применены');
        }
    },
    validations() {
        return {
            form: this.validation
        };
    },
    created() {
        this.setQueryToForm();
    }
};
</script>
