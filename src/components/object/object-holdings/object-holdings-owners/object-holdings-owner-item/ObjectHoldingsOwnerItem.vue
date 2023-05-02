<template>
    <div class="ObjectHoldingsOwnerItem">
        <span class="ObjectHoldingsOwnerItem-header">Собственник {{ index }}</span>
        <span class="ObjectHoldingsOwnerItem-name">{{ owner.name }}</span>
        <div class="ObjectHoldingsOwnerItem-rating">
            <i v-for="rating in ratingOptions" :key="rating[0]" class="text-warning far fa-star" :class="{
                'fas fa-star': owner.rating >= rating[0],
            }">
            </i>
        </div>
        <div class="ObjectHoldingsOwnerItem-links">
            <span>{{ plural(owner.contacts.length, '%d контакт', '%d контакта', '%d контактов') }}, </span>
            <span>{{ plural(owner.requests.length, '%d запрос', '%d запроса', '%d запросов') }}, </span>
            <span>{{ plural(owner.objects.length, '%d объект', '%d объекта', '%d объектов') }}</span>
        </div>
    </div>
</template>

<script>
import plural from 'plural-ru';
import { RatingList } from "@/const/Const";
import './styles.scss'
export default {
    name: 'ObjectHoldingsOwnerItem',
    components: {},
    props: {
        owner: {
            type: Object,
            default: () => { }
        },
        index: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            ratingOptions: RatingList.get("param"),
            plural: plural
        }
    },
    computed: {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>