<template>
    <div class="caller-manager__contact">
        <div class="row no-gutters caller-manager__contact__container">
            <div class="caller-type col-12">
                <p>Кто звонит?</p>
                <Radio v-model="callerType" @change="onChange" :options="callerTypeOptions" mode="text" />
            </div>

            <div class="col-12 contact">
                <h2 class="name">{{ contact.full_name }}</h2>
                <p class="position">
                    {{ position }}
                </p>
                <p :class="{ danger: contact.warning, 'text-success': contact.good }">
                    {{ relationships }}
                </p>
                <div class="company">
                    <router-link :to="'/companies/' + contact.company_id">{{
                        contact.company.full_name
                    }}</router-link>
                    <Rating :rating="contact.company.rating" />
                </div>
                <div class="consultant">
                    <p>Ведет: Казимов Игорь</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { CallerTypeList, PositionList, RatingList } from '@/const/const';
import Radio from '@/components/common/Forms/Radio.vue';
import Rating from '@/components/common/Rating.vue';

export default {
    name: 'CallerManagerExistContact',
    components: {
        Rating,
        Radio
    },
    props: {
        contact: {
            type: Object
        }
    },
    data() {
        return {
            callerType: []
        };
    },
    computed: {
        position() {
            if (this.contact.position_unknown) {
                return 'Должность не известна!';
            }
            let pos = this.positionOptions.find(item => item.value == this.contact.position);
            if (pos) {
                return pos.label;
            }
            return null;
        },
        relationships() {
            if (this.contact.good) {
                return 'Хорошие взаимотношения!';
            }
            if (this.contact.warning) {
                return 'Внимание проблемный!';
            }
            return null;
        },
        ratingOptions: () => RatingList,
        callerTypeOptions: () => CallerTypeList,
        positionOptions: () => PositionList
    },
    methods: {
        onChange() {}
    }
};
</script>

<style></style>
