<template>
  <div class="extra-block">
    <div class="row no-gutters scroller">
      <div class="col-12">
        <div class="row no-gutters">
          <div class="col-12">
            <Accordion>
              <AccordionItem
                v-for="timelineStep in TIMELINE.timelineSteps"
                :key="timelineStep.id"
                :title="
                  timelineStepOptions[timelineStep.number][1].name +
                  ` (${timelineStep.timelineActionComments.length})`
                "
                :titleClasses="titleClasses(timelineStep)"
                :openByDefault="this.currentTimelineStepId == timelineStep.id"
                @onOpen="openAccordionItem(timelineStep.id)"
              >
                <Comments :data="timelineStep.timelineActionComments" />
                <Form
                  v-if="this.currentTimelineStepId == timelineStep.id"
                  ref="form"
                  class="mb-3 p-2"
                  @submit="onSubmit(step)"
                >
                  <FormGroup>
                    <Textarea
                      class="col-12"
                      v-model="form.comment"
                      :v="v$.form.comment"
                      placeholder="Добавьте комментарий по процессу"
                    />
                    <Submit
                      class="mt-1"
                      buttonClasses="btn-primary"
                      :disabled="disabled"
                      v-if="!loader"
                    >
                      добавить
                    </Submit>
                    <div class="col-12 mt-4" v-if="loader">
                      <Loader class="center small py-2 no-absolute" />
                    </div>
                  </FormGroup>
                </Form>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Timeline } from "@/const/Const";
import Form from "@/components/common/form/Form";
import Textarea from "@/components/common/form/Textarea";
import Submit from "@/components/common/form/Submit";
import FormGroup from "@/components/common/form/FormGroup";
import Accordion from "@/components/common/accordion/Accordion";
import AccordionItem from "@/components/common/accordion/AccordionItem";
import Comments from "./Comments.vue";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import api from "@/api/api";
export default {
  name: "ExtraBlock",
  components: {
    Form,
    Textarea,
    Submit,
    FormGroup,
    Accordion,
    AccordionItem,
    Comments,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      timelineStepOptions: Timeline.get("param"),
      form: {
        comment: null,
      },
      currentTimelineStepId: this.step.id,
    };
  },
  props: {
    step: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["TIMELINE_COMMENTS", "TIMELINE", "THIS_USER"]),
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
  methods: {
    titleClasses(step) {
      if (step.status == 1) {
        return "badge-success";
      }
      return "badge-warning";
    },
    scrollToForm() {
      let options = {
        behavior: "smooth",
        block: "end",
        alignToTop: false,
      };
      console.warn(this.$refs.form);
      this.$refs.form[0].$el.scrollIntoView(options);
    },
    async onSubmit(step) {
      this.v$.$validate();
      if (this.v$.form.$error) {
        return;
      }
      this.loader = true;
      const comments = [
        {
          timeline_id: step.timeline_id,
          timeline_step_id: step.id,
          timeline_step_number: step.number,
          title: this.THIS_USER.userProfile.short_name,
          comment: this.form.comment,
          type: 3,
        },
      ];
      if (await api.timeline.addActionComments(comments)) {
        this.$emit("commentAdded");
        this.form.comment = null;
        this.v$.$reset();
      }
      this.loader = false;
    },

    openAccordionItem(id) {
      if (this.currentTimelineStepId == id) {
        this.currentTimelineStepId = null;
        return;
      }
      this.currentTimelineStepId = id;
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => this.scrollToForm(), 500); //Из за анимации нужно подождать 500 мс чтобы элемент появился
    });
  },
  watch: {
    step() {
      this.currentTimelineStepId = this.step.id;
    },
    currentTimelineStepId() {
      setTimeout(() => this.scrollToForm(), 300);
    },
  },
};
</script>

<style>
</style>