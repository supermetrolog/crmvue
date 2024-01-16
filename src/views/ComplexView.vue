<template>
    <div v-if="complex" class="ComplexView">
        <div class="ComplexHeader">
            <div class="ComplexHeader-content">
                <h1 class="ComplexHeader-name">{{ complex.title || 'Нет названия' }}</h1>
                <span class="ComplexHeader-description">
                    <strong>ID комплекса {{ complex.id }}, </strong>
                    поступление {{ $formatter.date(complex.publ_time) }},
                    <span v-if="complex.author">
                        {{ complex.author.userProfile.full_name }}
                    </span>
                    <span v-else>без автора</span>, последнее обновление
                    {{ $formatter.date(complex.last_update) }}
                </span>
            </div>
            <div v-if="editAccess" class="ComplexHeader-actions">
                <button>
                    <i class="fas fa-pen text-primary edit"></i>
                </button>
            </div>
        </div>
        <ComplexMap :location="complexLocation" />
        <ComplexAbout :complex="complex" />
        <ComplexHoldings :objects="complex.objects" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ComplexAbout from '@/components/Complex/ComplexAbout.vue';
import ComplexMap from '@/components/Complex/ComplexMap.vue';
import ComplexHoldings from '@/components/Complex/Holding/ComplexHoldings.vue';

export default {
    name: 'ComplexView',
    components: { ComplexHoldings, ComplexMap, ComplexAbout },
    data() {
        return {
            complex: null,
            editAccess: false
        };
    },
    computed: {
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
            fetchComplex: 'FETCH_COMPLEX'
        })
    },
    async created() {
        this.complex = await this.fetchComplex(this.$route.params.complex_id);
    }
};
</script>
