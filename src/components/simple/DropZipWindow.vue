<template>
  <WindowFrame titleText="部屋データ読込" display-property="private.display.dropZipWindow" align="center" fixSize="385, 660">
    <div class="contents">
      <div v-if="!saveDataList">部屋データを読み込んでいます...</div>
      <div v-if="saveDataList">複数のセーブデータで同じ項目を読み込ませる場合、各セーブデータで順次上書きされていきます。</div>
      <fieldset v-for="(saveDataObj, index) in saveDataList" :key="index">
        <legend>{{saveDataObj.fileName}}</legend>
        <button @click="allSelect(index)">全て対象</button><button @click="allDisSelect(index)">全て除外</button>
        <div class="useCheckList">
          <label v-for="propObj in saveDataObj.useList" :key="propObj.label">
            <input type="checkbox" v-model="propObj.isUse" />
            {{propObj.label}}
          </label>
        </div>
      </fieldset>
      <div class="operateArea">
        <button @click="commit" :disabled="!saveDataList">決定</button>
        <button @click="cancel" :disabled="!saveDataList">キャンセル</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";

@Component<DropZipWindow>({
  name: "dropZipWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
})
export default class DropZipWindow extends Vue {
  @Action("windowClose") windowClose: any;
  @Action("windowOpen") windowOpen: any;
  @Action("doImport") doImport: any;
  @Getter("dropZipList") dropZipList: any;

  private saveDataList: any[] = [];

  commit(): void {
    // zipデータの配列のマージ先
    const importData: any = {
      publicData: null,
      delKeyList: [],
      addObjList: []
    };

    // zipデータをマージする
    // TODO とりあえず、インポートするデータの取捨選択は考慮しない（第一リリース仕様）
    this.dropZipList.forEach(
      ({ fileName, saveData }: { fileName: string; saveData: any }) => {
        const publicData: any = saveData.public;
        const dataVersion: string = saveData.dataVersion;
        const delKeyList: string[] = saveData.delKeyList;
        const addObjList: any[] = saveData.addObjList;

        // TODO セーブデータの互換性の処理

        // publicデータのマージ（先勝ち）
        if (!importData.publicData) {
          // TODO 本当はもっと細かい単位で処理したい
          importData.publicData = publicData;
        }

        // 削除リストのマージ
        delKeyList.forEach(delKey => {
          if (importData.delKeyList.indexOf(delKey) !== -1) return;
          importData.delKeyList.push(delKey);
        });

        // 追加リストのマージ
        addObjList.forEach(addObj => {
          const index = importData.addObjList.findIndex((impAddObj: any) => {
            return JSON.stringify(addObj) === JSON.stringify(impAddObj);
          });
          if (index !== -1) return;
          importData.addObjList.push(addObj);
        });
      }
    );
    this.doImport(importData);
    this.windowClose("private.display.dropZipWindow");
  }
  cancel(): void {
    this.windowClose("private.display.dropZipWindow");
  }
  allSelect(index: number): void {
    const useList: any[] = this.saveDataList[index].useList;
    useList.forEach((useObj, index: number) => {
      useObj.isUse = true;
      useList.splice(index, 1, useObj);
    });
  }
  allDisSelect(index: number): void {
    const useList: any[] = this.saveDataList[index].useList;
    useList.forEach((useObj, index: number) => {
      useObj.isUse = false;
      useList.splice(index, 1, useObj);
    });
  }

  @Watch("dropZipList")
  onChangeStoreZipList(dropZipList: any[]) {
    this.saveDataList = [];
    if (!dropZipList) {
      return;
    }
    dropZipList.forEach(saveDataObj => {
      const useList = [];
      const publicData = saveDataObj.saveData.public;
      if (publicData.setting) {
        useList.push({
          label: "設定情報(マス目表示、回転マーカーの表示など)",
          isUse: true,
          target: "setting"
        });
      }
      if (publicData.room) {
        useList.push({
          label: "部屋情報(継続卓なら必須)",
          isUse: true,
          target: "room"
        });
      }
      if (publicData.chat) {
        useList.push({
          label: "チャット履歴(部屋情報とセットで)",
          isUse: true,
          target: "chat"
        });
      }
      if (publicData.image) {
        useList.push({ label: "画像情報", isUse: true, target: "image" });
      }
      if (publicData.map) {
        useList.push({
          label: "マップ情報(画像情報とセットで)",
          isUse: true,
          target: "map"
        });
      }
      if (publicData.mapMask) {
        useList.push({
          label: "マップマスク情報",
          isUse: true,
          target: "mapMask"
        });
      }
      if (publicData.character) {
        useList.push({
          label: "キャラクター情報(画像情報とセットで)",
          isUse: true,
          target: "character"
        });
      }
      if (publicData.chit) {
        useList.push({
          label: "チット情報(画像情報とセットで)",
          isUse: true,
          target: "chit"
        });
      }
      if (publicData.publicMemo) {
        useList.push({
          label: "共有メモ",
          isUse: true,
          target: "publicMemo"
        });
      }
      this.saveDataList.push({
        fileName: saveDataObj.fileName,
        useList: useList,
        saveData: saveDataObj.saveData
      });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  font-size: 12px;
}
fieldset > div {
  display: grid;
  width: 100%;
  height: 100%;
  /*
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto 1fr auto auto;
  grid-template-areas:
      "viewImage passwordButton passwordButton"
      "viewImage passwordLabel  passwordLabel"
      "viewImage .............. .............."
      "tagLabel  tagLabel       tagLabel"
      "tagInput  tagInput       tagSelect";
  */
}
</style>
