const botaoCarta = document.getElementById("abrir-carta");
const conteudoCarta = document.getElementById("conteudo-carta");

const visualizador = document.getElementById("visualizador");
const imagemAmpliada = document.getElementById("imagem-ampliada");
const botaoFechar = document.querySelector(".fechar-visualizador");

const imagensMemorias = document.querySelectorAll(".imagem-memoria");

// Abrir e fechar a carta
botaoCarta.addEventListener("click", () => {
    const estaAberta = botaoCarta.getAttribute("aria-expanded") === "true";

    botaoCarta.setAttribute("aria-expanded", String(!estaAberta));
    conteudoCarta.hidden = estaAberta;

    botaoCarta.innerHTML = estaAberta
        ? 'Abrir minha carta <span aria-hidden="true">♡</span>'
        : 'Fechar minha carta <span aria-hidden="true">↑</span>';
});

// Abrir uma foto ampliada
function abrirImagem(imagem) {
    imagemAmpliada.src = imagem.currentSrc || imagem.src;
    imagemAmpliada.alt = imagem.alt;

    visualizador.showModal();
    document.body.classList.add("modal-aberto");
}

// Fechar a foto ampliada
function fecharImagem() {
    if (visualizador.open) {
        visualizador.close();
    }
}

imagensMemorias.forEach((imagem) => {
    imagem.addEventListener("click", () => {
        abrirImagem(imagem);
    });

    // Permitir abrir a imagem usando o teclado
    imagem.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirImagem(imagem);
        }
    });
});

botaoFechar.addEventListener("click", fecharImagem);

// Fechar ao tocar fora da imagem
visualizador.addEventListener("click", (evento) => {
    if (evento.target === visualizador) {
        fecharImagem();
    }
});

// Restaurar o estado da página quando o diálogo fechar
visualizador.addEventListener("close", () => {
    document.body.classList.remove("modal-aberto");
    imagemAmpliada.src = "";
});