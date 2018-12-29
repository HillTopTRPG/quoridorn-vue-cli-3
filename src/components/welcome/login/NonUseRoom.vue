<template>
  <fieldset class="root">
    <legend>部屋をつくらずQuoridornをつかう</legend>
    <div class="description">
      卓でつかうデータの作成・保存ができます。<br>
      通信する機能、ルームメンバーが必要な機能は利用できません。
    </div>
    <button type="button" @click="commit"><i class="icon-home3"></i> つかう</button>
  </fieldset>
</template>

<script lang="ts">
// import { Action } from "vuex-class";

import { Component, Vue, Watch } from "vue-property-decorator";

@Component<NonUseRoom>({
  name: "nonUseRoom"
})
export default class NonUseRoom extends Vue {
  // @Action("setProperty") setProperty: any;
  // @Action("emptyMember") emptyMember: any;
  // @Action("createPeer") createPeer: any;
  // @Action("windowClose") windowClose: any;
  // @Action("checkRoomName") checkRoomName: any;
  //
  // /*
  //  * data
  //  */
  // private roomName: string = "";

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
  background-color: #eec;
}
.description {
  text-align: left;
}
</style>
