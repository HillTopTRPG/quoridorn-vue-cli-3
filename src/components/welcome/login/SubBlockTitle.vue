<template>
  <div v-if="paramRoomName" class="subBlockTitle" :class="{isRoomExist: !isRoomExist}">
    <span class="icon-arrow-right"></span>
    <span v-if="isRoomExist">{{text}}</span>
    <a href="javascript:void(0);" @click="onClickLink" v-if="!isRoomExist">{{text}}</a>
  </div>
</template>

<script lang="ts">
  import { Getter } from "vuex-class";
  import { Component, Emit, Vue } from "vue-property-decorator";

@Component<SubBlockTitle>({
  name: "subBlockTitle",
  props: {
    text: {type: String, required: true},
  }
})
export default class SubBlockTitle extends Vue {
  @Getter("paramRoomName") paramRoomName: any;
  @Getter("isRoomExist") isRoomExist: any;
  @Emit("open") onClickLink(): void {}
}
</script>

<style scoped lang="scss">
.subBlockTitle {
  margin-top: 0.5em;
  margin-left: 3rem;
  font-weight: bold;
  color: black;

  &.isRoomExist {
    color: #3092F3;
  }
}
a {
  color: inherit;
}
</style>
