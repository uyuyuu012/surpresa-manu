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

// CARROSSEL DE FOTOS

const carrossel = document.getElementById("carrossel");
const trilho = document.getElementById("carrossel-trilho");
const anterior = document.getElementById("slide-anterior");
const proximo = document.getElementById("slide-proximo");
const indicadores = document.getElementById("indicadores");
const posicaoSlide = document.getElementById("posicao-slide");

let indiceAtual = 0;
let inicioToqueX = 0;
let inicioToqueY = 0;

function obterSlides() {
    return [...trilho.querySelectorAll(".slide")];
}

function atualizarCarrossel() {
    const slides = obterSlides();

    if (slides.length === 0) {
        posicaoSlide.textContent = "Nenhuma foto";
        anterior.disabled = true;
        proximo.disabled = true;
        indicadores.replaceChildren();
        return;
    }

    indiceAtual = Math.max(
        0,
        Math.min(indiceAtual, slides.length - 1)
    );

    trilho.style.transform = `translateX(-${indiceAtual * 100}%)`;

    anterior.disabled = indiceAtual === 0;
    proximo.disabled = indiceAtual === slides.length - 1;

    posicaoSlide.textContent =
        `${indiceAtual + 1} de ${slides.length}`;

    [...indicadores.children].forEach((indicador, indice) => {
        const ativo = indice === indiceAtual;

        indicador.classList.toggle("ativo", ativo);
        indicador.setAttribute("aria-current", ativo ? "true" : "false");
    });
}

function criarIndicadores() {
    const slides = obterSlides();
    indicadores.replaceChildren();

    slides.forEach((slide, indice) => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "indicador";
        botao.setAttribute("aria-label", `Mostrar foto ${indice + 1}`);

        botao.addEventListener("click", () => {
            indiceAtual = indice;
            atualizarCarrossel();
        });

        indicadores.appendChild(botao);
    });

    atualizarCarrossel();
}

anterior.addEventListener("click", () => {
    if (indiceAtual > 0) {
        indiceAtual--;
        atualizarCarrossel();
    }
});

proximo.addEventListener("click", () => {
    if (indiceAtual < obterSlides().length - 1) {
        indiceAtual++;
        atualizarCarrossel();
    }
});

// Detectar gestos de deslizar no celular
carrossel.addEventListener("touchstart", (evento) => {
    const toque = evento.changedTouches[0];

    inicioToqueX = toque.clientX;
    inicioToqueY = toque.clientY;
}, { passive: true });

carrossel.addEventListener("touchend", (evento) => {
    const toque = evento.changedTouches[0];

    const diferencaX = toque.clientX - inicioToqueX;
    const diferencaY = toque.clientY - inicioToqueY;

    // Ignorar gestos principalmente verticais
    if (Math.abs(diferencaX) < 45 ||
        Math.abs(diferencaX) < Math.abs(diferencaY)) {
        return;
    }

    if (diferencaX < 0 && indiceAtual < obterSlides().length - 1) {
        indiceAtual++;
    } else if (diferencaX > 0 && indiceAtual > 0) {
        indiceAtual--;
    }

    atualizarCarrossel();
}, { passive: true });

// Permitir ampliar as fotos do carrossel
trilho.querySelectorAll(".slide img").forEach((imagem) => {
    imagem.addEventListener("click", () => {
        abrirImagem(imagem);
    });
});

criarIndicadores();