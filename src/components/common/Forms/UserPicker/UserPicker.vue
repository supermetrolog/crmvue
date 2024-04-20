<template>
    <div class="user-picker">
        <Input v-model="debouncedUserQuerySearch" rounded placeholder="Введите имя брокера.." />
        <div ref="list" class="user-picker__list">
            <UserPickerElement
                v-for="user in filteredUsers"
                :key="user.id"
                @click="toggleUser(user.id)"
                :user="user"
                :class="{ selected: selectedUsers[user.id] }"
            />
        </div>
        <MessengerButton
            v-if="!single"
            @click="toggleSelectedAll"
            class="w-100"
            :class="{ active: modelValue.length === users.length }"
        >
            {{ modelValue.length === users.length ? 'Отменить всех' : 'Выбрать всех' }}
        </MessengerButton>
    </div>
</template>
<script>
import Input from '@/components/common/Forms/Input.vue';
import UserPickerElement from '@/components/common/Forms/UserPicker/UserPickerElement.vue';
import { alg } from '@/utils/alg';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';

export default {
    name: 'UserPicker',
    components: { MessengerButton, UserPickerElement, Input },
    emits: ['update:modelValue'],
    props: {
        users: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: Array,
            default: () => []
        },
        single: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            userQuerySearch: '',
            selectedUsers: {}
        };
    },
    computed: {
        filteredUsers() {
            return this.users.map(user => ({
                ...user,
                selected:
                    !this.userQuerySearch.length ||
                    user.userProfile.full_name
                        .toLowerCase()
                        .includes(this.userQuerySearch.toLowerCase())
            }));
        },
        debouncedUserQuerySearch: {
            set: alg.debounce(function (value) {
                this.userQuerySearch = value;
            }, 200),
            get() {
                return this.userQuerySearch;
            }
        }
    },
    watch: {
        modelValue(newValue, oldValue) {
            if (this.single) {
                if (oldValue) this.selectedUsers[oldValue] = false;
                if (newValue) this.selectedUsers[newValue] = true;
            } else {
                if (oldValue?.length)
                    oldValue.forEach(userID => (this.selectedUsers[userID] = false));
                if (newValue?.length)
                    newValue.forEach(userID => (this.selectedUsers[userID] = true));
            }
        }
    },
    methods: {
        toggleUser(userID) {
            if (this.selectedUsers[userID]) {
                this.$emit(
                    'update:modelValue',
                    this.single ? null : this.modelValue.filter(element => element !== userID)
                );
            } else {
                this.$emit(
                    'update:modelValue',
                    this.single ? userID : this.modelValue.concat([userID])
                );
            }
        },
        toggleSelectedAll() {
            if (this.modelValue.length === this.users.length) this.$emit('update:modelValue', []);
            else
                this.$emit(
                    'update:modelValue',
                    this.users.map(user => user.id)
                );
        }
    },
    created() {
        this.selectedUsers = this.users.reduce((acc, user) => {
            acc[user.id] = false;
            return acc;
        }, {});

        if (this.single) {
            if (this.modelValue) this.selectedUsers[this.modelValue] = true;
        } else {
            this.modelValue.forEach(userID => (this.selectedUsers[userID] = true));
        }
    }
};
</script>
<style></style>
