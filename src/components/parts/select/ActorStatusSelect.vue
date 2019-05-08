<template>
  <select-base
    defaultLabel="状態"
    v-model="localValue"
    :optionValueList="optionValueStrList"
  >
    <option v-for="status in statusList" :key="status.name" :value="status.name">{{status.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.ts";
import SelectBase from "./base/SelectBase.vue";

import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class ActorStatusSelect extends Mixins<SelectMixin>(
  SelectMixin
) {
  @Prop({ type: String, required: true })
  private actorKey!: string;

  @Getter("getObj") private getObj: any;

  private get statusList(): any[] {
    const actor = this.getObj(this.actorKey);
    return actor ? actor.statusList : [];
  }

  protected get optionValueStrList(): string[] {
    return this.statusList.map(status => status.name);
  }
}
</script>
