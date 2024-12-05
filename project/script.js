document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    const panels = document.querySelectorAll(".panel");
    const errorMessage = document.querySelector(".error-message");
    let currentSection = 0;
    let isScrolling = false;
  
    // Verifica se o dispositivo é mobile ou se o navegador suporta a API de compartilhamento
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    // FUNÇÃO PARA DECODIFICAR OS PARÂMETROS
    const getDecodedParams = () => {
      const params = new URLSearchParams(window.location.search);
      const base64Data = params.get("dados");
      if (!base64Data) return null;
  
      try {
        const decoded = atob(base64Data);
        const utf8Decoded = decodeURIComponent(encodeURIComponent(decoded)); // Corrige caracteres UTF-8
        return JSON.parse(utf8Decoded);
      } catch (error) {
        console.error("Erro ao decodificar os parâmetros:", error);
        return null;
      }
    };
  
    // SETA OS PARAMS
    const params = getDecodedParams();
  
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
    ];
  
    // Verifica se o dispositivo é mobile ou se o navegador suporta a API de compartilhamento
    if (!isMobile || !navigator.canShare) {
      document.querySelectorAll(".shareBtn").forEach((btn) => {
        btn.innerHTML = "Baixar imagem";
      });
    }
  
    // Preenche os slides com os dados
    const populateSlides = () => {
      if (!params) {
        container.style.display = "none";
        errorMessage.style.display = "block";
        return;
      }
      rules.forEach((key, slideIndex) => {
        //const slide = panels[slideIndex - 1]; // Ajusta o índice para ser baseado em 0
  
        const div = document.getElementById(key);
        if (div && params[key]) {
          div.textContent = `${params[key]}`; // Preenche o conteúdo da div
        }
      });
    };
  
    // Verifica se o valor é válido
    const isValid = (value) => {
      return (
        value !== undefined && value !== null && value !== "" && value !== "null"
      );
    };
  
    // regras para esconder os cards
    const rulesShow = () => {
      const hideElement = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.style.display = "none";
        }
      };
      //CARD 2- PRODUTOS
      if (params.cyc < 8) hideElement("cyc");
      if (params.tot24 < 50) hideElement("tot24");
      if (!isValid(params.line1)) hideElement("line1");
      if (!isValid(params.line2)) hideElement("line2");
      if (!isValid(params.line3)) hideElement("line3");
      if (
        !isValid(params.line1) &&
        !isValid(params.line2) &&
        !isValid(params.line3)
      ) {
        hideElement("lines");
      }
      if (params.cyc < 8 && params.tot24 < 50) {
        hideElement("card-PRODUTOS");
      }
      //CARD 3 - MUTUALIDADE
      if (!isValid(params.mut)) hideElement("card-MUTUALIDADE");
      //CARD 4 - CPV
      if (params.cpv < 10) hideElement("card-CPV");
      //CARD 5 - EKOS
      if (params.ekos < 10) hideElement("card-EKOS");
      //CARD 6 - REFIL
      if (params.ref < 10) hideElement("card-REFIL");
      //CARD 7 - AVON
      if (params.avn < 10) hideElement("card-AVON");
      //CARD 8 - RECONHECIMENTO
      if (!isValid(params.mov)) hideElement("mov");
      if (params.hgh !== "sim") hideElement("hgh");
      if (params.camp <= 0) hideElement("camp");
      if (!isValid(params.level)) hideElement("level");
    };
  
    // Executa as funções
    populateSlides();
    rulesShow();
  
    // Conta o total de seções
    const totalSections = Array.from(panels).filter(
      (panel) => panel.style.display !== "none"
    ).length;
  
    // Função para rolar para a seção desejada
    const scrollToSection = (index) => {
      if (index >= 0 && index < totalSections) {
        isScrolling = true;
        container.style.transform = `translateX(-${index * window.innerWidth}px)`;
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };
  
    // Função para chamar o GTM
    const callGTMButton = () => {
      const dataLayerObject = {
        event: isMobile ? "Compartilhar" : "Baixar",
        eventCategory: "Retrospectiva",
        eventAction: isMobile ? "Compartilhar" : "Baixar",
        eventLabel: "Categoria",
        eventDimensions: "[Retrospectiva] area de acesso",
        eventTag: isMobile
          ? "click-share-retrospectiva"
          : "click-download-retrospectiva",
      };
      console.log(dataLayerObject);
  
      try {
        dataLayer.push(dataLayerObject);
      } catch (error) {
        console.error("Erro ao acessar o dataLayer:", error);
      }
    };
  
    // Função para converter o conteúdo do card em imagem
    const printPanel = async (button, panelId) => {
      const canvas = await html2canvas(document.getElementById(panelId));
      return canvas.toDataURL("image/png");
    };
  
    // Função para baixar a imagem
    const downloadPrint = async (dataUrl) => {
      const link = document.createElement("a");
      const blob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "content.png";
      link.click();
      URL.revokeObjectURL(url);
    };
  
    /* ===================================EVENTOS=================================*/
  
    // Adiciona eventos de scroll
    window.addEventListener("wheel", (e) => {
      if (isScrolling) return;
  
      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        currentSection++;
      } else if (e.deltaY < 0 && currentSection > 0) {
        currentSection--;
      }
      scrollToSection(currentSection);
    });
  
    // Adiciona eventos de touch
    let startX = 0;
    container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
  
    // Adiciona eventos de touch
    container.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;
  
      if (deltaX < -50 && currentSection < totalSections - 1) {
        currentSection++;
      } else if (deltaX > 50 && currentSection > 0) {
        currentSection--;
      }
  
      scrollToSection(currentSection);
    });
  
    // Adiciona eventos de clique nos botões de compartilhamento
    document.querySelectorAll(".shareBtn").forEach((button) => {
      // Adiciona botão de download para dispositivos móveis
      if (isMobile && navigator.canShare) {
        console.log("entrou");
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Baixar imagem";
        downloadButton.className = "shareBtn";
  
        downloadButton.addEventListener("click", async () => {
          const panel = button.closest(".panel");
          const panelId = panel.id;
          const social = panel.querySelector(".social");
          social.style.display = "none";
          const dataUrl = await printPanel(button, panelId);
          await downloadPrint(dataUrl);
          social.style.display = "flex";
        });
        button.after(downloadButton);
      }
  
      // Adiciona evento de clique no botão de compartilhamento
      button.addEventListener("click", async () => {
        const panel = button.closest(".panel");
        const panelId = panel.id;
        const social = panel.querySelector(".social");
        social.style.display = "none";
  
        const dataUrl = await printPanel(button, panelId);
        callGTMButton();
  
        if (navigator.share && isMobile) {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], "content.png", {
            type: "image/png",
          });
          await navigator
            .share({
              title: "Retrospectiva",
              text: "Confira este conteúdo!",
              files: [file],
            })
            .then(() => {
              console.log("Conteúdo compartilhado com sucesso");
            })
            .catch((error) => {
              console.error("Erro ao compartilhar conteúdo:", error);
            });
        } else {
          await downloadPrint(dataUrl);
        }
        social.style.display = "flex";
      });
    });
  });
  