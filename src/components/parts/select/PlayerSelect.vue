<template>
  <select-base defaultLabel="プレイヤー" v-model="localValue">
    <option v-for="player in playerList" :key="player.key" :value="player.key">{{player.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class PlayerSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("playerList") private playerList: any;
}
</script>
