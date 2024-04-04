<template>
    <div class="user-picker">
        <Input v-model="debouncedUserQuerySearch" rounded placeholder="Введите имя брокера.." />
        <div ref="list" class="user-picker__list">
            <UserPickerElement
                v-for="user in filteredUsers"
                :key="user.id"
                @click="toggleUser(user)"
                :user="user"
                :class="{ selected: selectedUsers[user.id].selected }"
            />
        </div>
        <MessengerButton
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
        modelValue(newValue) {
            if (!newValue.length)
                Object.keys(this.selectedUsers).forEach(
                    key => (this.selectedUsers[key].selected = false)
                );
            else {
                newValue.forEach(element => (this.selectedUsers[element.id].selected = true));
            }
        }
    },
    methods: {
        toggleUser(user) {
            this.selectedUsers[user.id].selected = !this.selectedUsers[user.id].selected;

            if (this.selectedUsers[user.id].selected) {
                this.$emit(
                    'update:modelValue',
                    this.modelValue.concat(this.selectedUsers[user.id].profile)
                );
            } else {
                this.$emit(
                    'update:modelValue',
                    Object.keys(this.selectedUsers)
                        .filter(key => this.selectedUsers[key].selected)
                        .map(key => this.selectedUsers[key].profile)
                );
            }
        },
        toggleSelectedAll() {
            if (this.modelValue.length === this.users.length) this.$emit('update:modelValue', []);
            else this.$emit('update:modelValue', this.users);
        }
    },
    created() {
        this.selectedUsers = this.users.reduce((acc, user) => {
            acc[user.id] = { profile: user, selected: false };
            return acc;
        }, {});

        this.modelValue.forEach(element => (this.selectedUsers[element.id].selected = true));
    }
};
</script>
<style></style>
