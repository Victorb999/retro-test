document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container")
  const errorMessage = document.querySelector(".error-message")

  // Verifica se o dispositivo é mobile ou se o navegador suporta a API de compartilhamento
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // FUNÇÃO PARA DECODIFICAR OS PARÂMETROS
  const getDecodedParams = () => {
    const params = new URLSearchParams(window.location.search)
    const base64Data = params.get("dados")
    if (!base64Data) return null

    try {
      const decoded = atob(base64Data)
      const utf8Decoded = decodeURIComponent(escape(decoded))
      return JSON.parse(utf8Decoded)
    } catch (error) {
      console.error("Erro ao decodificar os parâmetros:", error)
      return null
    }
  }

  // SETA OS PARAMS
  const params = getDecodedParams()

  // Array com nome dos campos esperados no JSON
  const rules = [
    "name",
    "cyc",
    "tot24",
    "line1",
    "line2",
    "line3",
    "mut",
    "cpv",
    "ekos",
    "kaik",
    "ref",
    "avn",
    "mov",
    "hgh",
    "camp",
    "cod",
    "level",
  ]

  // Verifica se o dispositivo é mobile ou se o navegador suporta a API de compartilhamento
  if (!isMobile || !navigator.canShare) {
    document.querySelectorAll(".sharebtnbase").forEach((btn) => {
      if (btn.id !== "see-again")
        btn.innerHTML = '<p class="cor1">Baixar imagem</p>'
    })
  }

  // Preenche os slides com os dados
  const populateSlides = () => {
    if (!params) {
      container.style.display = "none"
      errorMessage.style.display = "block"
      return
    }
    rules.forEach((key) => {
      //const slide = panels[slideIndex - 1]; // Ajusta o índice para ser baseado em 0

      const div = document.getElementById(key)
      if (div && params[key]) {
        div.textContent = `${params[key]}` // Preenche o conteúdo da div
      }
    })
    document.getElementById("name-2").textContent = params.name
  }

  // Verifica se o valor é válido
  const isValid = (value) => {
    return (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "null" &&
      value !== "NULL" &&
      value !== "Null"
    )
  }

  // regras para esconder os cards
  const rulesShow = () => {
    const removeElement = (id) => {
      const element = document.getElementById(id)
      if (element) {
        element.remove()
      }
    }
    //CARD 2- PRODUTOS
    if (params.cyc < 8) removeElement("section-Produtos-cyc")
    if (params.tot24 < 50) removeElement("section-Produtos-tot24")
    if (params.cyc < 8 && params.tot24 < 50) {
      removeElement("card-Produtos")
      removeElement("img-Produtos")
    }

    //CARD 3 - LINHAS
    if (!isValid(params.line1)) removeElement("section-Linhas-line1")
    if (!isValid(params.line2)) removeElement("section-Linhas-line2")
    if (!isValid(params.line3)) removeElement("section-Linhas-line3")
    if (
      !isValid(params.line1) &&
      !isValid(params.line2) &&
      !isValid(params.line3)
    ) {
      removeElement("card-Linhas")
      removeElement("img-Linhas")
    }

    //CARD 4 - MUTUALIDADE
    if (!isValid(params.mut)) {
      removeElement("img-Mutualidade")
      removeElement("card-Mutualidade")
    }

    //CARD 5 - CPV
    if (params.cpv <= 0) {
      removeElement("img-CPV")
      removeElement("card-CPV")
    }
    if (params.cpv < 10) removeElement("section-CPV")
    //CARD 6 - EKOS
    if (params.ekos <= 0) {
      removeElement("img-Ekos")
      removeElement("card-Ekos")
    }
    if (params.ekos < 10) removeElement("section-Ekos")
    //CARD 7 - Kaiak
    if (params.kaik <= 0) {
      removeElement("img-Kaiak")
      removeElement("card-Kaiak")
    }
    if (params.kaik < 10) removeElement("section-Kaiak")
    //CARD 8 - REFIL
    if (params.ref <= 0) {
      removeElement("img-Refil")
      removeElement("card-Refil")
    }
    if (params.ref < 10) removeElement("section-Refil")
    //CARD 9 - AVON
    if (params.avn <= 0) {
      removeElement("img-Avon")
      removeElement("card-Avon")
    }
    if (params.avn < 10) removeElement("section-Avon")

    //CARD 10 - RECONHECIMENTO
    if (params.hgh !== "sim") removeElement("section-Reconhecimento-hgh")
    if (params.camp <= 0) removeElement("section-Reconhecimento-camp")
    if (params.hgh !== "sim" && params.camp <= 0) {
      removeElement("img-Reconhecimento")
      removeElement("card-Reconhecimento")
    }
    if (params.camp == 1) {
      document.getElementById("camp-label").textContent = "Campanha"
    }

    //CARD 11 - NIVEL
    if (params.mov !== "SUBIU") {
      removeElement("img-Nivel")
      removeElement("card-Nivel")
    }
  }

  // Executa as funções
  populateSlides()
  rulesShow()

  // Função para converter o conteúdo do card em imagem
  const printPanel = async () => {
    const canvas = await html2canvas(document.body)
    return canvas.toDataURL("image/png")
  }

  // Função para baixar a imagem
  const downloadPrint = async (dataUrl) => {
    const link = document.createElement("a")
    const blob = await (await fetch(dataUrl)).blob()
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = "content.png"
    link.click()
    URL.revokeObjectURL(url)
  }

  /* ===================================Modal logic=================================*/

  const modal = document.getElementById("modal")
  const closeModal = modal.querySelector(".close")
  const shareButtons = document.querySelectorAll(".share-button")

  let currentWrapper = null

  shareButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      // Adiciona botão de download para dispositivos móveis
      if (!isMobile) {
        const social = button.closest(".slider-nav")
        social.style.display = "none"
        const dataUrl = await printPanel()
        await downloadPrint(dataUrl)
        social.style.display = "flex"
      } else {
        currentWrapper = e.target.closest(".wrapper")
        if (currentWrapper) {
          openModal()
        }
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
  })

  /* ===================================EVENTOS=================================*/
  const shareBtn = document.getElementById("modal-button-1")
  // Adiciona evento de clique no botão de compartilhamento
  shareBtn.addEventListener("click", async () => {
    const socialElements = document.querySelectorAll(".slider-nav")
    socialElements.forEach((element) => {
      element.style.display = "none"
    })
    modal.style.display = "none"

    const dataUrl = await printPanel()

    if (navigator.share && isMobile) {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], "content.png", {
        type: "image/png",
      })
      await navigator
        .share({
          title: "Retrospectiva",
          text: "Confira este conteúdo!",
          files: [file],
        })
        .then(() => {
          console.log("Conteúdo compartilhado com sucesso")
        })
        .catch((error) => {
          console.error("Erro ao compartilhar conteúdo:", error)
        })
    } else {
      await downloadPrint(dataUrl)
    }
    socialElements.forEach((element) => {
      element.style.display = "flex"
    })
  })

  // Adiciona evento de clique no botão de download
  const downloadBtn = document.getElementById("modal-button-2")
  downloadBtn.addEventListener("click", async () => {
    const socialElements = document.querySelectorAll(".slider-nav")
    socialElements.forEach((element) => {
      element.style.display = "none"
    })
    modal.style.display = "none"

    const dataUrl = await printPanel()
    await downloadPrint(dataUrl)

    socialElements.forEach((element) => {
      element.style.display = "flex"
    })
  })
})
