<template>
  <window-frame
    titleText="部屋データ読込"
    display-property="private.display.dropZipWindow"
    align="center"
    fixSize="300, 100"
  >
    <div class="contents" @contextmenu.prevent>
      <div v-if="!saveDataList">部屋データを読み込んでいます...</div>
      <!-- TODO 初回リリース対応としては部分ロードはしない
      <div v-if="saveDataList">複数のセーブデータで同じ項目を読み込ませる場合、各セーブデータで順次上書きされていきます。</div>
      <fieldset v-for="(saveDataObj, index) in saveDataList" :key="index">
        <legend>{{saveDataObj.fileName}}</legend>
        <ctrl-ctrl-button @click="allSelect(index)">全て対象</button><ctrl-button @click="allDisSelect(index)">全て除外</ctrl-button>
        <div class="useCheckList">
          <label v-for="propObj in saveDataObj.useList" :key="propObj.label">
            <input type="checkbox" v-model="propObj.isUse" />
            {{propObj.label}}
          </label>
        </div>
      </fieldset>
      -->
      <div v-if="saveDataList">
        現段階では部分的ロードは行えません。<br />全てのデータをロードします。
      </div>
      <div class="operateArea">
        <ctrl-button @click="commit" :disabled="!saveDataList">
          決定
        </ctrl-button>
        <ctrl-button @click="cancel" :disabled="!saveDataList">
          キャンセル
        </ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import CtrlButton from "@/components/parts/CtrlButton.vue";
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class DropZipWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowClose") private windowClose: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("doImport") private doImport: any;
  @Getter("dropZipList") private dropZipList: any;
  @Getter("dropZipRoomCreate") private dropZipRoomCreate: any;

  private saveDataList: any[] = [];

  commit(): void {
    // zipデータの配列のマージ先
    const importData: any = {
      publicData: null,
      delKeyList: [],
      addObjList: [],
      dropZipRoomCreate: this.dropZipRoomCreate
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

<style scoped lang="scss">
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
}
</style>
