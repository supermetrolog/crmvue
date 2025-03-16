import { assignQueryToForm } from '@/utils/helpers/forms/assignQueryToForm.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { watch } from 'vue';
import { debounce } from '@/utils/common/debounce.js';
import { deleteEmptyFields } from '@/utils/helpers/object/deleteEmptyFields.js';

export const WithQueryFiltersMixin = {
    data() {
        return {
            form: {}
        };
    },
    methods: {
        async setQuery() {
            const query = { ...this.$route.query };
            delete query.page;

            let form = cloneObject(this.form);
            const emptyFields = deleteEmptyFields(form);

            emptyFields.forEach(key => {
                delete query[key];
            });

            Object.assign(query, form);

            await this.$router.replace({ query });
        },
        setForm() {
            let query = this.$route.query;
            assignQueryToForm(query, this.form);
        },
        onFormChanged: debounce(async function () {
            await this.setQuery();
            await this.afterSetQuery();
        }, 350),
        afterSetQuery() {}
    },
    created() {
        this.setForm();

        watch(
            () => this.form,
            () => {
                this.onFormChanged();
            },
            { deep: true }
        );
    }
};
