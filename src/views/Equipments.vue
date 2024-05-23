<template>
    <section class="equipments-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="equipments-page__search white-block mb-3">
                        <div class="row mb-4 align-items-end">
                            <div class="col-6">
                                <FormEquipmentSearch @changed="fetchEquipments" />
                            </div>
                            <div class="offset-2 col-4">
                                <div class="d-flex align-items-end justify-content-end">
                                    <MultiSelect
                                        v-model="sortingOption"
                                        label="Сортировка"
                                        placeholder="Выберите сортировку"
                                        :options="sortingOptions"
                                        class="w-100"
                                    />
                                    <Button
                                        @click="formEquipmentIsVisible = true"
                                        class="flex-shrink-0 ml-2"
                                        success
                                    >
                                        + Добавить оборудование
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <PaginationClassic
                            v-if="equipments.length"
                            ref="firstPagination"
                            @next="setNextPage"
                            :pagination="pagination"
                        />
                    </div>
                    <Spinner v-if="isLoading" />
                    <EmptyData v-else-if="!equipments.length">Список оборудования пуст</EmptyData>
                    <div v-if="equipments.length" v-show="!isLoading" class="equipments-page__list">
                        <Equipment
                            v-for="equipment in equipments"
                            :key="equipment.id"
                            @edit="editEquipment(equipment)"
                            @view="viewEquipment(equipment)"
                            :equipment="equipment"
                            class="equipments-page__equipment"
                        />
                    </div>
                    <div v-if="equipments.length" v-show="!isLoading" class="white-block mt-3">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                </div>
            </div>
        </div>
        <teleport to="body">
            <EquipmentCardView
                v-if="viewEquipmentIsVisible"
                @close="closeViewEquipment"
                @edit="editEquipment(viewingEquipment)"
                :equipment="viewingEquipment"
                :editable="1"
            />
            <FormEquipment
                v-if="formEquipmentIsVisible"
                @close="formEquipmentIsVisible = false"
                @created="onCreatedEquipment"
                @updated="onUpdatedEquipment"
                :form-data="editingEquipment"
            />
        </teleport>
    </section>
</template>

<script>
import FormEquipment from '@/components/Forms/Equipment/FormEquipment.vue';
import FormEquipmentSearch from '@/components/Forms/Equipment/FormEquipmentSearch.vue';
import Equipment from '@/components/Equipment/Equipment.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Button from '@/components/common/Button.vue';
import api from '@/api/api.js';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import edit from '@/views/Account/Edit.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import EquipmentCardView from '@/components/Equipment/EquipmentCardView.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'Equipments',
    components: {
        EquipmentCardView,
        MultiSelect,
        EmptyData,
        Spinner,
        Button,
        PaginationClassic,
        Equipment,
        FormEquipmentSearch,
        FormEquipment
    },
    mixins: [LoaderMixin],
    data() {
        return {
            formEquipmentIsVisible: false,
            pagination: {},
            equipments: [],
            editingEquipment: null,
            viewingEquipment: null,
            viewEquipmentIsVisible: false,
            sortingOption: null,
            sortingOptions: [
                {
                    value: null,
                    label: 'По умолчанию'
                },
                { value: 'created_at', label: 'По дате создания (сначала старые)' },
                { value: '-created_at', label: 'По дате создания (сначала новые)' },
                {
                    value: 'updated_at',
                    label: 'По обновлению данных (сначала старые)'
                },
                {
                    value: '-updated_at',
                    label: 'По обновлению данных (сначала свежие)'
                }
            ]
        };
    },
    computed: {
        edit() {
            return edit;
        },
        ...mapGetters({ currentUser: 'THIS_USER', isModerator: 'isModerator' })
    },
    watch: {
        async sortingOption(value) {
            const query = { ...this.$route.query };

            if (value) query.sort = value;
            else delete query.sort;
            delete query.page;

            this.$router.replace({ query });
        }
    },
    methods: {
        async fetchEquipments() {
            this.loadingState = true;

            const response = await api.equipment.list(this.$route.query);

            this.equipments = response.data;
            this.pagination = response.pagination;

            this.loadingState = false;
        },
        async setNextPage(number) {
            let query = { ...this.$route.query };
            query.page = number;
            await this.$router.replace({ query });
        },
        editEquipment(equipment) {
            this.editingEquipment = equipment;
            this.formEquipmentIsVisible = true;
        },
        onUpdatedEquipment() {
            this.editingEquipment.title = 'Test';

            this.editingEquipment = null;
            this.$toast('Оборудование #id успешно изменено');
        },
        onCreatedEquipment() {
            this.$toast('Оборудование успешно создано');
        },
        viewEquipment(equipment) {
            this.viewingEquipment = equipment;
            this.viewEquipmentIsVisible = true;
        },
        closeViewEquipment() {
            this.viewEquipmentIsVisible = false;
            this.viewingEquipment = null;
        },
        userCanEdit(equipment) {
            return equipment.created_by_id === this.currentUser.id || this.isModerator;
        }
    },
    created() {
        this.fetchEquipments();
    }
};
</script>
