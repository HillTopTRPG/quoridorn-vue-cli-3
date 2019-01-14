<template>
  <div :style="containerStyle" class="deckContainer">
    <fieldset>
      <legend>{{deck.name}}</legend>
      <div class="refArea">
        【出典元情報】
        <div v-if="deck.author">作者：{{deck.author}}</div>
        <div v-if="deck.title">作品名：{{deck.title}}</div>
        <div class="refUrlContainer"><a v-for="(ref, index) in deck.refs" :key="index" :href="ref.url" target="_blank" :title="createRefStr(ref, index)">{{createRefStr(ref, index)}}</a></div>
      </div>
      <div class="deck" ref="deck" :style="deckStyle">
        <Card :class="[card.key]" :index="index" :key="card.key" :objKey="card.key" :ref="card.key"
              v-for="(card, index) in deckCardList"></Card>
        <Card :index="deckHoverIndex" :isViewer="true" :objKey="deckHoverKey" ref="centerCard"></Card>
        カードなし
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Card from "./Card.vue";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<Deck>({
  name: "deck",
  components: {
    Card
  }
})
export default class Deck extends Vue {
  @Action("setProperty") setProperty: any;
  @Getter("deck") deck: any;
  @Getter("deckCardList") deckCardList: any;
  @Getter("deckCommand") deckCommand: any;
  @Getter("deckHoverIndex") deckHoverIndex: any;
  @Getter("deckHoverKey") deckHoverKey: any;
  @Getter("isModal") isModal: any;

  createRefStr(
    { author, title }: { author: string; title: string },
    index: number
  ): string {
    if (!author && !title) return `link-${index}`;
    if (author && title) return `${title}(${author})`;
    if (author) return `${author}`;
    if (title) return `${title}`;
    return "";
  }

  get containerStyle(): any {
    const obj: any = {};
    obj.width = this.deck.width * 0.8 + 22 + "px";
    if (this.isModal) {
      obj.filter = "blur(3px)";
    }
    return obj;
  }

  get deckStyle(): any {
    const obj: any = {};
    obj.width = this.deck.width * 0.8 + 15 + "px";
    obj.height = this.deck.height * 0.8 + 15 + "px";
    return obj;
  }

  @Watch("deckCommand")
  onChangeDeckCommand(this: any, deckCommand: any): void {
    if (!deckCommand) return;
    if (deckCommand.type === "draw") {
      let cards = Array.prototype.slice.call(
        this.$refs.deck.getElementsByClassName(this.deckHoverKey)
      );
      let cardElm = cards[0];
      if (!cardElm) {
        const key = this.deckCardList[this.deckCardList.length - 1].key;
        cards = Array.prototype.slice.call(
          this.$refs.deck.getElementsByClassName(key)
        );
        cardElm = cards[0];
      }
      if (cardElm.classList.contains("turn-animation")) {
        cardElm.classList.remove("turn-animation");
      } else {
        cardElm.classList.add("turn-animation");
      }
      this.setProperty({
        property: "deck",
        value: {
          hoverIndex: -1,
          hoverKey: ""
        },
        logOff: true
      });
    } else if (deckCommand.type === "changeViewMode") {
      this.setProperty({
        property: "deck.viewMode",
        value: deckCommand.value,
        logOff: true
      });
    } else if (deckCommand.type === "shuffle") {
      const cards = Array.prototype.slice.call(
        this.$refs.deck.getElementsByClassName("card")
      );
      if (cards.length) {
        cards.forEach(cardElm => {
          if (cardElm.classList.contains("shuffle-animation")) {
            cardElm.classList.remove("shuffle-animation");
          } else {
            cardElm.classList.add("shuffle-animation");
          }
        });
      }
    }
    this.setProperty({
      property: "deck.command",
      value: null,
      logOff: true
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deckContainer {
  position: absolute;
  top: 130px;
  left: 240px;
  padding: 0;
  perspective: 800px;
  -webkit-perspective: 800px;
  font-size: 8px;
  border: 1px solid cyan;
  box-sizing: border-box;
}
fieldset {
  background-color: rgba(0, 255, 0, 0);
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  border: 2px solid black;
}
legend {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid black;
  border-bottom: none;
  box-sizing: border-box;
  margin: -0.8em 5px;
  padding: 0 5px;
  top: -0.8em;
  /*margin-top: -1em;*/
  position: absolute;
}
.refArea {
  background-color: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
}
.refUrlContainer {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 5px;
  border-bottom: 1px solid black;
  box-sizing: border-box;
}
a {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 50px;
  border-radius: 0.5em;
  border: 1px solid black;
  padding: 0 2px;
  box-sizing: border-box;
}
.deck {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}
button {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
