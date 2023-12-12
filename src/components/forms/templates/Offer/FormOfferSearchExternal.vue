<template>
    <Form class="row" @submit="onSubmit">
        <div class="col-6">
            <Input
                v-model="form.all"
                label="Поиск"
                placeholder="ID, адрес, собственник, телефон, ФИО"
                class="main-input"
                @keydown.enter="onSubmit"
            />
        </div>
        <div class="col-2 align-self-end">
            <div class="offer-search__actions">
                <Button icon @click="$emit('openFilters')">
                    <span class="button__badge badge badge-danger" v-if="filterCount">
                        {{ filterCount }}
                    </span>
                    <i class="icon fa-solid fa-sliders"></i>
                </Button>
                <div>
                    <a
                        :href="$router.resolve({name: isMap ? 'OffersMain' : 'OffersMap', query: $route.query}).href"
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
                <Button icon warning small @click.prevent="clickFavorites">
                    <i class="fa-solid fa-star"></i>
                    <span>Избранные</span>
                </Button>
                <Button icon success small>
                    <i class="fa-solid fa-heart"></i>
                    <span>Сохранить поиск</span>
                </Button>
                <Button icon small @click="resetForm">
                    <i class="fa-solid fa-circle-xmark"></i>
                    <span>Сбросить фильтры</span>
                </Button>
            </div>
        </div>
    </Form>
</template>

<script>
import {FormMixin} from "@/components/forms/templates/mixins.js";
import {waitHash} from "@/utils/index.js";
import Button from "@/components/common/Button.vue";

export default {
    components: {Button},
    name: "FormOfferSearchExternal",
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
    methods: {
        clickFavorites() {
            if (this.form.favorites) {
                this.form.favorites = null;
            } else {
                this.form.favorites = 1;
            }
        },
    },
    watch: {
        "$route.query": function (newQuery, oldQuery) {
            delete newQuery.page;
            delete oldQuery.page;
            if (waitHash(newQuery) !== waitHash(oldQuery)) {
                this.setDefaultFields();
                this.setQueryFields();
            }
        }
    }
};
</script>