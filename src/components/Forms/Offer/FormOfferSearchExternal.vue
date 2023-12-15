<template>
    <Form @submit="onSubmit" class="row">
        <div class="col-6">
            <Input
                v-model="form.all"
                @keydown.enter="onSubmit"
                label="Поиск"
                placeholder="ID, адрес, собственник, телефон, ФИО"
                class="main-input"
            />
        </div>
        <div class="col-2 align-self-end">
            <div class="offer-search__actions">
                <Button @click="$emit('openFilters')" icon>
                    <span v-if="filterCount" class="button__badge badge badge-danger">
                        {{ filterCount }}
                    </span>
                    <i class="icon fa-solid fa-sliders"></i>
                </Button>
                <div>
                    <a
                        :href="$router.resolve({ name: isMap ? 'OffersMain' : 'OffersMap', query: $route.query }).href"
                        class="button button--icon"
                    >
                        <i v-if="isMap" class="icon fa-solid fa-list-ul"></i>
                        <i v-else class="icon fa-solid fa-map-location-dot"></i>
                        <span>
                            {{ isMap ? 'Списком' : 'На карте' }}
                            <span v-if="isMap">{{ offersCount }} ({{ objectsCount }})</span>
                            <span v-else>({{ offersCount ?? objectsCount }})</span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="offer-search__functions">
                <Button @click.prevent="clickFavorites" icon warning small>
                    <i class="fa-solid fa-star"></i>
                    <span>Избранные</span>
                </Button>
                <Button icon success small>
                    <i class="fa-solid fa-heart"></i>
                    <span>Сохранить поиск</span>
                </Button>
                <Button @click="resetForm" icon small>
                    <i class="fa-solid fa-circle-xmark"></i>
                    <span>Сбросить фильтры</span>
                </Button>
            </div>
        </div>
    </Form>
</template>

<script>
import { FormMixin } from '@/components/Forms/mixins.js';
import { waitHash } from '@/utils';
import Button from '@/components/common/Button.vue';

export default {
    name: 'FormOfferSearchExternal',
    components: { Button },
    mixins: [FormMixin],
    props: {
        offersCount: {
            type: Number,
            default: 0
        },
        isMap: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        '$route.query': function (newQuery, oldQuery) {
            delete newQuery.page;
            delete oldQuery.page;
            if (waitHash(newQuery) !== waitHash(oldQuery)) {
                this.setDefaultFields();
                this.setQueryFields();
            }
        }
    },
    methods: {
        clickFavorites() {
            if (this.form.favorites) {
                this.form.favorites = null;
            } else {
                this.form.favorites = 1;
            }
        }
    }
};
</script>