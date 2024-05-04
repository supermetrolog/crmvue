<template>
    <Modal @close="$emit('close')" width="800" title="Настройка фильтров">
        <Form>
            <FormGroup>
                <div class="col-12">
                    <span class="form__subtitle">Дата последнего звонка</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(filter, index) in callFilters"
                            :key="index"
                            v-model="form.call"
                            :value="index"
                            :text="filter"
                        />
                    </div>
                </div>
            </FormGroup>
            <FormGroup>
                <div class="col-12">
                    <span class="form__subtitle">Вид сделки</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(dealType, index) in dealTypeFilters"
                            :key="index"
                            v-model="form.dealType"
                            :value="index"
                            :text="dealType"
                        />
                    </div>
                </div>
            </FormGroup>
        </Form>
        <template #footer>
            <MessengerButton @click="apply" color="success">Применить</MessengerButton>
            <MessengerButton @click="$emit('close')">Отмена</MessengerButton>
            <AnimationTransition>
                <MessengerButton v-if="hasFilters" @click="clear" color="danger">
                    Очистить фильтры
                </MessengerButton>
            </AnimationTransition>
        </template>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const callFilters = {
    0: 'Менее 30 дней',
    1: 'Более 30 дней',
    2: 'Более 60 дней',
    3: 'Более 90 дней'
};

const dealTypeFilters = {
    0: 'Аренда',
    1: 'Продажа',
    2: 'Ответ-хранение',
    3: 'Субаренда'
};

export default {
    name: 'FormModalMessengerFilters',
    components: { AnimationTransition, MessengerButton, CheckboxChip, FormGroup, Form, Modal },
    props: {
        modelValue: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            callFilters: callFilters,
            dealTypeFilters: dealTypeFilters,
            form: {
                call: [],
                dealType: []
            }
        };
    },
    computed: {
        hasFilters() {
            return this.form.call.length || this.form.dealType.length;
        }
    },
    methods: {
        apply() {
            this.$emit('update:modelValue', this.form);
            this.$emit('close');
        },
        clear() {
            this.form = {
                call: [],
                dealType: []
            };
        }
    },
    created() {
        this.form = { ...this.form, ...this.modelValue };
    }
};
</script>
