<template>
  <a :href="refProp" @click.prevent="openLink()" :title="titleStr">
    <slot />
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SpecLink extends Vue {
  @Prop({ type: String, required: true })
  private property!: string;

  @Prop({ type: String, required: true })
  private titleStr!: string;

  openLink() {
    const contentsElm: HTMLElement = document.getElementById(
      "welcomeWindowContents"
    )!;
    const targetElm: HTMLInputElement | null = contentsElm!.querySelector(
      `#${this.property}`
    );
    if (!targetElm) {
      window.console.error(`Not found => #${this.property}`);
      return;
    }
    if (targetElm) {
      if (!targetElm.checked) targetElm.click();
      setTimeout(() => {
        const targetRect: any = (targetElm.parentNode as HTMLDivElement)!.getBoundingClientRect();
        const contentsRect: any = contentsElm.getBoundingClientRect();
        contentsElm.scrollTop =
          targetRect.top + contentsElm.scrollTop - contentsRect.top;
      }, 0);
    }
  }

  get refProp() {
    return "#ref_" + this.property;
  }
}
</script>

<style scoped lang="scss">
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
