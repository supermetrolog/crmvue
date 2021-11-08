<template>
  <div class="file-input">
    <div class="file-input_container">
      <div class="file-input_btn">
        <button @click.prevent="clickOpenFile" class="primary">
          <slot></slot>
        </button>
        <input
          type="file"
          ref="fileInput"
          :multiple="multiple"
          :accept="accept"
          @change.stop="onChange($event)"
        />
      </div>
      <div class="row no-gutters file-input_files existing" v-if="files.length">
        <div class="col-3 file" v-for="(file, index) in files" :key="index">
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
              <div class="delete-container">
                <i class="fas fa-times" @click="deleteFile(index)"></i>
              </div>
            </div>
            <div class="col-12 file_description text-center">
              <p>{{ file.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="row no-gutters file-input_files target"
        v-if="localFiles.length"
      >
        <div
          class="col-3 file"
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
      files: this.alreadyExistingFiles, //Уже существующие файлы
      allowedTypeList: ["pdf", "excel", "word", "ppoint", "unknown"],
    };
  },
  props: {
    multiple: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: String,
      default: ".*",
    },
    alreadyExistingFiles: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    clickOpenFile() {
      console.log(this.files);
      this.$refs.fileInput.click();
    },
    formatSize(length) {
      let i = 0,
        type = ["б", "Кб", "Мб", "Гб", "Тб", "Пб"];
      while ((length / 1000) | 0 && i < type.length - 1) {
        length /= 1024;
        i++;
      }
      return length.toFixed(2) + " " + type[i];
    },
    deleteFile(index) {
      this.files = this.files.filter((_, idx) => idx != index);
    },
    onChange(event) {
      this.localFiles = [];
      this.targetFiles = event.target.files;
      const files = Array.from(event.target.files);

      if (!files.length) {
        console.error(event);
        return;
      }
      console.log(event);
      // this.$emit("change", this.localFiles, this.targetFiles);

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
  },
  watch: {
    localFiles: {
      handler() {
        this.$emit("change", this.files, this.targetFiles);
      },
      deep: true,
    },
    alreadyExistingFiles() {
      if (!this.files.length) {
        this.files = this.alreadyExistingFiles;
      }
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
      padding: 8px 20px;
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
        border: 1px solid $color_primary;
        color: white;
        background-color: $color_primary;
      }
    }
  }

  &_files {
    &.target {
      color: $color_success;
      .file {
        &_description {
          background-color: darken($color_dark, 10);
        }
      }
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
            padding: 5px;
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
          // font-size: 11;
        }
      }
    }
  }
}
</style>