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
                <Form v-if="step.id == timelineStep.id" ref="form" class="mb-3">
                  <FormGroup>
                    <Textarea class="col-12" />
                    <Submit
                      class="col-12 mt-1"
                      buttonClasses="btn-primary"
                      :disabled="disabled"
                    >
                      добавить
                    </Submit>
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
      timelineStepOptions: Timeline.get("param"),
      stepComment: null,
      saveCommentBtnVisible: false,
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
    ...mapGetters(["TIMELINE_COMMENTS", "TIMELINE"]),
  },
  methods: {
    inputComment() {
      if (this.step.comment != this.stepComment) {
        this.saveCommentBtnVisible = true;
      } else {
        this.saveCommentBtnVisible = false;
      }
    },
    scrollToForm() {
      let options = {
        behavior: "smooth",
        block: "center",
      };
      this.$refs.form.$el.scrollIntoView(options);
    },
  },
  mounted() {
    this.stepComment = this.step.comment;
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