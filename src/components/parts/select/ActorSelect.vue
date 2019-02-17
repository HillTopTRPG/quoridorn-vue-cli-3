<template>
  <SelectBase defaultLabel="アクター" v-model="localValue">
    <option :key="actor.key" :value="actor.key" v-for="actor in selectActors">{{actor.name}}</option>
  </SelectBase>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Component, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component<ActorSelect>({
  name: "actorSelect",
  mixins: [SelectMixin],
  components: { SelectBase }
})
export default class ActorSelect extends Vue {
  @Getter("getPeerActors") getPeerActors: any;
  @Prop({ type: Array, required: true })
  private selectedActorList!: any[];

  get selectActors(): any[] {
    return this.getPeerActors.filter(
      (actor: any) =>
        this.selectedActorList.findIndex(
          standActor => standActor.key === actor.key
        ) === -1
    );
  }
}
</script>
