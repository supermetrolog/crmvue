<template>
    <th class="table__th th" :class="{ sortable: !!sort }">
        <div class="th__content" @click="sortHandle">
            <slot/>
            <i
                class="fas fa-sort-amount-down ml-1 sortable__icon"
                v-if="sort && sort_desc"
            ></i>
            <i
                class="fas fa-sort-amount-down-alt ml-1 sortable__icon"
                v-if="sort && sort_asc"
            ></i>
        </div>
    </th>
</template>

<script>
import TableMixin from "./mixins.js";

export default {
    mixins: [TableMixin],
    name: "Th",
    methods: {
        sortHandle() {
            if (!this.sort) return;
            this.$emit("sort", this.sort);
            if (!this.withRouter) return;
            let query = {...this.$route.query};

            if (!query.sort) {
                query.sort = this.sort;
                return this.$router.push({query});
            }

            const words = query.sort.split(",");
            const newSortParams = [];
            let existSort = false;
            words.forEach((item) => {
                if (item == this.sort || item == `-${this.sort}`) {
                    existSort = true;
                    if (item === this.sort) {
                        newSortParams.push(`-${this.sort}`);
                    }
                } else {
                    newSortParams.push(item);
                }
            });
            if (existSort) {
                query.sort = newSortParams.join();
            } else {
                query.sort += `,${this.sort}`;
            }

            if (!query.sort) {
                delete query.sort;
            }
            return this.$router.push({query});
        },
    },
};
</script>

<style>
</style>