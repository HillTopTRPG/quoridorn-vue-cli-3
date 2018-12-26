<template>
  <div class="loginContainer">
    <CreateRoomFromRoomData/>
    <CreateNewRoom/>
    <NonUseRoom/>
  </div>
</template>

<script>
import CreateRoomFromRoomData from "./CreateRoomFromRoomData.vue";
import CreateNewRoom from "./CreateNewRoom.vue";
import NonUseRoom from "./NonUseRoom.vue";
export default {
  components: {
    CreateRoomFromRoomData,
    CreateNewRoom,
    NonUseRoom
  }
};
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
