<template>
  <SelectBase defaultLabel="プレイヤー" v-model="localValue">
    <option v-for="player in playerList" :key="player.key" :value="player.key">{{player.name}}</option>
  </SelectBase>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

@Component<PlayerSelect>({
  name: "playerSelect",
  mixins: [SelectMixin],
  components: { SelectBase }
})
export default class PlayerSelect extends Vue {
  @Getter("playerList") playerList: any;
}
</script>
