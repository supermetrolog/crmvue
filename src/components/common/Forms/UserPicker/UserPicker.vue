<template>
    <div class="user-picker">
        <UiInput v-model="debouncedUserQuerySearch" rounded placeholder="Введите сотрудника.." />
        <div ref="list" class="user-picker__list">
            <UserPickerElement
                v-for="(user, index) in users"
                :key="user.id"
                @click="toggleUser(user.id)"
                :selected="searchCache[index]"
                :user="user"
                :class="{
                    selected: selectedUsers[user.id],
                    current: currentUser.id === user.id,
                    disabled: disabled
                }"
            />
        </div>
        <MessengerButton
            v-if="!single"
            @click="toggleSelectedAll"
            :disabled="disabled"
            class="w-100"
            :class="{ active: modelValue.length === users.length }"
        >
            {{ modelValue.length === users.length ? 'Отменить всех' : 'Выбрать всех' }}
        </MessengerButton>
    </div>
</template>
<script setup>
import UiInput from '@/components/common/Forms/UiInput.vue';
import UserPickerElement from '@/components/common/Forms/UserPicker/UserPickerElement.vue';
import { debounce } from '@/utils/common/debounce.js';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import { useStore } from 'vuex';

const modelValue = defineModel({
    type: [Array, Number],
    default: () => []
});
const emit = defineEmits(['select']);
const props = defineProps({
    users: {
        type: Array,
        default: () => []
    },
    single: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const store = useStore();

const userQuerySearch = shallowRef('');
const selectedUsers = ref(
    props.users.reduce((acc, user) => {
        acc[user.id] = false;
        return acc;
    }, {})
);

if (props.single) {
    if (modelValue.value) selectedUsers.value[modelValue.value] = true;
} else modelValue.value.forEach(userID => (selectedUsers.value[userID] = true));

const currentUser = computed(() => store.getters.THIS_USER);

const searchCache = computed(() => {
    return props.users.map(user =>
        Boolean(
            !userQuerySearch.value.length ||
                user.userProfile.full_name
                    .toLowerCase()
                    .includes(userQuerySearch.value.toLowerCase())
        )
    );
});

const debouncedUserQuerySearch = computed({
    get() {
        return userQuerySearch.value;
    },
    set: debounce(function (value) {
        userQuerySearch.value = value;
    }, 200)
});

watch(
    () => modelValue.value,
    (newValue, oldValue) => {
        if (props.single) {
            if (oldValue) selectedUsers.value[oldValue] = false;
            if (newValue) selectedUsers.value[newValue] = true;
        } else {
            if (oldValue?.length) oldValue.forEach(userID => (selectedUsers.value[userID] = false));
            if (newValue?.length) newValue.forEach(userID => (selectedUsers.value[userID] = true));
        }
    },
    { deep: true }
);

const toggleUser = userID => {
    if (selectedUsers.value[userID]) {
        if (props.single) modelValue.value = null;
        else {
            modelValue.value = modelValue.value.filter(element => element !== userID);
        }
    } else {
        if (props.single) modelValue.value = userID;
        else modelValue.value.push(userID);
    }

    emit('select', modelValue.value);
};

const toggleSelectedAll = () => {
    if (modelValue.value.length === props.users.length) modelValue.value = [];
    else modelValue.value = props.users.map(user => user.id);

    emit('select', modelValue.value);
};
</script>
