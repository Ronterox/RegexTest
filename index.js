const resultTextarea = document.getElementById("result-textarea");
const urlInput = document.getElementById("url-input");
const inputTextarea = document.getElementById("input-textarea");
const regexInput = document.getElementById("regex");
const showError = (error) => (resultTextarea.value = error);

const defaultUrl = "https://listado.mercadolibre.com.ve/portaminas-delguard";
const defaultRegex = 'class="ui-search-item__title shops__item-title">(.+?)</h2>';

fetch("mercado.html").then(async (response) => {
	urlInput.value = defaultUrl;
	regexInput.value = defaultRegex;
	inputTextarea.value = await response.text();
	matchRegex(defaultRegex);
});

function matchRegex(regex) {
	const input = inputTextarea.value;
	const matches = input.match(regex);
	if (!matches) return (resultTextarea.value = "no matches");
	resultTextarea.value = matches[0];
	for (let i = 1; i < matches.length; i++) {
		resultTextarea.value += `\t\t\t${matches[i]}`;
	}
}

document.getElementById("fetch-button").addEventListener("click", () => {
	resultTextarea.value = "";
	fetch(urlInput.value)
		.then(async (response) => (inputTextarea.value = await response.text()))
		.catch(showError);
});

regexInput.addEventListener("input", (e) => {
	const regex = e.target.value;
	matchRegex(regex);
});
