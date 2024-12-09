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

  // Função para animar os parágrafos e p
  function animateWrapperParagraphs(wrapper) {
    // Seleciona os p com a classe "destaque"
    const destaqueParagraph = wrapper.querySelectorAll("p.destaque")

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

      // Anima os outros elementos após 3 segundos, em sequência
      setTimeout(() => {
        otherElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add("animate")
          }, index * 300) // 500ms de atraso entre os elementos
        })
      }, 1500) // 1.5 segundos de atraso para os p "destaque"
    } else {
      // Se não houver p com "destaque", anima todos os outros elementos normalmente
      otherElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("animate")
        }, index * 300) // 300ms de atraso entre os elementos
      })
    }
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

  /* // Modal logic
  const modal = document.getElementById("modal")
  const closeModal = modal.querySelector(".close")
  const shareButtons = document.querySelectorAll(".share-button")

  let currentWrapper = null

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currentWrapper = e.target.closest(".wrapper")
      if (currentWrapper) {
        openModal()
      }
    })
  })

  function openModal() {
    modal.style.display = "flex"
  }

  closeModal.addEventListener("click", () => {
    modal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  }) */

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
