<template>
  <WindowFrame :titleText="`プレイルーム${roomName === '' ? '' : `「${roomName}」`}情報表示`" display-property="private.display.roomInfoWindow" align="center" fixSize="400, 310">
    <div class="container">
      <div v-if="playerList.length === 0">お部屋に接続していません。</div>
      <div class="inviteUrlArea" v-if="playerList.length > 0">
        招待用URL：<input class="inviteUrl" type="text" readonly="readonly" :value="inviteUrl" />
      </div>
      <ul v-if="playerList.length > 0">
        <li v-for="(player, index) in playerList" :key="player.key">
          <b v-if="index === 0">[親]</b>
          <b v-if="player.key === playerKey">[あなた]</b>
          <span>{{player.name}}</span>
          <div class="returnUrlArea">復帰用URL：<input class="returnUrl" type="text" readonly="readonly" :value="createURL(player)"/></div>
        </li>
      </ul>
    </div>
  </WindowFrame>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import WindowFrame from "../WindowFrame";
import WindowMixin from "../WindowMixin";

export default {
  name: "roomInfoWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  methods: {
    createURL(player) {
      return `${this.inviteUrl}&playerName=${player.name}`;
    }
    // open () {
    //   setTimeout(function () {
    //     const elms = document.querySelectorAll('.returnUrl')
    //     elms.forEach((elm) => {
    //       elm.focus()
    //       elm.value += ''
    //       qLog(elm.value)
    //     })
    //   }, 100)
    // }
  },
  watch: {
    // playerList () {
    //   setTimeout(function () {
    //     const elms = document.querySelectorAll('.returnUrl')
    //     elms.forEach((elm) => {
    //       elm.focus()
    //       elm.value += ''
    //       qLog(elm.value)
    //     })
    //   }, 0)
    // }
  },
  computed: mapState({
    ...mapGetters(["roomName", "playerKey", "playerList", "inviteUrl"])
  })
};
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
  height: 227px;
}
li:not(:first-child) {
  margin-top: 8px;
}
</style>
