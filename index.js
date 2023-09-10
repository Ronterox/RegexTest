const textareaMatches = document.getElementById("matches-textarea");
const textareaGroup = document.getElementById("groups-textarea");
const textareaInput = document.getElementById("input-textarea");
const inputUrl = document.getElementById("url-input");
const inputRegex = document.getElementById("regex");
const buttonFetch = document.getElementById("fetch-button");
const showError = (error) => (textareaMatches.value = error);
const divRegexSymbols = document.getElementById("regex-symbols");

const regexSymbols = {
	"\\d": "any digit",
	"\\D": "any non digit character",
	".": "any character",
	"\\.": "period",
	"[abc]": "only a,b or c",
	"[^abc]": "not a,b, nor c",
	"[a-z]": "from a to z",
	"[0-9]": "from	0 to 9",
	"\\w": "any alphanumeric character",
	"\\W": "any non alphanumeric character",
	"\\s": "any whitespace character",
	"\\S": "any non whitespace character",
	"\\b": "word boundary",
	"\\B": "non word boundary",
	"^": "beginning of string",
	$: "end of string",
	"a|b": "match a or b",
	"(...)": "group",
	"{m}": "m repetitions of pattern",
	"{m, n}": "m to n repetitions of pattern",
	"+": "one or more amount of characters",
	"*": "any amount of characters",
};

function matchRegex(regex = inputRegex.value) {
	if (!regex) return (textareaMatches.value = textareaGroup.value = "no matches");

	const input = textareaInput.value;
	const matches = input.matchAll(regex);

	let next = matches.next();
	let matchesString = "",
		groupsString = "";
	matchesString = groupsString = next.done ? "no matches" : "";

	while (!next.done) {
		const match = next.value;

		matchesString += match[0] + "\n";
		groupsString += (match[1] || "") + "\n";

		next = matches.next();
	}

	textareaMatches.value = matchesString;
	textareaGroup.value = groupsString;
}

for (const button of document.getElementsByClassName("copy-button")) {
	const textarea = button.nextElementSibling;
	button.addEventListener("click", () => {
		navigator.clipboard.writeText(textarea.value);
		button.classList.add("animate");
		button.textContent = "Copied!";
	});
	button.addEventListener("animationend", () => {
		button.classList.remove("animate");
		button.textContent = "Copy";
	});
}

document.addEventListener("dragover", (e) => {
	e.preventDefault();
	document.body.style.opacity = 0.5;
});

document.addEventListener("dragleave", (e) => {
	e.preventDefault();
	document.body.style.opacity = 1;
});

document.addEventListener("drop", (e) => {
	e.preventDefault();
	document.body.style.opacity = 1;
	const file = e.dataTransfer.files[0];
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		textareaInput.value = reader.result;
		inputUrl.value = file.name + " (Success)";
		matchRegex();
	});
	inputUrl.value = file.name;
	reader.readAsText(file);
});

buttonFetch.addEventListener("click", () => {
	textareaMatches.value = "";
	buttonFetch.disabled = true;
	fetch(inputUrl.value)
		.then(async (response) => {
			console.log(response);
			textareaInput.value = await response.text();
			matchRegex();
		})
		.catch(showError)
		.then(() => (buttonFetch.disabled = false));
});

inputRegex.addEventListener("input", (e) => {
	const regex = e.target.value;
	matchRegex(regex);
});

for (const [symbol, description] of Object.entries(regexSymbols)) {
	const div = document.createElement("div");
	div.classList.add("regex-symbol");
	div.innerHTML = `<span class="symbol">${symbol}</span> <span class="description">${description}</span>`;

	const spanSymbol = div.getElementsByClassName("symbol")[0];
	const spanDescription = div.getElementsByClassName("description")[0];

	spanSymbol.addEventListener("click", () => {
		inputRegex.value += symbol;
		inputRegex.focus();
	});

	spanSymbol.addEventListener("mouseover", () => {
		spanDescription.style.display = "block";
		matchRegex();
	});

	spanSymbol.addEventListener("mouseout", () => {
		spanDescription.style.display = "none";
		matchRegex();
	});

	divRegexSymbols.appendChild(div);
}
