<template>
  <div class="row no-gutters table">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>фио</th>
          <th>год</th>
          <th>телефон</th>
          <th>колл</th>
          <th>юрист</th>
          <th>тематика</th>
          <th>статус</th>
          <th>время</th>
          <th>действия</th>
        </tr>
      </thead>
      <tbody>
        <Separator
          v-for="(commingsOneDay, index) in commingList"
          :key="index"
          :commings="commingsOneDay"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import Separator from "./Separator";
export default {
  name: "table",
  components: {
    Separator,
  },
  data() {
    return {
      commingList: [],
    };
  },
  async created() {
    await this.axios.get("http://localhost:3000/commings").then((Response) => {
      this.commingList = Response.data;
      console.log(Response.data);
    });
  },
};
</script>
