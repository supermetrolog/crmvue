<template>
    <div class="button">
        <button
            v-if="!optionsLocale.extraVisible || optionsLocale.btnVisible"
            @click="clickBtn"
            class="action"
            :class="[
                {
                    active: optionsLocale.btnActive
                },
                optionsLocale.btnClass,
                { disabled: optionsLocale.disabled }
            ]"
            :title="optionsLocale.disabled ? 'нет доступа' : optionsLocale.title"
        >
            <slot name="btnContent"></slot>
        </button>

        <div v-if="optionsLocale.extraVisible" class="actions d-inline-block text-center">
            <slot name="extraContent" :data="{ openned: optionsLocale.extraVisible }"></slot>
            <div v-show="optionsLocale.extraVisible" :class="{ 'mt-1': optionsLocale.btnVisible }">
                <textarea ref="fuck" v-model.trim="comment" @keypress.enter="confirm" class="mb-1" />
                <button @click="confirm" class="btn-action text-success">
                    <i class="fas fa-check"></i>
                </button>
                <button @click="cancel" class="btn-action text-danger">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomButton',
    props: {
        options: {
            type: Object
        }
    },
    data() {
        return {
            comment: null,
            optionsLocale: {
                extraVisible: false,
                btnActive: false,
                btnVisible: true,
                btnClass: '',
                defaultBtn: false,
                disabled: false,
                ...this.options
            }
        };
    },
    watch: {
        options() {
            this.optionsLocale = { ...this.optionsLocale, ...this.options };
        }
    },
    methods: {
        clickBtn() {
            if (this.optionsLocale.disabled) {
                return;
            }
            if (this.optionsLocale.btnActive || this.optionsLocale.defaultBtn) {
                return this.$emit('confirm');
            }

            this.optionsLocale.extraVisible = true;
            this.$emit('extraVisibleOpen');
            setTimeout(() => {
                this.$refs.fuck.focus();
            });
        },
        cancel() {
            this.optionsLocale.extraVisible = false;
            this.$emit('extraVisibleClose');
            this.comment = null;
        },
        confirm() {
            if (this.optionsLocale.disabled) {
                return;
            }
            this.optionsLocale.extraVisible = false;
            this.$emit('extraVisibleOpen');
            this.$emit('confirm', this.comment);
            this.comment = null;
        }
    }
};
</script>

<style></style>