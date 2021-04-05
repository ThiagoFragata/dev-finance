const Modal = {
  open() {
    // abrir modal
    // adicionar a classe active no modal

    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    // fechar modal
    // remover a classe active no modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};
