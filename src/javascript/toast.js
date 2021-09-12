const toastModule = (function () {
  const toastLocation = document.getElementById("toast");

  function displayToast(msg, type) {
    const toast = document.createElement("div");
    const toastType = document.createElement("span");
    const toastMsg = document.createElement("span");
    const closeToast = document.createElement("span");

    if (msg.toLowerCase().includes("error")) msg = msg.split("Error: ")[1];

    toast.classList = `toast ${type === "error" ? "error" : type === "success" ? "success" : ""}`;
    toastType.classList = "toast-type";
    toastMsg.classList = "toast-msg";
    closeToast.classList = "remove-toast";

    toastType.textContent = type === "error" ? "Error:" : type === "success" ? "Success:" : "";
    toastMsg.textContent = msg;
    closeToast.textContent = "×";

    toast.appendChild(toastType);
    toast.appendChild(toastMsg);
    toast.appendChild(closeToast);

    const removeTime = setTimeout(() => {
      removeToast(toast);
    }, 10000);

    closeToast.addEventListener("click", () => {
      removeToast(toast, removeTime);
    });

    toastLocation.insertBefore(toast, toastLocation.firstChild);
  }

  function removeToast(toast, timeout) {
    clearTimeout(timeout);
    toast.removeEventListener("click", removeToast);
    toast.remove();
  }

  return { displayToast };
})();

export default toastModule;
