const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a").forEach(function (link) {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

const rseaTitle = document.getElementById("rsea-title");
const rseaMeaning = document.getElementById("rsea-meaning");
if (rseaTitle) {
  rseaTitle.addEventListener("click", function () {
    const expanded = rseaTitle.getAttribute("aria-expanded") === "true";
    rseaTitle.setAttribute("aria-expanded", String(!expanded));
    if (rseaMeaning) {
      rseaMeaning.classList.toggle("hidden", expanded);
    }
  });
}

const subscribeForm = document.getElementById("subscribe-form");
if (subscribeForm) {
  const emailInput = document.getElementById("email");
  const formMessage = document.getElementById("form-msg");
  const savedBox = document.getElementById("saved-box");
  const savedEmail = document.getElementById("saved-email");
  const removeEmailButton = document.getElementById("remove-email");
  const storageKey = "rsea_email";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-msg " + type;
  }

  function showSavedEmail(email) {
    savedEmail.textContent = email;
    savedBox.hidden = false;
  }

  try {
    const storedEmail = localStorage.getItem(storageKey);
    if (storedEmail) {
      showSavedEmail(storedEmail);
    }
  } catch (error) {
    console.error("Unable to read the saved email from local storage.", error);
    showFormMessage("Your browser couldn't access saved email storage.", "error");
  }

  emailInput.addEventListener("input", function () {
    emailInput.classList.remove("invalid");
    emailInput.removeAttribute("aria-invalid");
    showFormMessage("", "");
  });

  subscribeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();

    emailInput.classList.remove("invalid");
    emailInput.removeAttribute("aria-invalid");

    if (!email) {
      emailInput.classList.add("invalid");
      emailInput.setAttribute("aria-invalid", "true");
      showFormMessage("Please enter your email address.", "error");
      emailInput.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      emailInput.classList.add("invalid");
      emailInput.setAttribute("aria-invalid", "true");
      showFormMessage("That email does not look right. Please check it and try again.", "error");
      emailInput.focus();
      return;
    }

    try {
      localStorage.setItem(storageKey, email);
    } catch (error) {
      console.error("Unable to save the email to local storage.", error);
      showFormMessage("Your browser couldn't save this email. Check your storage settings and try again.", "error");
      return;
    }

    showSavedEmail(email);
    showFormMessage("Thank you! Your email was saved.", "success");
    subscribeForm.reset();
  });

  removeEmailButton.addEventListener("click", function () {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Unable to remove the saved email from local storage.", error);
      showFormMessage("Your browser couldn't remove the saved email.", "error");
      return;
    }

    savedBox.hidden = true;
    showFormMessage("Your saved email was removed.", "success");
  });
}

const familyFilter = document.getElementById("filter");
if (familyFilter) {
  const familyCards = document.querySelectorAll("#family-list .card");
  const noResult = document.getElementById("no-result");

  familyFilter.addEventListener("change", function () {
    const chosen = familyFilter.value;
    let shown = 0;

    familyCards.forEach(function (card) {
      if (chosen === "All" || card.dataset.relation === chosen) {
        card.classList.remove("hidden");
        shown++;
      } else {
        card.classList.add("hidden");
      }
    });

    noResult.classList.toggle("hidden", shown > 0);
  });
}