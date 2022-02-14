<template>
  <div class="extra-block">
    <div class="row no-gutters inner scroller">
      <div class="col-12 mt-4">
        <div class="row no-gutters">
          <div class="col-12">
            <h4 class="mt-0 mb-1 text-center">Комментарии</h4>
            <Accordion>
              <AccordionItem
                v-for="timelineStep in TIMELINE.timelineSteps"
                :key="timelineStep.id"
                :title="timelineStepOptions[timelineStep.number][1].name"
                :titleClasses="
                  'badge-' + timelineStepOptions[timelineStep.number][1].class
                "
                :openByDefault="step.id == timelineStep.id"
                :disabled="step.id == timelineStep.id"
              >
                <Comments :data="timelineStep.timelineActionComments" />
                <Form
                  v-if="step.id == timelineStep.id"
                  ref="form"
                  class="mb-3"
                  @submit="onSubmit(step)"
                >
                  <FormGroup>
                    <Textarea class="col-12" v-model="comment" />
                    <Submit
                      class="col-12 mt-1"
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
import Form from "@/components/form/Form";
import Textarea from "@/components/form/Textarea";
import Submit from "@/components/form/Submit";
import FormGroup from "@/components/form/FormGroup";
import Accordion from "@/components/accordion/Accordion";
import AccordionItem from "@/components/accordion/AccordionItem";
import Comments from "./Comments.vue";
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
      loader: false,
      timelineStepOptions: Timeline.get("param"),
      comment: null,
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
  methods: {
    scrollToForm() {
      let options = {
        behavior: "smooth",
        block: "center",
      };
      this.$refs.form.$el.scrollIntoView(options);
    },
    onSubmit(step) {
      this.loader = true;
      step.newActionComments = [
        {
          timeline_id: step.timeline_id,
          timeline_step_id: step.id,
          timeline_step_number: step.number,
          title: this.THIS_USER.userProfile.short_name,
          comment: this.comment,
          type: 3,
        },
      ];
      this.$emit("createComment", step, false, () => (this.loader = false));
      this.comment = null;
    },
  },
  mounted() {
    setTimeout(() => this.scrollToForm(), 300); //Из за анимации нужно подождать 500 мс чтобы элемент появился
  },
  watch: {
    step() {
      setTimeout(() => this.scrollToForm(), 300);
    },
  },
};
</script>

<style>
</style>