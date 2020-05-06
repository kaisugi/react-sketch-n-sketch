# react-sketch-n-sketch

これは以下の論文

- Hempel, Brian, Justin Lubin, and Ravi Chugh. "Sketch-n-Sketch: Output-Directed Programming for SVG." Proceedings of the 32nd Annual ACM Symposium on User Interface Software and Technology. 2019.

および, この論文のデモ [Sketch-n-Sketch](http://ravichugh.github.io/sketch-n-sketch/releases/uist-2019-acm-archive/) を参考に実装した, SVG 画像を作成するための Live Programming 環境です.

実装の上で [React](https://ja.reactjs.org/) を全面的に用いているため, react-sketch-n-sketch という名前を付けました.

## SVG の描画について

react-sketch-n-sketch では **直線, 長方形, 楕円** の 3 種類の図形を描画することができます.

それぞれ, 以下のような JavaScript 風のシンタックスの関数を用いて描画されます.

```javascript
line1 = line([63, 335], [177, 536], "#c13030")
rect2 = rect([48, 16], 207, 547, "#ffffff")
ellipse3 = ellipse([314, 182], 53, 90, "#fabe00");
```

`line` 関数は, 第一引数に始点の座標, 第二引数に終点の座標, 第三引数に色を表すカラーコードをとります.  
`rect` 関数は, 第一引数に左上頂点の座標, 第二引数に横の長さ, 第三引数に縦の長さ, 第四引数に色を表すカラーコードをとります.  
`ellipse` 関数は, 第一引数に中心の座標, 第二引数に x 軸方向の半径, 第三引数に y 軸方向の半径, 第四引数に色を表すカラーコードをとります. 

<br>
さらに, 図形のグループを自分で定義することもできます.  
Make Group と書かれているボタンをクリックすると, 現在画面に描画している図形の集合を一つのグループとして新たに定義し, 描画することができます.

## モードについて

react-sketch-n-sketch では **DRAW, MOVE, DELETE, CHANGE COLOR, CHANGE VARIABLE NAME** の 5 つのモードがあります。

#### DRAW

直線, 長方形, 楕円, グループのいずれかを選択して描画します.

#### MOVE

図形をドラッグアンドドロップで動かします.

#### DELETE

図形をクリックして削除します. クリックした位置から最も座標の近い点を含む図形が削除されます.

#### CHANGE COLOR

カラーピッカーで色を選択した上で, 図形をクリックして色を変えます. クリックした位置から最も座標の近い点を含む図形の色を変えます.

#### CHANGE VARIABLE NAME

テキストボックスに新しく付けたい変数名を入力した上で, 図形をクリックして対応する変数名を変えます. クリックした位置から最も座標の近い点を含む図形の変数名を変えます.