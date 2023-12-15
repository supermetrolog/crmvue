<template>
    <div class="actions">
        <div v-if="type == 9" class="type-9">
            <div v-if="status != 2" class="company-form mt-2">
                <a v-show="handOverBtnVisisble" @click.prevent="clickHandOver" class="bg-primary text-light px-2 py-1">
                    Передать
                </a>
                <form v-show="!handOverBtnVisisble" @submit.prevent="submitForm">
                    <div class="input-group m-0">
                        <p>Выберите нового брокера</p>
                        <div class="row no-gutters">
                            <div class="col-6">
                                <Multiselect
                                    v-model="form.newConsultant"
                                    @change="changeSelect"
                                    :options="this.CONSULTANT_LIST"
                                    :canDeselect="false"
                                    title="Тип сделки"
                                    :class="{
                                        invalid: v$.form.newConsultant.$error,
                                        valid: v$.form.newConsultant.$dirty && !v$.form.newConsultant.$error
                                    }"
                                />
                                <div
                                    v-if="v$.form.newConsultant.$error"
                                    class="col-12 text-center error-container pt-1 pb-0"
                                >
                                    <span>{{ v$.form.newConsultant.$errors[0].$message }}</span>
                                </div>
                            </div>
                            <div class="col-6 pl-2">
                                <button class="btn btn-primary px-3">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button @click.prevent="clickBack" class="btn btn-danger px-3 ml-1">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div v-if="commentInputVisible" class="col-6 mt-1">
                                <textarea
                                    v-model="form.comment"
                                    @input="v$.form.comment.$touch"
                                    placeholder="Введите комментарий"
                                    :class="{
                                        invalid: v$.form.comment.$error,
                                        valid: v$.form.comment.$dirty && !v$.form.comment.$error
                                    }"
                                ></textarea>
                                <div v-if="v$.form.comment.$error" class="col-12 text-center error-container pt-1 pb-0">
                                    <span>{{ v$.form.comment.$errors[0].$message }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div v-else>
                <p class="text-success_alt">[ Обработано ]</p>
            </div>
        </div>
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import { mapActions, mapGetters } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

export default {
    name: 'HeaderNotificationsActions',
    components: {
        Multiselect
    },
    props: {
        type: {
            type: Number
        },
        status: {
            type: Number
        }
    },
    data() {
        return {
            v$: useValidate(),
            handOverBtnVisisble: true,
            commentInputVisible: false,
            selectedConsultant: null,
            ADMIN_STATUS: 11,
            form: {
                newConsultant: null,
                comment: ''
            }
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST'])
    },
    validations() {
        return {
            form: {
                newConsultant: {
                    required: helpers.withMessage('Выберите нового брокера', required)
                },
                comment: {
                    customRequired: helpers.withMessage('Введите комментарий', this.customRequired)
                }
            }
        };
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST']),
        customRequired(value) {
            if (!this.form.newConsultant) {
                return true;
            }
            const selectedConsultant = this.getConsultantDataById(this.form.newConsultant);
            if (selectedConsultant.status == this.ADMIN_STATUS) {
                if (value != '') {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        },
        getConsultantDataById(id) {
            return this.CONSULTANT_LIST.find(item => item.value == id);
        },
        submitForm() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.handOverBtnVisisble = true;
            }
        },
        clickHandOver() {
            this.handOverBtnVisisble = false;
        },
        clickBack() {
            this.handOverBtnVisisble = true;
            (this.form.newConsultant = null), (this.form.comment = '');
        },
        changeSelect(value) {
            this.v$.form.newConsultant.$touch;
            const selectedConsultant = this.getConsultantDataById(value);
            if (!selectedConsultant) {
                return;
            }
            if (selectedConsultant.status == this.ADMIN_STATUS) {
                this.commentInputVisible = true;
            } else {
                this.commentInputVisible = false;
            }
        }
    },
    async mounted() {
        if (this.type == 9) {
            await this.FETCH_CONSULTANT_LIST();
        }
    }
};
</script>

<style></style>