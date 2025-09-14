<template>
    <div class="d-flex justify-content-center">
        <CompanyRowCardSkeleton v-if="isLoading" class="user-notification-card-template__company" />
        <CompanyRowCard
            v-else-if="company"
            :company
            class="user-notification-card-template__company"
        >
            <template #menu>
                <UiDropdownActionsButton
                    @handle="toCompany"
                    label="Просмотреть компанию"
                    icon="fa-solid fa-arrow-up-right-from-square"
                />
                <UiDropdownActionsButton
                    @handle="contactsIsVisible = true"
                    label="Список контактов"
                    icon="fa-solid fa-contact-card"
                />
            </template>
        </CompanyRowCard>
        <teleport to="body">
            <AnimationTransition :speed="0.3">
                <TaskCardContacts
                    v-if="contactsIsVisible"
                    @close="contactsIsVisible = false"
                    :company-id="companyId"
                    :z-index="6000"
                />
            </AnimationTransition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { UserNotification } from '@/types/user-notification/user-notification';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import CompanyRowCard from '@/components/CompanyRowCard/CompanyRowCard.vue';
import api from '@/api/api';
import CompanyRowCardSkeleton from '@/components/CompanyRowCard/CompanyRowCardSkeleton.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useRouter } from 'vue-router';
import TaskCardContacts from '@/components/TaskCard/TaskCardContactsList.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const props = defineProps<{ notification: UserNotification }>();

const companyId = computed(
    () =>
        props.notification.relations.find(relation => relation.entity_type === 'company')?.entity_id
);

const isLoading = ref(false);
const company = shallowRef(null);

async function fetchCompany() {
    isLoading.value = true;

    company.value = await api.companies.getCompany(companyId.value);

    isLoading.value = false;
}

onBeforeMount(() => {
    if (companyId.value) {
        fetchCompany();
    }
});

const router = useRouter();

function toCompany() {
    window.open(
        router.resolve({ name: 'company', params: { id: companyId.value } }).href,
        '_blank'
    );
}

const contactsIsVisible = ref(false);
</script>
