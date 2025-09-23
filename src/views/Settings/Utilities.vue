<template>
    <div class="container-fluid">
        <div class="row">
            <UiCol :cols="12">
                <DashboardCard title="Инструменты модератора">
                    <div class="row">
                        <UiCol :cols="4">
                            <UtilityCard
                                @run="formsVisibility.purposesFix = true"
                                title="Исправить назначения участка"
                                description="Инструмент для исправления объектов, у которых не отображается выбор назначения."
                                icon="fa-solid fa-screwdriver-wrench"
                            />
                        </UiCol>
                        <UiCol :cols="4">
                            <UtilityCard
                                @run="formsVisibility.transferCompanies = true"
                                title="Перенос компаний"
                                description="Инструмент для переноса компаний определенному консультанту."
                                icon="fa-solid fa-shuffle"
                            />
                        </UiCol>
                        <UiCol :cols="4">
                            <UtilityCard
                                @run="formsVisibility.notifications = true"
                                title="Создать уведомление"
                                description="Создать важное уведомление для сотрудника в CRM/Whatsapp/Telegram."
                                icon="fa-solid fa-bell"
                            />
                        </UiCol>
                    </div>
                </DashboardCard>
            </UiCol>
        </div>
        <Teleport to="body">
            <FormUtilityFixPurposes
                v-if="formsVisibility.purposesFix"
                @close="formsVisibility.purposesFix = false"
            />
            <FormUtilityTransferCompanies
                v-if="formsVisibility.transferCompanies"
                @close="formsVisibility.transferCompanies = false"
            />
            <FormUtilityCreateNotification
                v-if="formsVisibility.notifications"
                @close="formsVisibility.notifications = false"
            />
        </Teleport>
    </div>
</template>
<script setup lang="ts">
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { reactive } from 'vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import FormUtilityFixPurposes from '@/components/Forms/Utility/FormUtilityFixPurposes.vue';
import UtilityCard from '@/components/Utility/UtilityCard.vue';
import FormUtilityTransferCompanies from '@/components/Forms/Utility/FormUtilityTransferCompanies.vue';
import FormUtilityCreateNotification from '@/components/Forms/Utility/FormUtilityCreateNotification.vue';

const formsVisibility = reactive({
    purposesFix: false,
    transferCompanies: false,
    notifications: false
});
</script>
