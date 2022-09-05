class Player {
  constructor() {
    this.indice = 0;
    this.posX = 0.0;
    this.posY = 0.111;
    this.nome = null;
    this.rank = 0;
    this.pontos = 0;
    this.gasolina = 185;
    this.vida = 185;
  }
  verificarJogadores() {
    database.ref("playerCount").on("value", (dados)=>{
      EstadoPikachuJogador = dados.val();
  })
  }
  atualizarContagemDeJogadores(quantidade){
    database.ref("/").update({
      playerCount:quantidade
    })
  }
  adicionarJogadores(){
    var indiceDeJogador = "players/player"+ this.indice
    if(this.indice === 1){
      this.posX = width/2 - 100
    } else {
      this.posX = width/2 + 100
    }
      database.ref(indiceDeJogador).set({
       nome:this.nome,
       posicaoX:this.posX,
       posicaoY:this.posY,
       rankeacao:this.rank,
       pontuacao:this.pontos

      })
    }
  static obterInformacaoDosJogadores(){
    database.ref("players").on("value", (dados)=>{
      jogadoresInfo = dados.val();
    })
  }
  atualizarInfoJogador(){
    database.ref("players/player"+ this.indice).update({
      posicaoX:this.posX,
      posicaoY:this.posY,
      rankeacao:this.rank,
      pontuacao:this.pontos
    })
  }
  carrosObterFim(){
    database.ref("carsAtEnd").on("value",(dados)=>{
      this.rank = dados.val()

    })
  }
  static carrosAtualizarFim(quantJogad){
    database.ref("/").update({
      carsAtEnd: quantJogad 
    })
  }
} 
