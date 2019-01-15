<template>
  <fieldset class="root">
    <legend>部屋データから部屋を作る</legend>
    <div class="input-room-data">部屋データ：<button @click="chooseFile">ファイルを選択</button><span class="description">fileName</span></div>
    <div style="color: red; font-weight: bold;">この機能は未実装です。<br>入室後のセーブ機能も見直し中のため動きません。</div>
    <button type="button" @click="commit"><i class="icon-home3"></i> 作成</button>
  </fieldset>
</template>

<script lang="ts">
// import { Action } from "vuex-class";

import { Component, Vue, Watch } from "vue-property-decorator";

@Component<CreateRoomFromRoomData>({
  name: "createRoomFromRoomData"
})
export default class CreateRoomFromRoomData extends Vue {
  // @Action("setProperty") setProperty: any;
  // @Action("emptyMember") emptyMember: any;
  // @Action("windowClose") windowClose: any;
  // @Action("checkRoomName") checkRoomName: any;
  //
  // /*
  //  * data
  //  */
  // private roomName: string = "";

  chooseFile(): void {}

  /**
   * 確定ボタン押下時
   */
  commit(): void {
    // TODO
  }
}
</script>

<style scoped src="./login.css">
</style>

<style scoped>
fieldset.root,
fieldset.root > legend {
  background-color: #cee;
}
.input-room-data {
  display: flex;
}
.input-room-data > *:last-child {
  flex: 1;
}
.input-room-data > * {
  display: flex;
  /*justify-content: center;*/
  align-items: center;
  /*vertical-align: middle;*/
  /*text-align: left;*/
}
.description {
  padding-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
