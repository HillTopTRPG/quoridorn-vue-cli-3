<template>
  <div class="loginContainer">
    <CreateRoomFromRoomData v-if="!isRoomExist"/>
    <CreateNewRoom/>
    <NonUseRoom/>
    <RoomInfo/>
  </div>
</template>

<script lang="ts">
import CreateRoomFromRoomData from "./CreateRoomFromRoomData.vue";
import CreateNewRoom from "./CreateNewRoom.vue";
import NonUseRoom from "./NonUseRoom.vue";
import RoomInfo from "./RoomInfo.vue";

import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component<Login>({
  name: "login",
  components: {
    CreateRoomFromRoomData,
    CreateNewRoom,
    NonUseRoom,
    RoomInfo
  }
})
export default class Login extends Vue {
  @Getter("isRoomExist") isRoomExist: any;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginContainer {
  border: 1px solid #777;
  background-color: white;
  padding: 0.5em;
}
fieldset:not(:first-child) {
  margin-top: 1em;
}
</style>
