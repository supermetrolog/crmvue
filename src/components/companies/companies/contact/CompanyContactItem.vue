<template>
  <div class="row item active py-2 mb-2">
    <div class="col-12 text-center">
      <div class="header row mb-2">
        <div class="index col text-left">
          <small class="bg-success py-1 px-2 text-light">{{ idx + 1 }}</small>
        </div>
        <div class="actions col text-primary text-right">
          <i class="fas fa-thumbtack mr-2"></i>
          <i class="fas fa-pen"></i>
        </div>
      </div>
      <div class="name">
        <strong> Анатолий Валерьевич </strong>
      </div>
      <div class="body">
        <small class="d-block text-grey"> телефон </small>
        <div class="phone-list">
          <a href="tel:+7 (960) 545-77-88" class="d-block"
            >+7 (960) 545-77-88</a
          >
          <a href="tel:+7 (960) 545-77-88" class="d-block"
            >+7 (960) 545-77-88</a
          >
          <a href="tel:+7 (960) 545-77-88" class="d-block"
            >+7 (960) 545-77-88</a
          >
        </div>
        <small class="d-block text-grey"> почта </small>

        <div class="email-list">
          <a href="mailto:fuck@gmail.com" class="d-block">fuck@gmail.com</a>
        </div>
        <i
          class="far fa-arrow-alt-circle-down d-block open-extra-info mt-1"
          @click="openExtraInfo"
          v-if="!extraInfoVisible"
          title="Комментарии"
        ></i>
        <i
          class="far fa-arrow-alt-circle-up d-block open-extra-info mt-1"
          @click="closeExtraInfo"
          v-if="extraInfoVisible"
        ></i>
        <hr />
        <div class="extra-info row" v-if="extraInfoVisible">
          <div class="col-12 comment-list text-left">
            <div class="comment">
              <strong>Алексей В. В.</strong>
              <p class="text-dark">Не занимается землей</p>
              <small class="text-grey">20.01.2021 16:32:21</small>
            </div>
            <div class="comment">
              <strong>Винидикт А. В.</strong>
              <p class="text-dark">Пидрила та еще</p>
              <small class="text-grey">20.01.2021 16:32:21</small>
            </div>
            <div class="comment">
              <strong>Максим А. А.</strong>
              <p class="text-dark">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
                iste?
              </p>
              <small class="text-grey">20.01.2021 16:32:21</small>
            </div>
          </div>
          <div class="col-12 mt-2">
            <hr />
            <textarea v-model="comment"></textarea>
            <button class="btn btn-primary btn-large">Отправить</button>
          </div>
        </div>
      </div>
      <div class="footer row mt-1">
        <div class="col-12 consultant text-left">
          <p>ведет: {{ contact.consultant.username }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyContactItem",
  data() {
    return {
      extraInfoVisible: false,
      comment: "",
    };
  },
  props: {
    contact: {
      type: Object,
    },
    idx: {
      type: Number,
    },
  },
  computed: {},
  methods: {
    openExtraInfo() {
      this.extraInfoVisible = true;
    },
    closeExtraInfo() {
      this.extraInfoVisible = false;
    },
  },
};
</script>

<style>
</style>