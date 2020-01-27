"use strict"

const dataBox = document.getElementById("data-box");
const meanContainer = document.getElementById("mean");
const medianContainer = document.getElementById("median");
const modeContainer = document.getElementById("mode");
const modePluralizer = document.getElementById("mode-pluralizer");
dataBox.addEventListener("input", updateResults);
updateResults();

function updateResults() {
	const numbers = dataBox.value.split(",").map(x => x.trim()).filter(x => x.length > 0 && !isNaN(x)).map(x => x * 1).sort((a, b) => a - b);
	let numbersList = "";
	for (let i = 0; i < numbers.length; i++) {
		numbersList += `<div>${numbers[i]}</div>`;
	}
	fill(meanContainer, numbersList, mean(numbers));
	fill(medianContainer, numbersList, median(numbers));
	let modeResult = mode(numbers);
	if (isNaN(modeResult)) {
		modePluralizer.style.display = "inline";
		for (let i = 0; i < modeResult.length; i++) {
			modeResult[i] = round(modeResult[i]);
		}
	}
	else
		modePluralizer.style.display = "none";
	fill(modeContainer, numbersList, modeResult.join(" & "), modeResult);
}

function round(number) {
	let roundedNumber = Math.round(number * 100) / 100;
	if (roundedNumber == number)
		return roundedNumber;
	else
		return '~' + roundedNumber;
}

function fill(resultContainer, numbersList, result, rawResult = result) {
	resultContainer.querySelector(".list").innerHTML = numbersList;
	if (!isNaN(result))
		resultContainer.querySelector(".answer").innerText = round(result);
	else
		resultContainer.querySelector(".answer").innerText = result;
	
	visualize(resultContainer, rawResult);
}

function mean(numbers) {
	const sum = numbers.reduce((a, b) => a + b, 0);
	return sum / numbers.length;
}

function median(numbers) {
	if (numbers.length % 2 != 0)
		return numbers[Math.floor(numbers.length / 2)];
	else {
		const upperMiddle = numbers.length / 2;
		return (numbers[upperMiddle - 1] + numbers[upperMiddle]) / 2;
	}
}

function mode(numbers) {
	const dict = {};
	for (let i = 0; i < numbers.length; i++) {
		if (!dict[numbers[i]])
			dict[numbers[i]] = 1;
		else
			dict[numbers[i]]++;
	}
	let most = 0;
	let mostIndexes = [];
	for (const i in dict) {
		if (dict[i] > most) {
			most = dict[i];
			mostIndexes = [i];
		}
		else if (dict[i] == most) {
			mostIndexes.push(i);
		}
	};
	return mostIndexes;
}

function visualize(resultContainer, results) {
	const listElements = Array.from(resultContainer.querySelectorAll(".list>div"));
	if (!isNaN(results))
		results = [results];

	for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
		const result = results[resultIndex];
		for (let listIndex = 0; listIndex < listElements.length; listIndex++) {
			const listNumber = listElements[listIndex].innerText;
			if (result == listNumber) {
				highlight(listElements[listIndex], resultContainer);
			}
		}
	}
}

function highlight(element, resultContainer) {
	element.classList.add("highlighted");
}