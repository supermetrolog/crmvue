<template>
    <div v-if="complex" class="ComplexView">
        <FormComplex
            v-if="complexFormModalVisible"
            @close="toggleComplexFormModalVisible"
            :complex="complex"
        />
        <FormModalDelete
            v-if="complexFormDeleteModalVisible"
            @close="toggleComplexDeleteFormModalVisible"
            @delete="deleteComplex(complex.id)"
            text="комплекс"
            :title="`Удаление комплекса #${complex.id} (${complex.title || 'Без названия'})`"
        />
        <div class="ComplexHeader">
            <div class="ComplexHeader-content">
                <h1 class="ComplexHeader-name">{{ complex.title || 'Нет названия' }}</h1>
                <span class="ComplexHeader-description">
                    <strong>ID комплекса {{ complex.id }}, </strong>
                    поступление {{ $formatter.date(complex.publ_time, true) }},
                    <span v-if="complex.author">
                        {{ complex.author.userProfile.full_name }}
                    </span>
                    <span v-else>без автора</span>, последнее обновление
                    {{ $formatter.date(complex.last_update, true) }}
                </span>
            </div>
            <div v-if="editAccess" class="complex-header__actions">
                <Button @click="toggleComplexFormModalVisible" icon>
                    <span>Редактировать</span>
                    <i class="fas fa-pen edit"></i>
                </Button>
                <Button @click="toggleComplexDeleteFormModalVisible" danger icon>
                    <span>Удалить</span>
                    <i class="fas fa-trash edit"></i>
                </Button>
            </div>
        </div>
        <ComplexMap :location="complexLocation" />
        <ComplexAbout :complex="complex" />
        <ComplexHoldings :objects="complex.objects" />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ComplexAbout from '@/components/Complex/ComplexAbout.vue';
import ComplexMap from '@/components/Complex/ComplexMap.vue';
import ComplexHoldings from '@/components/Complex/Holding/ComplexHoldings.vue';
import Button from '@/components/common/Button.vue';
import FormComplex from '@/components/Forms/Complex/FormComplex.vue';
import FormModalDelete from '@/components/Forms/FormModalDelete.vue';

export default {
    name: 'ComplexView',
    components: { FormModalDelete, FormComplex, Button, ComplexHoldings, ComplexMap, ComplexAbout },
    data() {
        return {
            editAccess: true,
            complexFormModalVisible: false,
            complexFormDeleteModalVisible: false
        };
    },
    computed: {
        ...mapState({
            complex: state => state.Complex.complex
        }),
        complexLocation() {
            return {
                ...this.complex.location,
                fromMkad: this.complex.from_mkad,
                latitude: this.complex.latitude,
                longitude: this.complex.longitude
            };
        }
    },
    methods: {
        ...mapActions({
            fetchComplex: 'Complex/FETCH_COMPLEX',
            deleteComplex: 'Complex/DELETE_COMPLEX'
        }),
        toggleComplexFormModalVisible() {
            this.complexFormModalVisible = !this.complexFormModalVisible;
        },
        toggleComplexDeleteFormModalVisible() {
            this.complexFormDeleteModalVisible = !this.complexFormDeleteModalVisible;
        }
    },
    async created() {
        await this.fetchComplex(this.$route.params.complex_id);
        console.log('Complex: ', this.complex);
    }
};
</script>
