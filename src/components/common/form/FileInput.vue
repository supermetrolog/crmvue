<template>
  <div class="form-item file-input">
    <div class="file-input_container">
      <div class="row" v-if="!reedOnly">
        <div class="col-12">
          <label class="form-item-label" :class="{ required: required }">
            {{ label }}
            <div class="file-input_btn">
              <button @click.prevent="clickOpenFile" class="primary btn-large">
                <slot></slot>
              </button>
              <input
                type="file"
                ref="fileInput"
                :multiple="multiple"
                :accept="accept"
                @change.stop="onChange"
              />
            </div>
          </label>
        </div>
      </div>
      <template v-if="multiple">
        <div
          class="row no-gutters file-input_files existing"
          v-if="files.length"
        >
          <div
            class="col-3 file ml-auto"
            v-for="(file, index) in files"
            :key="index"
          >
            <div class="row no-gutters">
              <div
                class="
                  col-12
                  file_image
                  d-flex
                  align-self-center
                  justify-content-center
                "
              >
                <a
                  :href="file.src"
                  target="_blank"
                  :title="file.name"
                  class="d-flex align-self-center justify-content-center"
                >
                  <img
                    :src="require(`@/assets/image/${file.src2}.png`)"
                    alt="file"
                    :class="file.src2"
                    :title="file.name"
                    v-if="allowedTypeList.includes(file.src2)"
                  />
                  <img :src="file.src2" alt="file" class="image" v-else />
                </a>

                <div class="size-container text-right">
                  <p>{{ formatSize(file.size) }}</p>
                </div>
                <div class="delete-container" v-if="!reedOnly">
                  <i class="fas fa-times" @click="deleteFile(index)"></i>
                </div>
              </div>
              <div class="col-12 file_description text-center">
                <p>{{ file.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="!multiple && files">
        <div class="row no-gutters file-input_files existing">
          <div class="col-12 file ml-auto">
            <div class="row no-gutters">
              <div
                class="
                  col-12
                  file_image
                  single
                  d-flex
                  align-self-center
                  justify-content-center
                "
              >
                <a
                  :href="files"
                  target="_blank"
                  class="d-flex align-self-center justify-content-center"
                >
                  <img
                    :src="'http://crmka/uploads/' + files"
                    alt="file"
                    class="image"
                  />
                </a>
                <div class="delete-container" v-if="!reedOnly">
                  <i class="fas fa-times" @click="deleteFile(index)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- <template v-else>
        <div class="row" v-if="files">
          <img :src="files" alt="img" />
        </div>
      </template> -->
      <div
        class="row no-gutters file-input_files target"
        v-if="localFiles.length"
      >
        <div
          class="col-3 file"
          :class="{ 'col-12': !multiple }"
          v-for="(file, index) in localFiles"
          :key="index"
        >
          <div class="row no-gutters">
            <div
              class="
                col-12
                file_image
                d-flex
                align-self-center
                justify-content-center
              "
              :class="{ single: !multiple }"
            >
              <img
                :src="require(`@/assets/image/${file.src}.png`)"
                alt="file"
                :class="file.src"
                :title="file.name"
                v-if="allowedTypeList.includes(file.src)"
              />
              <img :src="file.src" alt="file" class="image" v-else />
              <div class="size-container text-right">
                <p>{{ formatSize(file.size) }}</p>
              </div>
            </div>
            <div class="col-12 file_description text-center">
              <p>{{ file.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function getFileType(file) {
  if (file.name.match(".pdf")) return "pdf";
  else if (file.name.match(".xls")) return "excel";
  else if (file.name.match(".doc")) return "word";
  else if (file.name.match(".ppt")) return "ppoint";
  else return "unknown";
}
export default {
  name: "FileInput",
  data() {
    return {
      localFiles: [], //Выбранные файлы в инпуте (нужен для отображения)
      targetFiles: [], //Выбранные файлы в интпуте
      files: this.data, //Уже существующие файлы
      allowedTypeList: ["pdf", "excel", "word", "ppoint", "unknown"],
    };
  },
  props: {
    data: {
      type: [Array, String],
      default: () => [],
    },
    native: {
      type: [Array, FileList],
      default: () => [],
    },
    label: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: String,
      default: ".*",
    },
    reedOnly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickOpenFile() {
      this.$refs.fileInput.click();
    },
    formatSize(length) {
      length = +length;
      let i = 0,
        type = ["б", "Кб", "Мб", "Гб", "Тб", "Пб"];
      while ((length / 1000) | 0 && i < type.length - 1) {
        length /= 1024;
        i++;
      }
      return length.toFixed(2) + " " + type[i];
    },
    deleteFile(index) {
      if (!this.multiple) {
        this.files = null;
      } else {
        this.files = this.files.filter((_, idx) => idx != index);
      }
      this.$emit("update:data", this.files);
      console.log(this.data, this.files);
    },
    onChange($event) {
      this.localFiles = [];
      this.targetFiles = $event.target.files;
      const files = Array.from($event.target.files);

      if (!files.length) {
        return;
      }
      if (!this.multiple) {
        this.files = null;
      }
      this.$emit("update:native", $event.target.files);
      this.$emit("update:data", this.files);
      this.setSrc(files);
    },
    setSrc(files) {
      files.map((file) => {
        if (file.type.match("image")) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            file.src = ev.target.result;

            this.localFiles.push(file);
          };
          reader.readAsDataURL(file);

          return file;
        } else if (file.type.match("application")) {
          file.src = getFileType(file);
          this.localFiles.push(file);

          return file;
        } else {
          file.src = "unknown";
          this.localFiles.push(file);

          return file;
        }
      });
    },
    setSrcForExistionFiles() {
      if (!this.multiple) {
        this.files = this.data;
        return;
      }
      if (!this.files.length) {
        return false;
      }
      this.files.map((file) => {
        if (file.type.match("image")) {
          file.src2 = file.src;
          return file;
        } else if (file.type.match("application")) {
          file.src2 = getFileType(file);
          return file;
        } else {
          file.src2 = "unknown";
          return file;
        }
      });
    },
  },
  mounted() {
    this.setSrcForExistionFiles();
  },
  watch: {
    // localFiles: {
    //   handler() {
    //     this.$emit("change", this.files, this.targetFiles);
    //   },
    //   deep: true,
    // },
    data() {
      this.files = this.data;
      this.setSrcForExistionFiles();
    },
  },
};
</script>

<style lang="scss" scoped>
$color_primary: #11698e;
$color_dark: #2d2f34;
$color_danger: #f93154;
$color_success: #00b74a;

.file-input {
  width: 100%;
  &_btn {
    input {
      display: none;
    }
    button {
      padding: 10px 20px;
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid grey;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        box-shadow: 0 5px 5px rgba($color: #000000, $alpha: 0.5);
      }
      &.primary {
        border: 2px dashed $color_primary;
        color: $color_primary;
        // background-color: $color_primary;
      }
    }
  }

  &_files {
    &.target {
      color: $color_success;
    }
    .file {
      padding: 5px 1px 5px 1px;
      &_image {
        min-height: 74px;
        height: 74px;
        max-height: 74px;
        overflow: hidden;
        background-color: $color_dark;
        position: relative;
        a {
          display: inline;
        }
        &.single {
          height: 100%;
          max-height: unset;
        }
        .size-container,
        .delete-container {
          opacity: 0;
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 0 1px;
          background-color: rgba($color: #fff, $alpha: 0.8);
          p {
            font-size: 12px;
          }
          transition: all 0.1s ease-in-out;
        }
        .delete-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2px;
          width: 18px;
          height: 18px;
          top: 0;
          bottom: unset;
          right: 0;
          i {
            cursor: pointer;
            color: $color_danger;
          }
        }
        &:hover {
          .size-container,
          .delete-container {
            opacity: 1;
          }
        }
        img {
          position: relative;
          max-height: 100%;
          margin: auto;
          &.image {
            padding: 2px;
          }
          &.pdf {
            max-width: 75%;
          }
        }
      }
      &_description {
        max-height: 100px;
        overflow: hidden;
        padding: 0 2.5px;
        p {
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>