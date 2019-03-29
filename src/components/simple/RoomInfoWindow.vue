<template>
  <window-frame :titleText="`プレイルーム${roomName === '' ? '' : `「${roomName}」`}情報表示`" display-property="private.display.roomInfoWindow" align="center" fixSize="400, 310">
    <div class="container" @contextmenu.prevent>
      <div v-if="playerList.length === 0">お部屋に接続していません。</div>
      <div class="inviteUrlArea" v-if="playerList.length > 0">
        招待用URL：<input class="inviteUrl" type="text" readonly="readonly" :value="inviteUrl" />
      </div>
      <ul v-if="playerList.length > 0">
        <li v-for="player in playerList" :key="player.key">
          <b v-if="player.key === playerKey">[あなた]</b>
          <span>{{player.name}}</span>
          <div class="returnUrlArea">復帰用URL：<input class="returnUrl" type="text" readonly="readonly" :value="createURL(player)"/></div>
        </li>
      </ul>

      <!-- ダイスボット選択 -->
      <label>
        部屋のダイスボット：
        <dice-bot-select ref="diceBot" v-model="currentDiceBotSystem" class="diceBotSystem"/>
      </label>

      <div style="margin-top: 20px;">内容はもっと増やします！</div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import DiceBotSelect from "@/components/parts/select/DiceBotSelect.vue";
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    WindowFrame,
    DiceBotSelect
  }
})
export default class RoomInfoWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("setProperty") private setProperty: any;
  @Getter("roomName") private roomName: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("playerList") private playerList: any;
  @Getter("inviteUrl") private inviteUrl: any;
  @Getter("roomSystem") private roomSystem: any;

  get currentDiceBotSystem(): string {
    return this.roomSystem;
  }

  set currentDiceBotSystem(currentDiceBotSystem: string) {
    this.setProperty({
      property: `public.room.system`,
      value: currentDiceBotSystem,
      isNotice: true,
      logOff: true
    });
  }

  createURL(player: any) {
    return `${this.inviteUrl}&playerName=${player.name}`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 12px;
}
.inviteUrlArea {
  display: flex;
}
.inviteUrl {
  flex: 1;
}
.returnUrlArea {
  display: flex;
}
.returnUrl {
  flex: 1;
  text-align: right;
}
ul {
  overflow-y: auto;
  padding-left: 20px;
}
li:not(:first-child) {
  margin-top: 8px;
}
</style>
