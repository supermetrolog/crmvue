<template>
    <CompanyBoxLayout class="CompanyBoxLogs" :class="'grid-b'">
        <template #header>
            <span>Лог работы с {{ headerTitle }}</span>
        </template>
        <template #content>
            <CompanyLogsList
                @infinite="load"
                :logs="COMPANY_LOGS"
                :logs-count="COMPANY_LOGS_COUNT"
            />
            <UiForm @submit="onSubmit(company.id)" class="CompanyBoxLogs-form">
                <FormGroup>
                    <Textarea
                        v-model="form.comment"
                        class="CompanyBoxLogs-form-text col-12"
                        :v="v$.form.comment"
                        placeholder="Добавьте комментарий"
                    />
                    <Submit class="mt-1 w-100">Добавить</Submit>
                    <div v-if="loader" class="col-12 mt-4">
                        <Loader class="small py-2 no-absolute" />
                    </div>
                </FormGroup>
            </UiForm>
        </template>
    </CompanyBoxLayout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import CompanyLogsList from '@/components/Company/Box/CompanyBoxLogsList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';

export default {
    name: 'CompanyBoxLogs',
    components: {
        UiForm,
        CompanyBoxLayout,
        CompanyLogsList,
        Loader,
        Submit,
        FormGroup: UiFormGroup,
        Textarea: UiTextarea
    },
    props: {
        logs: {
            type: Array,
            default: () => []
        },
        company: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            form: {
                comment: null
            },
            loaderMoreLogs: false
        };
    },

    validations() {
        return {
            form: {
                comment: {
                    required: helpers.withMessage('введите комментарий', required)
                }
            }
        };
    },
    computed: {
        ...mapGetters(['THIS_USER', 'COMPANY_LOGS', 'COMPANY_LOGS_COUNT']),
        headerTitle() {
            return this.company.nameRu || this.company.nameEng;
        }
    },
    methods: {
        ...mapActions(['POST_COMPANY_LOG', 'FETCH_COMPANY_LOGS']),
        async onSubmit(companyId) {
            this.v$.$validate();
            if (this.v$.form.$error) {
                return;
            }
            this.loader = true;
            const logComment = {
                company_id: companyId,
                user_id: this.THIS_USER.userProfile.user_id,
                message: this.form.comment,
                type: 1
            };
            let response = await this.POST_COMPANY_LOG(logComment);
            if (response) {
                this.form.comment = null;
                this.v$.$reset();
            }
            this.loader = false;
        },
        async load($state, id = this.company.id) {
            try {
                const response = await this.FETCH_COMPANY_LOGS(id);
                if (response === 'complete') {
                    $state.complete();
                }
                if (response === 'loaded') {
                    $state.loaded();
                }
            } catch (error) {
                $state.error();
            }
        }
    }
};
</script>
