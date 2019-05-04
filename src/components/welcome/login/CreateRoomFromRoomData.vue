<template>
  <fieldset class="root">
    <legend>部屋データから部屋を作る</legend>
    <div class="input-room-data">部屋データ：<ctrl-button @click="chooseFile">ファイルを選択</ctrl-button>
      <div class="description">
        {{files.length ? "" : "未選択"}}
        <span v-for="file in files" :key="file.name">{{file.name}}</span>
      </div>
    </div>
    <input ref="fileChooser" type="file" style="display: none;" accept=".zip" multiple @change="event => selectFile(event)">
    <ctrl-button @click="commit"><i class="icon-home3"></i> 作成</ctrl-button>
  </fieldset>
</template>

<script lang="ts">
import CtrlButton from "@/components/parts/CtrlButton.vue";
import { Component, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({ components: { CtrlButton } })
export default class CreateRoomFromRoomData extends Vue {
  @Action("importStart") private importStart: any;

  private files: File[] = [];

  chooseFile(this: any): void {
    const fileChooser: HTMLElement = this.$refs.fileChooser;
    fileChooser.click();
  }

  selectFile(event: any) {
    if (event.target.files.length === 0) return;
    this.files = [];
    Array.prototype.push.apply(this.files, event.target.files);
  }

  /**
   * 確定ボタン押下時
   */
  commit(): void {
    if (!this.files.length) {
      alert("ファイルを選択してください。");
      return;
    }
    this.importStart({ zipFiles: this.files, isRoomCreate: true });
  }
}
</script>

<style scoped src="./login.css">
</style>

<style scoped lang="scss">
fieldset.root,
fieldset.root > legend {
  background-color: #cceeee;
}

.input-room-data {
  display: flex;

  > * {
    display: flex;
    align-items: center;

    &:last-child {
      flex: 1;
    }
  }
}

.description {
  padding-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
</style>
