<template>
    <div ref="loader" class="messenger-loader" :class="classList"></div>
</template>
<script>
export default {
    name: 'MessengerLoader',
    props: {
        active: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            timeout: null,
            finishing: false
        };
    },
    computed: {
        classList() {
            return {
                load: this.active,
                finish: this.finishing
            };
        }
    },
    watch: {
        active(value) {
            if (!value) {
                if (this.timeout) clearTimeout(this.timeout);

                this.finishing = true;

                this.timeout = setTimeout(() => {
                    this.finishing = false;
                    if (this.timeout) clearTimeout(this.timeout);
                }, 400);
            }
        }
    }
};
</script>
