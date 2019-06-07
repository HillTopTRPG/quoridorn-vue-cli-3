<template>
  <spec-frame
    property="addDiceSymbolWindow"
    label-str="ダイスシンボル追加画面"
    lastVersion="1.0.0b10"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>マップ上で右クリック</li>
      <li>
        表示されるメニューから「ダイスシンボル追加」を選択
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        ダイスの種類を選んでダイスをドラッグしてマップにドロップして配置
      </li>
      <li>
        配置されたダイスは右クリックして目を変えたりサイコロを振って目を変えたり、目を隠したりできる。
      </li>
      <li>
        配置されたダイスは目をいじると、いじった人に所有者が変わる。
      </li>
      <li>
        配置されたダイスは所有者かどうかで隠した際の表示が変わる。
      </li>
      <li>
        配置されたダイスの目を変更する度にチャットで告知される（隠してある場合は目は伏せられる）
      </li>
      <li>
        ダイスセットの追加方法
        <ol>
          <li>
            static/img/diceフォルダ配下にプリセット画像が配置されているので、それを真似てダイスセットの画像を追加する
            <br />フォーマットはpngやjpg、webp、gifなどブラウザで表示できる画像フォーマットなら何でも良い
          </li>
          <li>
            static/conf/dice.yamlにダイス情報が記述されているので、インデント（行頭のスペース）にも意味があることに気をつけながら真似して追加すればOK
          </li>
        </ol>
      </li>
      <li>
        svg形式でダイスの画像を用意できたら、ダイスの色を選んで利用できるようにしたいと思っている。
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>後から追加などができるようにして欲しい</li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 関連項目
     !--------------------->
    <spec-item class-str="ref" label-str="関連項目">
      <li>なし</li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
