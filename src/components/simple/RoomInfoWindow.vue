<template>
  <WindowFrame :titleText="`プレイルーム${roomName === '' ? '' : `「${roomName}」`}情報表示`" display-property="private.display.roomInfoWindow" align="center" fixSize="400, 310">
    <div class="container">
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
  </WindowFrame>
</template>

<script lang="ts">
import DiceBotSelect from "@/components/parts/select/DiceBotSelect.vue";
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Component, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<RoomInfoWindow>({
  name: "roomInfoWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    DiceBotSelect
  }
})
export default class RoomInfoWindow extends Vue {
  @Action("setProperty") setProperty: any;
  @Getter("roomName") roomName: any;
  @Getter("playerKey") playerKey: any;
  @Getter("playerList") playerList: any;
  @Getter("inviteUrl") inviteUrl: any;
  @Getter("roomSystem") roomSystem: any;

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
<style scoped>
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
