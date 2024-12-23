<template>
    <div class="company-preview">
        <CompanyPreviewHeader :company />
        <div class="company-preview__body">
            <div class="company-preview__preview">
                <CompanyLogo
                    v-tippy="'Нажмите, чтобы изменить логотип'"
                    @click="logoFormIsVisible = true"
                    :company-id="company.id"
                    :size="200"
                    :src="company?.logo?.src"
                    as="div"
                    class="company-preview__logo"
                />
                <div v-if="generalContact?.websites?.length" class="company-preview__websites">
                    <a
                        v-for="website of websites"
                        :key="website.id"
                        :href="website.href"
                        target="_blank"
                    >
                        {{ website.label }}
                    </a>
                </div>
            </div>
            <div class="company-preview__tabs">
                <Tabs nav-item-link-class="company-preview-tab dashboard-chip">
                    <Tab name="Описание">
                        <p v-if="company.description">{{ company.description }}</p>
                        <p v-else>Описание не заполнено</p>
                    </Tab>
                    <Tab name="Адрес">
                        <p v-if="company.officeAdress">
                            {{ company.officeAdress }}
                        </p>
                        <p v-else>Не указан</p>
                    </Tab>
                    <Tab name="Ревизиты">
                        <CompanyPreviewRequisites :company />
                    </Tab>
                    <Tab name="Документы">
                        <CompanyPreviewDocuments :files="company.files" />
                    </Tab>
                </Tabs>
            </div>
        </div>
        <teleport to="body">
            <Modal
                @close="closeForm"
                :show="logoFormIsVisible"
                :close-on-outside-click="!logoEdited"
                :close-on-press-esc="!logoEdited"
                :min-height="200"
                title="Обновление логотипа"
                width="800"
            >
                <FormCompanyLogo
                    @updated="onUpdateLogo"
                    @deleted="onDeleteLogo"
                    @canceled="closeForm"
                    @edited="logoEdited = true"
                    :company="company"
                />
            </Modal>
        </teleport>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import Modal from '@/components/common/Modal.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import { toCorrectUrl } from '@/utils/formatters/string.js';
import CompanyPreviewRequisites from '@/components/Company/Preview/CompanyPreviewRequisites.vue';
import CompanyPreviewDocuments from '@/components/Company/Preview/CompanyPreviewDocuments.vue';
import CompanyPreviewHeader from '@/components/Company/Preview/CompanyPreviewHeader.vue';

const emit = defineEmits(['start-editing', 'logo-updated']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const generalContact = computed(() => props.company.contacts.find(item => item.type === 1));

const websites = computed(() => {
    return generalContact.value.websites.map(website => ({
        id: website.id,
        href: toCorrectUrl(website.website),
        label: website.website
    }));
});

// logo

const notify = useNotify();

const logoFormIsVisible = ref(false);
const logoEdited = ref(false);

function closeForm() {
    logoFormIsVisible.value = false;
}

function onUpdateLogo(logo) {
    closeForm();
    notify.success('Логотип компании обновлен');
    emit('logo-updated', logo);
}

function onDeleteLogo() {
    closeForm();
    notify.success('Логотип компании удален');
    emit('logo-updated', null);
}
</script>
