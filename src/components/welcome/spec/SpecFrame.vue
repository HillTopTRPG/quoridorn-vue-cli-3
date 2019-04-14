<template>
  <div class="menu-item">
    <input :id="property" type="checkbox" v-model="isOpened">
    <label :id="refProp" @click="clickLink">
      <span>{{labelStr}}</span>
      <span class="deco-new" v-if="lastVersion === version">[NEW]</span>
      <span class="deco-fixed" v-if="!isSpecFixed">[仕様未確定]</span>
    </label>
    <div class="accordion" v-if="isOpened">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SpecFrame extends Vue {
  @Prop({ type: String, required: true })
  private property!: string;

  @Prop({ type: String, required: true })
  private labelStr!: string;

  @Prop({ type: String, required: true })
  private lastVersion!: string;

  @Prop({ type: Boolean, required: true })
  private isSpecFixed!: string;

  private isOpened: boolean = false;

  clickLink(event: any) {
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      const contentsElm: HTMLElement = document.getElementById(
        "welcomeWindowContents"
      )!;
      const targetElm: HTMLElement | null = contentsElm.querySelector(
        "#" + this.refProp
      );
      if (targetElm) {
        setTimeout(() => {
          contentsElm.scrollTop = targetElm.offsetTop;
        }, 0);
      }
    }
  }

  get refProp() {
    return "ref_" + this.property;
  }

  get version() {
    return this.$store.state.setting.version;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style scoped src="./spec.css"></style>-->
<style scoped lang="scss">
.deco-fixed,
.deco-new {
  font-size: 80%;
  color: rgb(231, 50, 45);
  margin-left: 0.5rem;
}

.menu-item {
  .accordion {
    visibility: visible;
    height: auto;
    opacity: 1;
    overflow-y: hidden;
    padding: 0 0.5em;
    margin: 0;
    white-space: normal;
    background-color: rgb(251, 247, 248);
    border-left: 1px solid rgb(220, 219, 215);
    border-right: 1px solid rgb(220, 219, 215);

    > * {
      margin-top: 0.5em;
      width: 100%;
      box-sizing: border-box;

      &:last-child {
        margin-bottom: 1em;
      }
    }
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"] ~ label {
    position: relative;
    padding-left: 2em;
    padding-right: 0.5em;
    height: 2em;
    display: flex;
    justify-content: left;
    align-items: center;
    border: 1px solid rgb(169, 204, 226);
    color: rgb(53, 108, 165);
    font-weight: bold;
    cursor: pointer;
  }

  &:nth-child(odd) {
    input[type="checkbox"] ~ label {
      background-color: rgb(211, 238, 255);
    }

    input[type="checkbox"] ~ label:hover {
      background-color: rgb(201, 228, 245);
    }
  }

  &:nth-child(even) {
    input[type="checkbox"] ~ label {
      background-color: rgb(235, 248, 255);
    }

    input[type="checkbox"] ~ label:hover {
      background-color: rgb(225, 238, 245);
    }
  }

  &:last-child .accordion {
    border-bottom: 1px solid #777777;
  }

  &:not(:last-child) input[type="checkbox"] ~ label {
    border-bottom-width: 0;
  }

  input[type="checkbox"]:checked ~ label {
    border-bottom-width: 1px;

    &:before,
    &:after {
      transform: rotate(180deg);
    }
  }

  input[type="checkbox"]:not(:checked) ~ .accordion {
    visibility: hidden;
    height: 0;
    opacity: 0;
  }

  input[type="checkbox"] ~ label {
    &:before,
    &:after {
      content: "";
      -webkit-transition-property: opacity, transform;
      -moz-transition-property: opacity, transform;
      -ms-transition-property: opacity, transform;
      -o-transition-property: opacity, transform;
      transition-property: opacity, transform;
      -webkit-transition-duration: 0.5s;
      -moz-transition-duration: 0.5s;
      -o-transition-duration: 0.5s;
      transition-duration: 0.5s;
      /*display: block;*/
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0.5em;
      background-color: rgb(53, 108, 165);
      border-radius: 0.2em;
      height: 0.2em;
      width: 1em;
      box-sizing: border-box;
      border-left: 1px solid rgba(0, 0, 0, 0.4);
      border-right: 1px solid rgba(0, 0, 0, 0.4);
    }

    &:before {
      transform: rotate(90deg);
    }

    &:after {
      transform: rotate(360deg);
    }
  }
}

a {
  text-decoration: none;

  &:link,
  &:visited,
  &:hover,
  &:active {
    color: rgb(53, 108, 165);
  }
}
</style>
