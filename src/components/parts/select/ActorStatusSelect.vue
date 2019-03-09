<template>
  <select-base defaultLabel="状態" v-model="localValue">
    <option v-for="status in statusList" :key="status.name" :value="status.name">{{status.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Component, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component<ActorStatusSelect>({
  name: "actorStatusSelect",
  mixins: [SelectMixin],
  components: { SelectBase }
})
export default class ActorStatusSelect extends Vue {
  @Prop({ type: String, required: true })
  private actorKey!: string;

  @Getter("getObj") getObj: any;

  private get statusList(): any[] {
    const actor = this.getObj(this.actorKey);
    return actor ? actor.statusList : [];
  }
}
</script>
