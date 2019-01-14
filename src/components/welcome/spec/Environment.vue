<template>
  <SpecFrame property="environment" label-str="動作環境" lastVersion="1.0.0b3" :isSpecFixed="true">
    <!----------------------
     ! 現在の推奨環境
     !--------------------->
    <SpecItem class-str="spec" label-str="現在の推奨環境">
      <li><i class="icon-windows8"></i>Windows10 - <i class="icon-chrome"></i>Google Chrome最新版</li>
      <li><i class="icon-appleinc"></i>Macintosh - <i class="icon-chrome"></i>Google Chrome最新版</li>
    </SpecItem>
    <!----------------------
     ! 理想の推奨環境
     !--------------------->
    <SpecItem class-str="spec" label-str="理想の推奨環境">
      <li><i class="icon-appleinc"></i>Macintosh - <i class="icon-safari"></i>Safari</li>
      <li><i class="icon-appleinc"></i>Macintosh - <i class="icon-chrome"></i>Google Chrome最新版</li>
      <li><i class="icon-windows8"></i>Windows10 - <i class="icon-chrome"></i>Google Chrome最新版</li>
      <li><i class="icon-windows8"></i>Windows10 - <i class="icon-firefox"></i>Fire Fox最新版</li>
    </SpecItem>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <SpecItem class-str="request" label-str="ユーザ要望">
      <li><i class="icon-appleinc"></i>Macintosh (- <i class="icon-safari"></i>Safari)</li>
    </SpecItem>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <SpecItem class-str="unImplemented" label-str="未実装事項">
      <li><i class="icon-windows"></i>Windows10 - <i class="icon-firefox"></i>Fire Fox最新版<br>→ 初回リリースには含めない。</li>
      <li><i class="icon-appleinc"></i>Macintosh<br>→ 自分へのクリスマスプレゼント兼ねてMac買いました！<br>→ 対応決定なので順次気になった所は直していきます。</li>
    </SpecItem>
  </SpecFrame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
