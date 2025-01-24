enchant(); 


window.onload = function() { // HTML読み込み完了したら

game = new Core(800, 800);  // ゲーム画面作成、引数は解像度
game.fps = 30;  // フレームレート
game.preload('yoko.png','btn.png','tate.png','balls.png','waku.png');  // 画像ファイルのプリロード

// 盤面基準位置
game.x0 = 190;
game.y0 = 190;
game.step = 40; // 移動や穴間隔の1単位

//bar pattern
tate_pat = [[0,0,1,1,0,1,0],
[0,1,0,0,1,0,1],
[1,0,0,1,1,1,0],
[1,0,1,0,0,1,1],
[0,1,0,1,1,0,0],
[1,1,0,1,0,1,0],
[0,1,1,0,0,0,1],
];

yoko_pat = [[0,1,1,0,1,0,1],
[1,0,1,0,0,1,0],
[1,1,0,1,0,0,1],
[1,0,0,1,0,1,0],
[0,1,1,0,1,1,0],
[0,0,0,1,1,0,1],
[1,0,1,0,0,1,1]
];

game.onload = function(){ // プリロード完了したら

  // バーの作成表示
  bar = new Array();  //縦バー
  left_btn = new Array();
  right_btn = new Array();
  for (var i=0; i<7; i++) {
    bar[i] = new Bar(i, i);  // 位置番号,パターン番号(とりあえず固定)
   game.rootScene.addChild(bar[i]);
   left_btn[i] = new LeftBtn(i);
   game.rootScene.addChild(left_btn[i]);
   right_btn[i] = new RightBtn(i);
   game.rootScene.addChild(right_btn[i]);
  }
 
  bar_1 = new Array();  //横バー
  up_btn = new Array();
  down_btn = new Array();
  for (var j=0; j<7; j++) {  
	bar_1[j] = new Bar_1(j,j);
	game.rootScene.addChild(bar_1[j]);
	up_btn[j] = new UpBtn(j);
    game.rootScene.addChild(up_btn[j]);
    down_btn[j] = new DownBtn(j);
    game.rootScene.addChild(down_btn[j]);
  }
    panel = new Panel();
	game.rootScene.addChild(panel);
		
	game.ballgroup = new Group();
    game.rootScene.addChild(game.ballgroup);
	
}; // game.onload終わり



game.start();  // 動作開始

}; // window.onload終わり

//////////////////////////////////////////////////////////

//// Barたてクラスの定義
Bar = enchant.Class.create( enchant.Sprite, { // Sprite拡張

  initialize: function(pos, pat){  // pos:位置番号,pat:パターン番号
    enchant.Sprite.call(this, 40, 440);  // スプライトサイズ
    this.image = game.assets['tate.png'];
    this.frame = pat;
    this.x = game.x0 + pos * game.step;
    this.y = game.y0 - game.step*2;
    this.slide = 0;  // スライド状態
	this.hole = tate_pat[pat];
    // あとは穴パターン配列ぐらいか
    // できればランダムに裏返しも
  }, // initialize終わり

  up: function() {  //上移動
	if(this.slide < 0) return;
    for (var n=0;n<game.step; n++){
      this.y -= 1;
    }
	this.slide--;
	ballcheck();
  },
  
  down: function() {  //下移動
	if(this.slide > 0) return;
    for (var n=0;n<game.step; n++){
      this.y += 1;
    }
    this.slide++;
	ballcheck();
  }

}); //Barたて定義終わり

//// Barよこクラスの定義
Bar_1 = enchant.Class.create( enchant.Sprite, { // Sprite拡張

  initialize: function(pos, pat){  // pos:位置番号,pat:パターン番号
    enchant.Sprite.call(this, 440, 40);  // スプライトサイズ
    this.image = game.assets['yoko.png'];
    this.frame = pat;
    this.x = game.x0 - game.step*2;
    this.y = game.y0 + pos * game.step;
    this.slide = 0;  // スライド状態
	this.hole = yoko_pat[pat];

  }, // initialize終わり

  left: function() {  //左移動
    if(this.slide < 0) return;
	for (var n=0;n<game.step; n++){
      this.x -= 1;
    }
	this.slide--;
	ballcheck();
  },
  
  right: function() {  //右移動
	if(this.slide >0 ) return;
    for (var n=0;n<game.step; n++){
      this.x += 1;
    }
    this.slide++;
	ballcheck();
  }

}); //Bar定義終わり

