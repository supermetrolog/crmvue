<template>
    <div class="caller-manager__contact">
        <div class="row no-gutters caller-manager__contact__container">
            <div class="caller-type col-12">
                <p>Кто звонит?</p>
                <Radio v-model="callerType" :options="CallerTypeList" mode="text" />
            </div>

            <div class="col-12 contact">
                <h2 class="name">{{ contact.full_name }}</h2>
                <p class="position">
                    <ContactPositionField :contact />
                </p>
                <p :class="{ danger: contact.warning, 'text-success': contact.good }">
                    {{ relationships }}
                </p>
                <div class="company">
                    <router-link :to="'/companies/' + contact.company_id">
                        {{ contact.company.full_name }}
                    </router-link>
                    <Rating :rating="contact.company.rating" />
                </div>
                <div class="consultant">
                    <p>Ведет: Казимов Игорь</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Radio from '@/components/common/Forms/Radio.vue';
import Rating from '@/components/common/Rating.vue';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';
import { Contact } from '@/types/contact/contact';
import { computed, ref } from 'vue';
import { CallerTypeList } from '@/const/const';

const props = defineProps<{ contact: Contact }>();

const callerType = ref([]);

const relationships = computed(() => {
    if (props.contact.good) {
        return 'Хорошие взаимоотношения!';
    }

    if (props.contact.warning) {
        return 'Внимание проблемный!';
    }

    return null;
});
</script>
