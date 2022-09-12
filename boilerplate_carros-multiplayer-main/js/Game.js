class Game {
  constructor() {
    this.botaoReiniciar = createButton("");
    this.tituloPontuacao = createElement("h2");
    this.placar1 = createElement("h2");
    this.placar2 = createElement("h2");
  }

  start() {
    player = new Player();
    player.verificarJogadores();

    form = new Form();
    form.display();

    car1 = createSprite(width/2 - 50, height - 100);
    car2 = createSprite(width/2 + 50, height + 100);
    car1.addImage(car1Img);
    car1.scale = 0.07;
    car2.addImage(car2Img);
    car2.scale = 0.07;
    carmatrix = [car1, car2];

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800 , image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2      , y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2      , y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    fuels = new Group();
    goldCoins = new Group();
    obstacles = new Group();
    this.addSprites(fuels, 4, fuelImg, 0.02);
    this.addSprites(goldCoins, 18, goldCoinImg, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, pistaImg, 0.04, obstaclesPositions)
  }
  verificarJogo(){
    database.ref("gameState").on("value", (dados)=>{
        EstadopikaCarrosJogo = dados.val()
    })
  }
  atualizarJogo(estado){
    database.ref("/").update({
      gameState:estado
    })
  }
  playing(){
    Player.obterInformacaoDosJogadores()
    player.carrosObterFim()
    this.lidarComElementos();
    this.reiniciarJogo();
    var indiceJogo = 0;
    if(jogadoresInfo != undefined){
      image(pistaImg, 0, -height * 5, width, height * 6)
      this.atualizarRank();
        for(var indiceDeCadaJogador in jogadoresInfo){
          indiceJogo += 1;
          var x = jogadoresInfo[indiceDeCadaJogador].posicaoX
          var y = jogadoresInfo[indiceDeCadaJogador].posicaoY
          carmatrix[indiceJogo - 1].position.x = x
          carmatrix[indiceJogo - 1].position.y = y
          if(player.indice == indiceJogo){
            fill("blue")
            ellipse(x, y, 60)
            camera.position.y = carmatrix[indiceJogo - 1].position.y
            this.lidarComGasolina(indiceJogo)
            this.lidarComMoedas(indiceJogo)
            this.deteccaoDeObstaculos(indiceJogo)
          }
        }
        const linhaDeChegada = height * 6 - 100
        if(player.posY > linhaDeChegada){
          gameState = 2
          player.rank += 1
          Player.carrosAtualizarFim(player.rank)
          player.atualizarInfoJogador()
          this.mostrarRank()

        }
        this.movimento();
       drawSprites();
    }

  }
  lidarComElementos(){
    form.esconderElementos()
    form.titleImg.hide()
    this.botaoReiniciar.class("resetButton")
    this.botaoReiniciar.position(width/2 + 230, 100)
    this.tituloPontuacao.html("placar")
    this.tituloPontuacao.class("resetText")
    this.tituloPontuacao.position(width/3 - 60, 40)
    this.placar1.class("leadersText")
    this.placar1.position(width/3 - 50, 80)
    this.placar2.class("leadersText")
    this.placar2.position(width/3 - 50, 130)
  }
  movimento(){
    if(keyIsDown(UP_ARROW) || keyIsDown(87)){
      player.posY -= 5;
      console.log("oi, eu sou o oposto de um erro")
      player.atualizarInfoJogador()
    }
    if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
      player.posY += 5;
      player.atualizarInfoJogador()
    }
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      player.posX -= 5;
      player.atualizarInfoJogador()
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      player.posX += 5;
      player.atualizarInfoJogador()
    }
  }
  reiniciarJogo(){
    this.botaoReiniciar.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {}
      })
      window.location.reload()
    })
  } 
  atualizarRank(){
    var placar1, placar2;
    var placaresjogadores = Object.values(jogadoresInfo);
    if((placaresjogadores[0].rankeacao === 0 && placaresjogadores[1].rankeacao === 0) || (placaresjogadores[0].rankeacao === 1)){
      placar1 = placaresjogadores[0].rankeacao + "&emsp;" + placaresjogadores[0].nome + "&emsp;" + placaresjogadores[0].pontuacao;
      placar2 = placaresjogadores[1].rankeacao + "&emsp;" + placaresjogadores[1].nome + "&emsp;" + placaresjogadores[1].pontuacao;
    }
    if(placaresjogadores[1].rankeacao === 1){
      placar1 = placaresjogadores[1].rankeacao + "&emsp;" + placaresjogadores[1].nome + "&emsp;" + placaresjogadores[1].pontuacao;
      placar2 = placaresjogadores[0].rankeacao + "&emsp;" + placaresjogadores[0].nome + "&emsp;" + placaresjogadores[0].pontuacao;
    }
    this.placar1.html(placar1)
    this.placar2.html(placar2)
    console.log(placaresjogadores)
  }
  addSprites(Group, quantidade, image, scale, matrizDePosicao = []){
    for(var i = 0; i < quantidade; i++){
      var x; var y;
    if(matrizDePosicao.length > 0){
      x = matrizDePosicao[i].x
      y = matrizDePosicao[i].y 
      image = matrizDePosicao[i].image
    } else {
      x = random(width/2 - 150, width/2 + 150);
      y = random(-height*4.5, height - 400);
    }
    var sprite = createSprite(x, y);
    sprite.addImage(image);
    sprite.scale = scale;
    Group.add(sprite);
    }
  }
  lidarComGasolina(Indicx){
    carmatrix[Indicx -1].overlap(fuels,(Carro1, Gasolina2)=>{
      Gasolina2.remove()
      player.gasolina = 185
    })
  }
  lidarComMoedas(Indicy){
    carmatrix[Indicy -1].overlap(goldCoins,(Carro2, Moeda2)=>{
      Moeda2.remove()
      player.pontos += 1
      player.atualizarInfoJogador()
    })
  }
  deteccaoDeObstaculos(Indicz){ 
     //paramos aqui :)
    if(carmatrix[Indicz -1].collide(obstacles)){
      if (this.leftKeyActive) { 
        player.positionX += 100;
      } else {
        player.positionX -= 100; 
      } 
      if (player.life > 0) {
       player.life -= 185 / 4; 
      } 
      player.atualizarInfoJogador(); 
    } 
 }

  mostrarRank(){
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    })
  }
}
 //3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989
