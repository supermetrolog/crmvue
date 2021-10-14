<template>
  <div class="reminders">
    <ul class="reminders-list scroller">
      <li>
        <div class="row no-gutters reminders-list-item">
          <div class="col-12">
            <i class="far fa-clock d-inline-block mr-2"></i>
            <span class="d-inline-block">24 сен. 2021 13:21</span>
          </div>
          <div class="col-12">
            <a href="" title="посмотреть в календаре">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              temporibus aut? Nam vel tempora fuga?
            </a>
          </div>
        </div>
      </li>
      <li>
        <div class="row no-gutters reminders-list-item">
          <div class="col-12">
            <i class="far fa-clock d-inline-block mr-2"></i>
            <span class="d-inline-block">24 сен. 2021 13:21</span>
          </div>
          <div class="col-12">
            <a href="" title="посмотреть в календаре">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              temporibus aut? Nam vel tempora fuga?
            </a>
          </div>
        </div>
      </li>
      <li>
        <div class="row no-gutters reminders-list-item">
          <div class="col-12">
            <i class="far fa-clock d-inline-block mr-2"></i>
            <span class="d-inline-block">24 сен. 2021 13:21</span>
          </div>
          <div class="col-12">
            <a href="" title="посмотреть в календаре">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              temporibus aut? Nam vel tempora fuga?
            </a>
          </div>
        </div>
      </li>
      <li>
        <div class="row no-gutters reminders-list-item">
          <div class="col-12">
            <i class="far fa-clock d-inline-block mr-2"></i>
            <span class="d-inline-block">24 сен. 2021 13:21</span>
          </div>
          <div class="col-12">
            <a href="" title="посмотреть в календаре">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              temporibus aut? Nam vel tempora fuga?
            </a>
          </div>
        </div>
      </li>
      <li>
        <div class="row no-gutters reminders-list-item">
          <div class="col-12">
            <i class="far fa-clock d-inline-block mr-2"></i>
            <span class="d-inline-block">24 сен. 2021 13:21</span>
          </div>
          <div class="col-12">
            <a href="" title="посмотреть в календаре">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
              temporibus aut? Nam vel tempora fuga?
            </a>
          </div>
        </div>
      </li>
    </ul>

    <div class="reminders-add py-2">
      <form @submit.prevent="submitForm">
        <div class="row no-gutters">
          <div class="col-12 text-center">
            <small class="text-grey"> добавить напоминание </small>
          </div>
          <div class="col-6 pr-1">
            <input
              type="datetime-local"
              class="btn-datetime"
              v-model="form.deadline_datetime"
            />
          </div>
          <div class="col-6 pl-1">
            <input
              type="text"
              placeholder="введите текст"
              v-model="form.text"
            />
          </div>

          <div
            class="col-12 mx-auto mt-2"
            v-if="form.text && form.deadline_datetime"
          >
            <button class="btn btn-primary btn-large">добавить</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Reminders",
  data() {
    return {
      form: {
        text: null,
        deadline_datetime: null,
      },
    };
  },
  props: {
    data: {
      type: Object,
    },
  },
};
</script>

<style>
</style>