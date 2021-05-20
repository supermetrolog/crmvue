<template>
  <div class="col-lg-3 align-self-center text-right">
    <ul class="nav-list horizontal">
      <li
        class="nav-item comments"
        :class="{
          active: active === 'comments',
        }"
      >
        <a href="#" class="nav-link" @click="getComments()">
          <div class="nav-link__content">
            <i class="far fa-comments"></i>
            <span class="badge badge-danger"> 12 </span>
          </div>
        </a>
        <vComments
          v-if="active === 'comments'"
          :comments="comments"
          @delete-comment="deleteComment"
        />
      </li>
      <li
        class="nav-item notification"
        @click="active = 'notification'"
        :class="active === 'notification' ? 'active' : ''"
      >
        <a href="# " class="nav-link">
          <div class="nav-link__content">
            <i class="far fa-bell"></i>
            <span class="badge badge-warning"> 13 </span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import vComments from "./comments/v-comments.vue";
export default {
  name: "v-nav-notif",
  components: { vComments },
  data() {
    return {
      active: null,
      comments: [],
    };
  },
  methods: {
    async getComments() {
      this.active = "comments";
      await this.axios
        .get("http://localhost:3000/comments")
        .then((Response) => {
          this.comments = Response.data;
          console.log("HUI" + this.comments);
        });
    },

    deleteComment(comment) {
      this.comments = this.comments.filter((item) => item !== comment);
      console.log(this.comments);
      console.log(comment);
    },
  },
};
</script>

<style>
</style>