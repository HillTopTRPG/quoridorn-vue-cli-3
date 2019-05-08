<template>
  <select-base
    defaultLabel="プレイヤー"
    v-model="localValue"
    :optionValueList="optionValueStrList"
  >
    <option v-for="player in playerList" :key="player.key" :value="player.key">{{player.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.ts";
import SelectBase from "./base/SelectBase.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class PlayerSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("playerList") private playerList: any;

  protected get optionValueStrList(): string[] {
    return this.playerList.map(player => player.key);
  }
}
</script>
