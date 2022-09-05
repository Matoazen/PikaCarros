class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite Seu Nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "game title");
    this.greeting = createElement("h2");
  }

  esconderElementos() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }
  configurarPosicao(){
    this.input.position(width/2 - 110, height/2 - 80)
    this.playButton.position(width/2 - 90, height/2 - 20)
    this.greeting.position(width/2 - 400, height/2 - 100)
    this.titleImg.position(220, 60)
  }
  configurarEstilo(){
    this.input.class("customInput")
    this.playButton.class("customButton")
    this.greeting.class("greeting")
    this.titleImg.class("gameTitle")
  }
  display(){
    this.configurarPosicao()
    this.configurarEstilo()
    this.enviar()
  }
  enviar(){
    this.playButton.mousePressed(()=>{
      this.input.hide()
      this.playButton.hide()
      var Nome = this.input.value()
      var mensagem = `olá ${Nome}</br> bem vindo ao jogo pikacarros, </br> aguarde outro jogador entrar no pikacarros.`
      this.greeting.html(mensagem)
      EstadoPikachuJogador += 1;
      console.log(EstadoPikachuJogador)
      player.nome = Nome;
      player.indice = EstadoPikachuJogador;
      player.adicionarJogadores();
      player.atualizarContagemDeJogadores(EstadoPikachuJogador);
    })
  }
}
