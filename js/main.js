"use strict";

const dataBox = document.getElementById("data-box");
const meanContainer = document.getElementById("mean");
const medianContainer = document.getElementById("median");
const modeContainer = document.getElementById("mode");
const modePluralizer = document.getElementById("mode-pluralizer");
dataBox.addEventListener("input", updateResults);
window.addEventListener("load", updateResults);

function updateResults() {
	const numbers = dataBox.value.split(",").map(x => x.trim()).filter(x => x.length > 0 && !isNaN(x)).map(x => x * 1).sort((a, b) => a - b);
	let numbersList = "";
	for (let i = 0; i < numbers.length; i++) {
		numbersList += `<div>${numbers[i]}</div>`;
	}
	const meanResult = mean(numbers);
	fill(meanContainer, numbersList, meanResult);

	const medianResult = median(numbers);
	fill(medianContainer, numbersList, medianResult);

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

	if (Chart)
		drawChart(numbers, meanResult, medianResult, modeResult);
	else
		console.log("The Chart.js library failed to load.");
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

	resetCanvas(resultContainer.querySelector('canvas'));
	for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
		const result = results[resultIndex];
		let bigger = true;
		let exact = false;
		let position = -1;
		for (let listIndex = 0; listIndex < listElements.length; listIndex++) {
			const listNumber = listElements[listIndex].innerText;
			if (result == listNumber) {
				exact = true;
				highlight(listElements[listIndex], resultContainer);
			}
			else if (bigger && listNumber > result) {
				bigger = false;
				position = listIndex - 1;
			}
		}
		if (!exact)
			drawLineAfterElement(resultContainer, position == -1 ? null : listElements[position]);
	}
}

function highlight(element, resultContainer) {
	element.classList.add("highlighted");
	drawLineToElement(resultContainer, element);
}

function resetCanvas(canvas) {
	canvas.height = canvas.offsetHeight;
	canvas.width = canvas.offsetWidth;
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function drawLineAfterElement(resultContainer, element) {
	let y;
	if (element) {
		y = element.offsetTop + element.offsetHeight;
	}
	else {
		element = resultContainer.querySelector(".list>div");
		y = element.offsetTop;
	}
	/* Draw diagonal line */
	drawLineToPoint(
		resultContainer,
		element.offsetLeft + element.offsetWidth,
		y
	);

	/* Draw horizontal line */
	drawLine(resultContainer, element.offsetLeft + element.offsetWidth, y, element.offsetLeft, y);
}

function drawLineToElement(resultContainer, element) {
	drawLineToPoint(
		resultContainer,
		element.offsetLeft + element.offsetWidth,
		element.offsetTop + element.offsetHeight / 2
	);
}

function drawLineToPoint(resultContainer, x, y) {
	const answerElement = resultContainer.querySelector(".answer");
	drawLine(
		resultContainer,
		answerElement.offsetLeft + 1,
		answerElement.offsetTop + answerElement.offsetHeight / 2,
		x - 1,
		y,
		true
	);
}

function drawLine(resultContainer, x1, y1, x2, y2, bezier = false) {
	const color = "#7eeee9";
	const lineWidth = 2;

	const canvas = resultContainer.querySelector('canvas');
	const ctx = canvas.getContext('2d');

	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	if (bezier) {
		ctx.bezierCurveTo(
			(x1 + x2) / 2,
			y1,
			(x1 + x2) / 2,
			y2,
			x2,
			y2
		);
	}
	else
		ctx.lineTo(x2, y2);
	ctx.stroke();
}

let chart;
function drawChart(numbers, mean, median, mode) {
	const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (chart)
		chart.destroy();
	const data = numbers.reduce((counts, x) => {
		counts[x] = (counts[x] ?? 0) + 1;
		return counts;
	}, {});
	if (!data[0] && !numbers.some(x => x < 0))
		data[0] = 0;
	const pairedData = [];
	for (let key in data) {
		pairedData.push([+key, +data[key]]);
	}
	pairedData.sort((a, b) => a[0] - b[0]);
	chart = new Chart(document.getElementById("chart").getContext('2d'), {
		type: 'line',
		data: {
			datasets: [{
				data: pairedData,
				backgroundColor: darkMode ? getComputedStyle(document.body).getPropertyValue('--primary-color') : getComputedStyle(document.body).getPropertyValue('--darkish-primary-color')
			}]
		},
		options: {
			plugins: {
				legend: {
					display: false
				},
				tooltip: {
					callbacks: {
						title: (tooltip, data) => {
							return `Number of ${tooltip[0].label}s`;
						}
					}
				}
			},
			responsive: true,
			scales: {
				x: {
					type: 'linear'
				},
				y: {
					beginAtZero: true,
					ticks: {
						precision: 0
					}
				}
			}
		}
	});
}
