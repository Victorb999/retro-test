$(document).ready(function () {
  var slideContainer = $(".slide-container")
  var currentBgIndex = 0
  var bgImages = $(".bg-container img")
  var totalBgImages = bgImages.length
  var animatedSlides = new Set() // Conjunto para rastrear slides já animados

  function changeBackground(index) {
    bgImages.removeClass("showbg")
    bgImages.eq(index).addClass("showbg")
  }

  function updateImageVisibility(index) {
    $(".natura-card__image img").removeClass("show")
    $(".natura-card__image").eq(index).find("img").addClass("show")
    $(".natura-card__image").eq(0).find("img").removeClass("show")
    $(".natura-card__image").eq(0).find("img").addClass("primeiraimg")
  }

  // Timer para avançar automaticamente do primeiro slide
  let firstSlideTimer // Variável para armazenar o timer do primeiro slide

  // Após a inicialização do slider, configure o timer para o primeiro slide
  slideContainer.on("init", function () {
    firstSlideTimer = setTimeout(() => {
      slideContainer.slick("slickNext") // Avança para o próximo slide
    }, 10000) // 10 segundos (10000ms)
  })

  // Cancela o timer para os slides subsequentes
  slideContainer.on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      if (currentSlide === 0) {
        clearTimeout(firstSlideTimer) // Cancela o timer ao sair do primeiro slide
      }
    }
  )

  // Função para animar os parágrafos e p
  function animateWrapperParagraphs(wrapper) {
    // Desabilita o botão de compartilhamento enquanto a animação ocorre
    var buttonShare = wrapper.closest(".wrapper").querySelector(".share-button")
    if (buttonShare) {
      buttonShare.disabled = true
      buttonShare.querySelector(".sharebtnbase").style.background = "#CCC"
    }
    // Seleciona os p com a classe "destaque"
    const destaqueParagraph = wrapper.querySelectorAll("p.destaque")
    const paragraphs = Array.from(wrapper.querySelectorAll("p"))

    /* document.querySelectorAll('p').forEach((p, index) => {
        p.setAttribute('data-delay', 100 * (index + 1)); // Ajusta delays dinamicamente
    });  */

    // Ordena os elementos com base no atributo data-index
    const sortedParagraphs = paragraphs.sort((a, b) => {
      return (
        parseInt(a.getAttribute("data-index"), 10) -
        parseInt(b.getAttribute("data-index"), 10)
      )
    })

    // Seleciona os outros elementos p
    const otherElements = wrapper.querySelectorAll("p:not(.destaque)")

    // Remove animações anteriores
    destaqueParagraph.forEach((p) => p.classList.remove("animate"))
    otherElements.forEach((el) => el.classList.remove("animate"))

    // Se houver p com a classe "destaque", anima-os primeiro
    if (destaqueParagraph.length > 0) {
      // Anima os p com "destaque" primeiro, sem atraso entre eles
      destaqueParagraph.forEach((p) => {
        p.classList.add("animate")
      })

      // Anima os outros elementos após 1.5 segundos, em sequência
      setTimeout(() => {
        // Anima os elementos na ordem definida pelo data-index
        sortedParagraphs.forEach((p, index) => {
          // Variável para controlar o atraso acumulado
          let accumulatedDelay = 0

          // Anima os elementos considerando o delay definido no atributo data-delay
          paragraphs.forEach((p) => {
            const delay = parseInt(p.getAttribute("data-delay"), 10) || 300 // Atraso padrão: 300ms se não especificado
            accumulatedDelay += delay // Soma ao atraso acumulado
            setTimeout(() => {
              p.classList.add("animate")
            }, accumulatedDelay)
          })
          /*  setTimeout(() => {
                p.classList.add("animate");
            }, index * 300); */ // Ajuste o intervalo entre as animações (300ms neste caso)
        })
      }, 1500) // 1.5 segundos de atraso para os p "destaque"
    } else {
      // Se não houver p com "destaque", anima todos os outros elementos normalmente
      sortedParagraphs.forEach((p, index) => {
        // Variável para controlar o atraso acumulado
        let accumulatedDelay = 0

        // Anima os elementos considerando o delay definido no atributo data-delay
        paragraphs.forEach((p) => {
          const delay = parseInt(p.getAttribute("data-delay"), 10) || 300 // Atraso padrão: 300ms se não especificado
          accumulatedDelay += delay // Soma ao atraso acumulado
          setTimeout(() => {
            p.classList.add("animate")
          }, accumulatedDelay)
        })
        /*  setTimeout(() => {
                    p.classList.add("animate");
                }, index * 300); */ // Ajuste o intervalo entre as animações (300ms neste caso)
      })
    }
    //habilita o botao quando animação acaba
    const totalAnimationTime = paragraphs.reduce((total, p, index) => {
      const delay = parseInt(p.getAttribute("data-delay"), 10) || 300
      return total + delay * (index + 1)
    }, 0)

    setTimeout(() => {
      if (buttonShare) {
        buttonShare.disabled = false
        buttonShare.querySelector(".sharebtnbase").style.background = "#fff"
      }
    }, totalAnimationTime + 1000) // Adding the initial delay for destaque paragraphs
  }

  // Função para configurar os parágrafos no estado final (opacidade 1)
  function finalizeParagraphs(wrapper) {
    const paragraphs = wrapper.querySelectorAll("p")
    paragraphs.forEach((p) => p.classList.add("animate"))
  }

  // Inicializar o slider
  slideContainer.slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: true,
    prevArrow: $(".slick-prev_custom"),
    nextArrow: $(".slick-next_custom"),
  })

  // Configuração inicial
  changeBackground(0)
  updateImageVisibility(0)

  // Evento para mudança de fundo e visibilidade
  slideContainer.on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      currentBgIndex = (nextSlide + totalBgImages) % totalBgImages
      changeBackground(currentBgIndex)
      updateImageVisibility(nextSlide)
    }
  )

  // Evento para tratar a animação dos parágrafos
  slideContainer.on("afterChange", function (event, slick, currentSlide) {
    const activeWrapper = $(slick.$slides[currentSlide]).find(".natura-card")[0]

    if (activeWrapper && !animatedSlides.has(currentSlide)) {
      // Animação apenas se o slide ainda não foi animado
      animateWrapperParagraphs(activeWrapper)

      // Marca o slide como animado
      animatedSlides.add(currentSlide)
    } else if (activeWrapper) {
      // Configura o estado final diretamente caso o slide já tenha sido animado
      finalizeParagraphs(activeWrapper)
    }
  })

  // Modal logic

  // Configuração inicial: anima o primeiro slide ao carregar
  setTimeout(() => {
    const firstWrapper = $(
      ".slide-container .slick-slide.slick-active .natura-card"
    )[0]
    if (firstWrapper) {
      animateWrapperParagraphs(firstWrapper)

      // Marca o primeiro slide como animado
      animatedSlides.add(0)
    }
  }, 0)
})
