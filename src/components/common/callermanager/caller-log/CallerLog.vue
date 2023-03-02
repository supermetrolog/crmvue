<template>
  <div class="CallerLog">
    <Accordion>
      <AccordionItem
        v-for="questionBranch in questionsTree"
        :key="questionBranch.id"
        :id="questionBranch.id"
        :title="questionBranch.name"
      >
        <div class="CallerLog-section">
          <CallerQuestions
            :questionsList="questionBranch.questionsList"
            :sectionId="questionBranch.id"
            @questionClicked="onQuestionClicked"
          />
          <div class="CallerLog-chat">
            <ChatList
              @infinite="load"
              @chatMounted="refreshChat"
              :items="COMPANY_LOGS"
              :itemsCount="COMPANY_LOGS_COUNT"
              :key="company.id"
            />
          </div>
          <CallerForm
            :replyItem="replyItem"
            @cancelReply="onCancelReply"
          />
        </div>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script>
import CallerQuestions from "./components/caller-questions/CallerQuestions.vue";
import CallerForm from "./components/caller-form/CallerForm.vue";
import { mapActions, mapGetters } from "vuex";
import ChatList from "../../chat/chat-list/ChatList.vue";
import AccordionItem from "../../accordion/AccordionItem.vue";
import Accordion from "../../accordion/Accordion.vue";
import {questions} from '../const/questions';
import "./styles.scss";

export default {
  name: "CallerLog",
  components: {
    Accordion,
    AccordionItem,
    ChatList,
    CallerQuestions,
    CallerForm,
  },
  props: {
    call: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      questionsTree: questions,
      replyItem: null,
    };
  },
  provide: {
    questionsTree: questions
  },
  computed: {
    ...mapGetters(["THIS_USER", "COMPANY_LOGS", "COMPANY_LOGS_COUNT"]),
    company() {
      let company =
        this.call.phoneFrom?.contact.company ||
        this.call.phoneTo?.contact.company;
      return company;
    },
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_LOGS", "REFRESH_COMPANY_LOGS"]),
    async load($state, id = this.company.id) {
      console.log("loading more...", id);
      try {
        const response = await this.FETCH_COMPANY_LOGS(id);
        if (response === "complete") {
          $state.complete();
        }
        if (response === "loaded") {
          $state.loaded();
        }
      } catch (error) {
        $state.error();
      }
    },
    onQuestionClicked(questionId, questionBranchId) {
      this.replyItem = {
        id: questionId,
        parentId: questionBranchId,
        body: this.questionsTree
        .find((item) => item.id == questionBranchId)
        .questionsList.find((item) => item.id == questionId).body
      }
    },
    onCancelReply() {
      console.log(123);
      this.replyItem = null;
    },
    refreshChat() {
      this.REFRESH_COMPANY_LOGS();
      this.replyItem = null;
    },
  },
};
</script>