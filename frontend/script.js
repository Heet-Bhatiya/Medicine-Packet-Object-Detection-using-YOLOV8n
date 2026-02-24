// show a preview when a file is chosen
const inputEl = document.getElementById("image");
const previewEl = document.getElementById("preview");
const resultEl = document.getElementById("result");
const spinner = document.getElementById("spinner");
const detectBtn = document.getElementById("detectBtn");

inputEl.addEventListener("change", () => {
  clearMessage();
  const file = inputEl.files[0];
  if (!file) {
    previewEl.style.display = "none";
    return;
  }

  const url = URL.createObjectURL(file);
  previewEl.src = url;
  previewEl.style.display = "block";
  resultEl.src = "";
});

// drag & drop support
const dropZone = document.getElementById("dropZone");
["dragenter", "dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
});
["dragleave", "drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
  });
});
dropZone.addEventListener("drop", e => {
  const files = e.dataTransfer.files;
  if (files && files[0]) {
    inputEl.files = files;
    inputEl.dispatchEvent(new Event("change"));
  }
});

// message utilities
const messageEl = document.getElementById("message");
function showMessage(text, isError = true) {
  messageEl.textContent = text;
  if (isError) messageEl.style.color = "#b91c1c";
  else messageEl.style.color = "#15803d";
}
function clearMessage() {
  messageEl.textContent = "";
}


function predict(event) {
  if (event && event.preventDefault) event.preventDefault();

  const file = inputEl.files[0];
  if (!file) {
    alert("Please select an image first");
    return;
  }

  // prepare UI
  detectBtn.disabled = true;
  spinner.classList.remove("hidden");
  resultEl.src = "";

  const formData = new FormData();
  formData.append("image", file);

  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }
      return response.blob();
    })
    .then(blob => {
      resultEl.src = URL.createObjectURL(blob);
    })
    .catch(err => {
      alert(err.message);
      console.error(err);
    })
    .finally(() => {
      spinner.classList.add("hidden");
      detectBtn.disabled = false;
    });

  return false;
}