<template>
  <div class="CallerForm">
    <div class="CallerForm-reply px-2" v-if="replyText">
      <div>
        <i class="fas fa-reply"></i>
        <span class="CallerForm-reply-text">{{ replyText }} </span>
      </div>
      <button class="btn-action text-danger" @click="cancelReply">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <Form class="mb-3 p-2" @submit="onSubmit(question.id)">
      <FormGroup>
        <Textarea
          class="col-12"
          v-model="form.comment"
          :v="v$.form.comment"
          placeholder="Добавьте комментарий по процессу"
        />
        <Submit buttonClasses="btn-primary"> добавить </Submit>
      </FormGroup>
    </Form>
  </div>
</template>

<script>
import Submit from "../../../../form/Submit.vue";
import Textarea from "../../../../form/Textarea.vue";
import FormGroup from "../../../../form/FormGroup.vue";
import Form from "../../../../form/Form.vue";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { mapActions, mapGetters } from "vuex";
import "./styles.scss";

export default {
  name: "CallerForm",
  components: { Form, FormGroup, Textarea, Submit },
  props: {
    replyText: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      v$: useValidate(),
      form: {
        comment: null,
      },
    };
  },
  validations() {
    return {
      form: {
        comment: {
          required: helpers.withMessage("введите комментарий", required),
        },
      },
    };
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
  },
  methods: {
    ...mapActions([""]),
    async onSubmit(questionId, questionParent, companyId) {
      this.v$.$validate();
      if (this.v$.form.$error) {
        return;
      }
      this.loader = true;
      const comment = {
          company_id: companyId,
          question_id: questionId,
          question_parent: questionParent,
          title: this.THIS_USER.userProfile.short_name,
          comment: this.form.comment,
          type: 1,
        };
      let response = await this.POST_COMPANY_LOG(comment);
      if (response) {
        this.form.comment = null;
        this.v$.$reset();
      }
      this.loader = false;
      // if (await api.timeline.addActionComments(comments)) {
      //   this.$emit("commentAdded");
      //   this.form.comment = null;
      //   this.v$.$reset();
      //   this.scrollToFormDelay("#" + step.id);
      // }
      // this.loader = false;
      
    },
    cancelReply() {
      this.$emit("cancelReply");
    },
  },
};
</script>