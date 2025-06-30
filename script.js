const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");
const categoriesList = document.querySelector("aside ul");

// Toggle form visibility
btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "share a fact";
  }
});

// Function to create fact HTML
function createFactHTML(fact) {
  const category = CATEGORIES.find((cat) => cat.name === fact.category);
  const color = category ? category.color : "#000";

  return `
    <li class="fact">
      <p>
        ${fact.text}
        <a class="source" href="${fact.source}" target="_blank">(source)</a>
      </p>
      <span class="tag" style="background-color: ${color}">
        #${fact.category}#
      </span>
      <div class="vote-buttons">
        <button>👍 ${fact.votesInteresting}</button>
        <button>🤯 ${fact.votesMindblowing}</button>
        <button>⛔ ${fact.votesFalse}</button>
      </div>
    </li>`;
}

// Function to render facts array
function renderFacts(facts) {
  const htmlArr = facts.map(createFactHTML);
  factsList.innerHTML = htmlArr.join("");
}

// Dynamically generate category buttons
function renderCategories() {
  categoriesList.innerHTML = `
    <li><button class="btn btn-all-categories active">All</button></li>
  `;
  CATEGORIES.forEach((cat) => {
    const li = document.createElement("li");
    li.classList.add("category");

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-category");
    btn.textContent = cat.name;
    btn.style.backgroundColor = cat.color;

    li.appendChild(btn);
    categoriesList.appendChild(li);
  });
}

// Initialize categories and facts display
renderCategories();
renderFacts(initialFacts);

// Event delegation for category buttons
categoriesList.addEventListener("click", function (e) {
  const btnClicked = e.target;
  if (
    !btnClicked.classList.contains("btn-category") &&
    !btnClicked.classList.contains("btn-all-categories")
  )
    return;

  // Remove active class from all buttons
  categoriesList.querySelectorAll("button").forEach((b) => {
    b.classList.remove("active");
  });

  // Add active class to clicked button
  btnClicked.classList.add("active");

  const category = btnClicked.textContent.toLowerCase();

  if (category === "all") {
    renderFacts(initialFacts);
  } else {
    const filteredFacts = initialFacts.filter(
      (fact) => fact.category === category
    );
    renderFacts(filteredFacts);
  }
});

// Form inputs selectors
const formElement = document.querySelector(".fact-form");
const inputText = formElement.querySelector("input[name='fact-text']");
const inputSource = formElement.querySelector("input[name='fact-source']");
const selectCategory = formElement.querySelector(
  "select[name='fact-category']"
);
const charCountSpan = formElement.querySelector("span");

// Character count update
inputText.addEventListener("input", function () {
  const remaining = 200 - inputText.value.length;
  charCountSpan.textContent = remaining;
});

// Generate a unique ID for new facts
function generateId() {
  return initialFacts.length
    ? Math.max(...initialFacts.map((f) => f.id)) + 1
    : 1;
}

// Handle form submission
formElement.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = inputText.value.trim();
  const source = inputSource.value.trim();
  const category = selectCategory.value.trim();

  if (!text || !source || !category) {
    alert("Please fill in all fields and choose a category.");
    return;
  }

  // Simple URL validation for source
  try {
    new URL(source);
  } catch {
    alert("Please enter a valid URL for the source.");
    return;
  }

  const newFact = {
    id: generateId(),
    text,
    source,
    category,
    votesInteresting: 0,
    votesMindblowing: 0,
    votesFalse: 0,
    createdIn: new Date().getFullYear(),
  };

  initialFacts.push(newFact);

  // Render all facts and reset category filter to "All"
  renderFacts(initialFacts);

  categoriesList
    .querySelectorAll("button")
    .forEach((b) => b.classList.remove("active"));
  categoriesList.querySelector(".btn-all-categories").classList.add("active");

  // Clear form fields
  inputText.value = "";
  inputSource.value = "";
  selectCategory.value = "";

  // Reset char count
  charCountSpan.textContent = 200;

  // Hide form and update button text
  form.classList.add("hidden");
  btn.textContent = "share a fact";
});
