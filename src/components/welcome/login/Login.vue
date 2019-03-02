<template>
  <div class="loginContainer">
    <create-room-from-room-data v-if="!isRoomExist && !isRoomJoined"/>
    <create-new-room v-if="!isRoomJoined"/>
    <room-info v-if="isRoomJoined"/>
    <player-info v-if="isRoomJoined"/>
  </div>
</template>

<script lang="ts">
import CreateRoomFromRoomData from "./CreateRoomFromRoomData.vue";
import CreateNewRoom from "./CreateNewRoom.vue";
import RoomInfo from "./RoomInfo.vue";
import PlayerInfo from "./PlayerInfo.vue";

import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component<Login>({
  name: "login",
  components: {
    CreateRoomFromRoomData,
    CreateNewRoom,
    RoomInfo,
    PlayerInfo
  }
})
export default class Login extends Vue {
  @Getter("isRoomExist") isRoomExist: any;
  @Getter("isRoomJoined") isRoomJoined: any;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginContainer {
  border: 1px solid #777;
  background-color: white;
  padding: 0.5em;
  flex: 1;
}
fieldset:not(:first-child) {
  margin-top: 1em;
}
</style>
