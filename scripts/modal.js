(function () {
  const close = document.getElementById('modal-close');

  if (!close || !modal) {
    return;
  }

  close.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.overflow = 'initial';
  });
})();
