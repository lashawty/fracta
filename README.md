# [Fracta](https://fracta.vercel.app/)

## 專案說明

使用套件：gsap, three.js, vite, vanilla js, sass

使用原生html進行切版，字體使用google font載入 Poppins, Noto Sans TC，並針對各個主要裝置尺寸做響應式 RWD

### 進場動畫

利用SVG的 path 及 gsap，可參考 ./js/entry.js
![](https://i.imgur.com/UMazcBY.png)

### 上方動畫

利用svgator產生原生css+svg動畫

### 點擊事件

可點擊兩顆箭頭上下移動卷軸

![](https://i.imgur.com/tVOmdef.png)
![](https://i.imgur.com/pgWtGvr.png)

### 下方動畫

#### 動畫發想

球體落下產生碰撞，象徵專案在設計階段時創意發想的idea相互碰撞，並利用svg製造點子逐漸成形的感覺，最後利用氣球飛走的特效象徵專案完成，夢想起飛。

#### 動畫邏輯
利用gsap scroll trigger帶入下方動畫進場，並利用three.js + cannan.js 產生 3D 的物理碰撞效果，並於svg圖進場後產生“引力”，最後利用改變地心引力的設定產生氣球飛走的感覺。

![](https://i.imgur.com/GshUUbx.png)

### 其他細節

![](https://i.imgur.com/gEee9jk.png)

電話 + email 利用 a 標籤的特性可直接產生撥打電話及發送email的功能
