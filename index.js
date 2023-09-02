const textareaMatches = document.getElementById("matches-textarea");
const textareaGroup = document.getElementById("groups-textarea");
const textareaInput = document.getElementById("input-textarea");
const inputUrl = document.getElementById("url-input");
const inputRegex = document.getElementById("regex");
const buttonFetch = document.getElementById("fetch-button");
const showError = (error) => (textareaMatches.value = error);

function matchRegex(regex) {
	const input = textareaInput.value;
	const matches = input.matchAll(regex);

	let next = matches.next();
	textareaMatches.value = textareaGroup.value = next.done ? "no matches" : "";

	while (!next.done) {
		const match = next.value;

		textareaMatches.value += match[0] + "\n";
		textareaGroup.value += match[1] + "\n";

		next = matches.next();
	}
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
		matchRegex(inputRegex.value);
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
			matchRegex(inputRegex.value);
		})
		.catch(showError)
		.then(() => (buttonFetch.disabled = false));
});

inputRegex.addEventListener("input", (e) => {
	const regex = e.target.value;
	matchRegex(regex);
});
