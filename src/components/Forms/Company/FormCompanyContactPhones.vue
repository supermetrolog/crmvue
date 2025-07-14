<template>
    <div>
        <Loader v-if="isLoading" small />
        <UiFormPhonesPreview
            @create="formIsVisible = true"
            @edit="editPhone"
            @set-as-main="setMainPhone"
            :phones
        />
        <teleport to="body">
            <FormModalPhone
                v-if="isEditMode && formIsVisible"
                @close="closePhoneForm"
                @created="onPhoneCreated"
                @updated="onPhoneUpdated"
                @deleted="onPhoneDeleted"
                :form-data="editingPhone"
                :contact-id="contact.id"
            />
            <FormModalNewPhone
                v-else-if="formIsVisible"
                @close="closePhoneForm"
                @created="onNewPhoneCreated"
                @updated="onNewPhoneUpdated"
                @delete="deleteNewPhone"
                :form-data="editingNewPhone"
            />
        </teleport>
    </div>
</template>

<script setup lang="ts">
import Loader from '@/components/common/Loader.vue';
import { computed, ref } from 'vue';
import api from '@/api/api.js';
import FormModalPhone from '@/components/Forms/FormModalPhone.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import FormModalNewPhone from '@/components/Forms/FormModalNewPhone.vue';
import UiFormPhonesPreview from '@/components/common/Forms/UiFormPhonesPreview.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { captureException } from '@sentry/vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { Phone } from '@/types/contact/phone';

const phones = defineModel<Phone[]>('phones');

const props = defineProps({
    contact: Object
});

const isEditMode = computed(() => isNotNullish(props.contact));

const isLoading = ref(false);

// phones

if (isNotNullish(props.contact)) {
    fetchPhones();
}

async function fetchPhones() {
    try {
        isLoading.value = true;

        phones.value = await api.contacts.phones(props.contact.id);
    } catch (error) {
        captureException(error);
    } finally {
        isLoading.value = false;
    }
}

// phones form

const formIsVisible = ref(false);
const editingPhone = ref(null);

function onPhoneCreated(phone) {
    phones.value.push(phone);

    closePhoneForm();
    fetchPhones();
}

function onPhoneUpdated(phone) {
    const currentPhone = phones.value.find(element => element.id === phone.id);

    if (currentPhone) {
        Object.assign(currentPhone, phone);
    }

    closePhoneForm();
    fetchPhones();
}

function onPhoneDeleted(phone) {
    closePhoneForm();
    spliceById(phones.value, phone.id);
    fetchPhones();
}

// new phones

const editingNewPhone = ref(null);

function deleteNewPhone(phone) {
    closePhoneForm();
    spliceById(phones.value, phone.id);
}

function onNewPhoneCreated(phone) {
    phones.value.push(phone);
    formIsVisible.value = false;

    if (phone.isMain) setMainPhone(phone);
}

function onNewPhoneUpdated(id, phone) {
    Object.assign(editingNewPhone.value, phone);
    formIsVisible.value = false;
    editingNewPhone.value = null;

    if (phone.isMain) setMainPhone(phone);
}

function editPhone(phone) {
    if (isEditMode.value) {
        editingPhone.value = phone;
    } else {
        editingNewPhone.value = phone;
    }

    formIsVisible.value = true;
}

const notify = useNotify();

async function setMainPhone(phone) {
    const currentMainPhone = phones.value.find(element => element.isMain === 1);

    phones.value.forEach(element => {
        if (element.id !== phone.id) element.isMain = null;
        else element.isMain = 1;
    });

    if (currentMainPhone?.id === phone.id) return;

    if (isEditMode.value) {
        try {
            isLoading.value = true;

            await api.phone.markAsMain(phone.id);

            notify.success('Телефон отмечен как основной');
        } finally {
            isLoading.value = false;
        }
    }
}

function closePhoneForm() {
    formIsVisible.value = false;

    editingPhone.value = null;
    editingNewPhone.value = null;
}
</script>
