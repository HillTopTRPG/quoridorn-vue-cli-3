<template>
  <div
    v-if="paramRoomName"
    class="subBlockTitle"
    :class="{ isRoomExist: !isRoomExist }"
  >
    <span class="icon-arrow-right"></span>
    <span v-if="isRoomExist">{{ text }}</span>
    <a href="javascript:void(0);" @click="onClickLink" v-if="!isRoomExist">
      {{ text }}
    </a>
  </div>
</template>

<script lang="ts">
import { Getter } from "vuex-class";
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component
export default class SubBlockTitle extends Vue {
  @Prop({ type: String, required: true })
  private text!: string;

  @Getter("paramRoomName") private paramRoomName: any;
  @Getter("isRoomExist") private isRoomExist: any;

  @Emit("open")
  onClickLink(): void {}
}
</script>

<style scoped lang="scss">
.subBlockTitle {
  margin-top: 0.5em;
  margin-left: 3rem;
  font-weight: bold;
  color: black;

  &.isRoomExist {
    color: #3092f3;
  }
}
a {
  color: inherit;
}
</style>
