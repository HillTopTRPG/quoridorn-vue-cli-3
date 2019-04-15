<template>
  <div
    class="context"
    v-if="isDisplay"
    :style="contextStyle"
    @mouseleave.prevent="windowClose(displayProperty)"
    @contextmenu.prevent
  >
    <slot/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  props: {
    displayProperty: { type: String, required: true }
  },
  methods: {
    ...mapActions(["windowClose", "setProperty"])
  },
  watch: {
    command(command) {
      if (!command) {
        return;
      }
      const val = { command: null };
      if (command.command === "open") {
        val.isDisplay = true;
      }
      if (command.command === "close") {
        val.isDisplay = false;
      }
      this.setProperty({
        property: `${this.displayProperty}`,
        value: val,
        logOff: true
      });
      const _ = this;
      setTimeout(() => _.$emit(command.command, command.payload), 0);
    }
  },
  computed: mapState({
    ...mapGetters(["isWindowOpen", "getStateValue"]),
    command() {
      return !this.displayProperty
        ? ""
        : this.getStateValue(this.displayProperty).command;
    },
    isDisplay() {
      return this.isWindowOpen(this.displayProperty);
    },
    contextStyle() {
      const displayObj = this.getStateValue(this.displayProperty);
      return {
        top: displayObj.y - 5 + "px",
        left: displayObj.x - 5 + "px"
      };
    }
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.context {
  position: fixed;
  z-index: 90;
  padding: 0;
  min-width: 50px;
  background-color: white;
  border: solid gray 1px;
  box-sizing: border-box;
  cursor: default;

  > * {
    display: block;
    min-width: 50px;
    font-size: 14px;
    padding: 0 5px;

    &:not(.disabled):hover {
      background-color: lightblue;
    }

    &.disabled {
      background-color: lightgrey;
    }
  }
}
</style>
