<template>
  <select-base
    :defaultLabel="defaultLabel"
    v-model="localValue"
    :optionValueList="optionValueStrList"
  >
    <option :key="actor.key" :value="actor.key" v-for="actor in selectActors">{{actor.name}}</option>
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
export default class SelfActorSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("getAllActors") private getAllActors: any;

  @Prop({ type: String, default: "アクター" })
  protected defaultLabel!: string;

  @Prop({ type: Array, required: true })
  private selectedActorList!: any[];

  private get selectActors(): any[] {
    return this.getAllActors.filter(
      (actor: any) =>
        this.selectedActorList.findIndex(
          standActor => standActor.key === actor.key
        ) === -1
    );
  }

  protected get optionValueStrList(): string[] {
    return this.selectActors.map(actor => actor.key);
  }
}
</script>