//// Panelクラスの定義 ボールを載せるパネル
Panel = enchant.Class.create( enchant.Sprite, { 
	
	initialize: function(){
		enchant.Sprite.call(this, game.step*9, game.step*9); // 7x7と周囲の枠
		//this.backgroundColor = 'cyan';
		this.image = game.assets['waku.png'];
		this.x = game.x0 - game.step;
		this.y = game.y0 - game.step;
		var num = 0;
	
//		var c = 0;
		this.addEventListener('touchend', function(e){
			if (num>=20) return;
			var i = Math.floor((e.x - this.x)/game.step) -1;
			var j = Math.floor((e.y - this.y)/game.step) -1;
			var b = new Ball(i, j, (num++)%4);
			game.ballgroup.addChild(b);
//			num++;
		});
	}
	
});


//// Ballクラスの定義
Ball = enchant.Class.create( enchant.Sprite, { // Sprite拡張

  initialize: function(i, j, col){  // col:色番号
    enchant.Sprite.call(this, 40, 40);  // スプライトサイズ
    this.image = game.assets['balls.png'];
    this.frame = col;
	this.i = i; //横方向の位置
	this.j = j; //横方向の位置
    this.x = i * game.step + game.x0;
    this.y = j * game.step + game.y0;
  }, // initialize終わり

  // Ballを消す命令
  remove: function(){
	  game.ballgroup.removeChild(this);
	  delete this;
 }

}); //Ball定義終わり

//0からn-1までの整数の乱数を作る関数　
function rand(n){
	return Math.floor(Math.random() * n);
}


//// UpBtnクラスの定義
////   あらかじめ決めた番号のバーを操作するボタンの例
UpBtn = enchant.Class.create( enchant.Sprite, { 

  initialize: function(pos){  // pos:位置番号
    enchant.Sprite.call(this, 40, 40); 
    this.image = game.assets['btn.png'];
    this.frame = 2;
    this.x = game.x0 + pos * game.step  ;
    this.y = game.y0 - game.step*4 ;
    
    this.addEventListener(Event.TOUCH_START, function(e){
      bar[pos].up();

    }); //addEventListener終わり
  }, // initialize終わり

   

}); //UpBtn定義終わり



//// DownBtnクラスの定義
////   あらかじめ決めた番号のバーを操作するボタンの例
DownBtn = enchant.Class.create( enchant.Sprite, { 

  initialize: function(pos){  // pos:位置番号
    enchant.Sprite.call(this, 40, 40); 
    this.image = game.assets['btn.png'];
    this.frame = 3;
    this.x = game.x0 + pos * game.step  ;
    this.y = game.y0 + game.step*10;
    
    this.addEventListener(Event.TOUCH_START, function(e){
      bar[pos].down();

    }); //addEventListener終わり
  }, // initialize終わり

   

}); //DownBtn定義終わり





LeftBtn = enchant.Class.create( enchant.Sprite, { 

  initialize: function(pos){  // pos:位置番号
    enchant.Sprite.call(this, 40, 40); 
    this.image = game.assets['btn.png'];
    this.frame = 0;
    this.x = game.x0 - game.step*4;
    this.y = game.y0 + pos * game.step ;
    
    this.addEventListener(Event.TOUCH_START, function(e){
      bar_1[pos].left();

    }); //addEventListener終わり
  }, // initialize終わり

   

}); //LeftBtn定義終わり



//// RightBtnクラスの定義
////   あらかじめ決めた番号のバーを操作するボタンの例
RightBtn = enchant.Class.create( enchant.Sprite, { 

  initialize: function(pos){  // pos:位置番号
    enchant.Sprite.call(this, 40, 40); 
    this.image = game.assets['btn.png'];
    this.frame = 1;
    this.x = game.x0 + game.step*10;
    this.y = game.y0 + pos * game.step ;
    
    this.addEventListener(Event.TOUCH_START, function(e){
      bar_1[pos].right();

    }); //addEventListener終わり
  }, // initialize終わり

   

}); //RightBtn定義終わり

function ballcheck(){
	var balls = game.ballgroup.childNodes;
	var list = new Array(); //消すべきもののリスト
	for(var n=0; n<balls.length; n++){
		var b = balls[n];
		var tate = bar[b.i];
		var yoko = bar_1[b.j];
		if(tate.hole[b.j-tate.slide] == 1){
			if(yoko.hole[b.i-yoko.slide] ==1){
				list.push(b);
			}
		}
	}
	for(var n=0; n<list.length; n++){
		list[n].remove();
	}

}
