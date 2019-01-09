<template>
  <WindowFrame titleText="ユーザID選択画面" display-property="private.display.selectPeerWindow" align="center" fixSize="385, 300" :isBanClose="true">
    <div class="contents">
      <div>以下のルームメンバーが保存されていました。<br>あなたを選んでください。</div>
      <ul>
        <li v-for="member in members" :key="member.peerId"><label><input type="radio" name="peerId" :value="member.peerId" v-model="currentPeerId" />{{getObj(member.playerKey).name}}({{member.peerId}})</label></li>
      </ul>
      <div class="operateArea">
        <button @click="commit">決定</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import WindowFrame from "../WindowFrame";
import WindowMixin from "../WindowMixin";

export default {
  name: "selectPeerWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data() {
    return {
      currentPeerId: null
    };
  },
  methods: {
    ...mapActions(["windowClose", "setProperty", "createPeer", "windowOpen"]),
    commit() {
      qLog(this.currentPeerId);
      const currentMemberObj = this.currentMemberObj;
      if (!currentMemberObj) {
        alert("ルームメンバーからあなたを選んでください。");
        return;
      }
      qLog(currentMemberObj);
      const privateData = currentMemberObj.private;
      if (!privateData) {
        this.windowClose("private.display.selectPeerWindow");
        return;
      }
      this.setProperty({ property: `private`, value: privateData });

      const peerId = privateData.self.peerId;
      // TODO 引数修正
      this.createPeer({
        peerId: peerId,
        roomName: this.roomName
      });
      this.windowOpen("private.display.inviteLinkWindow");
      this.windowClose("private.display.selectPeerWindow");
    }
  },
  watch: {
    peerId(peerId) {
      this.currentPeerId = peerId;
    }
  },
  computed: mapState({
    ...mapGetters(["getObj", "peerId", "members", "roomName"]),
    currentMemberObj() {
      return this.members.filter(
        member => member.peerId === this.currentPeerId
      )[0];
    }
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 12px;
}
</style>
