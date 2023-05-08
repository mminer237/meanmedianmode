// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat

"use strict";

const inputLink = document.getElementById("input-link");
const dataBox = document.getElementById("data-box");
const meanContainer = document.getElementById("mean");
const meanMath = document.getElementById("mean-math");
const medianContainer = document.getElementById("median");
const modeContainer = document.getElementById("mode");
const modePluralizer = document.getElementById("mode-pluralizer");
dataBox.addEventListener("input", updateResults);
window.addEventListener("load", updateResults);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("input"))
	dataBox.value = urlParams.get("input");
let type = "number";
if (urlParams.has("type"))
	type = urlParams.get("type");

const timeFormatter = new Intl.DateTimeFormat([], { hour: 'numeric', minute:'numeric' });

function formatItem(x) {
	switch (type) {
		case "time":
			return timeFormatter.format(new Date(+x));
		case "number":
		default:
			return +x;
	}
}

function updateResults() {
	const numbers = dataBox.value
		.split(/[\s,]+/)
		.map(x => x.trim())
		.filter(x => x.length > 0 && !isNaN(+x) && (type !== "time" || +x > 1000000000))
		.map(x => {
			if (type === "time") {
				if (x < 2000000000)
					x *= 1000;
				x = Math.round(x / 60000) * 60000;
			}
			return +x;
		})
		.sort((a, b) => a - b);

	if (numbers.length === 0) {
		document.querySelectorAll(".list").forEach(x => x.innerText = "");
		document.querySelectorAll(".answer").forEach(x => x.innerText = "");
		meanMath.innerText = "";
		document.querySelectorAll('.comparison-container canvas').forEach(x => resetCanvas(x));
		if (chart)
			chart.destroy();
		return;
	}
	
	let numbersList = "";
	for (let i = 0; i < numbers.length; i++) {
		numbersList += `<div${type !== "number" ? ` data-value="${numbers[i]}"` : ""}>${formatItem(numbers[i])}</div>`;
	}

	inputLink.href = `/?${type !== "number" ? `type=${type}&` : ""}input=${numbers.join(",")}`;

	const numbersSum = numbers.reduce((a, b) => a + b, 0);
	const meanResult = mean(numbers);
	fill(meanContainer, numbersList, meanResult);
	meanMath.innerHTML = `<math>
			<mo title="Sum">&sum;</mo>
			<mo>=</mo>
			<mn>${numbersSum}</mn>
		</math>
		<math>
			<mn>${numbersSum}</mn>
			<mo>÷</mo>
			<mn>${numbers.length}</mn>
			<mo>=</mo>
			<mn>${round(meanResult)}</mn>
		</math>`;

	const medianResult = median(numbers);
	fill(medianContainer, numbersList, medianResult);

	let modeResult = mode(numbers);
	if (isNaN(modeResult)) {
		modePluralizer.style.display = "inline";
		for (let i = 0; i < modeResult.length; i++) {
			switch (type) {
				case "number":
					modeResult[i] = round(modeResult[i]);
					break;
				case "time":
					modeResult[i] = formatItem(modeResult[i]);
					break;
				default:
					break;
			}
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
	if (!isNaN(result)) {
		if (type === "number")
			resultContainer.querySelector(".answer").innerText = round(result);
		else
			resultContainer.querySelector(".answer").innerText = formatItem(result);
	}
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
	}
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
			const listNumber = type === "time" ? listElements[listIndex].dataset.value : listElements[listIndex].innerText;
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
	const color = getComputedStyle(document.body).getPropertyValue('--highlighted-color');
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
	const pairedData = [];
	for (let key in data) {
		pairedData.push([+key, +data[key]]);
	}
	pairedData.sort((a, b) => a[0] - b[0]);

	const lineColor = getComputedStyle(document.body).getPropertyValue('--highlighted-color');
	const textColor = getComputedStyle(document.body).getPropertyValue('--text-color');

	let results = { [mean]: "Mean" };

	if (results[median])
		results[median] += " & Median";
	else
		results[median] = "Median";

	for (let i = 0; i < mode.length; i++)
		if (results[mode[i]])
			results[mode[i]] += " & Mode";
		else
			results[mode[i]] = "Mode";

	const annotations = [];
	for (let x in results)
		annotations.push({
			type: 'line',
			scaleID: 'x',
			label: {
				backgroundColor: lineColor,
				color: textColor,
				content: results[x],
				enabled: true,
				font: {
					family: "'Lato', sans-serif",
					size: 14
				},
				rotation: 'auto'
			},
			borderColor: lineColor,
			borderWidth: 3,
			value: +x
		});

	chart = new Chart(document.getElementById("chart").getContext('2d'), {
		type: 'scatter',
		data: {
			datasets: [{
				data: pairedData,
				backgroundColor: darkMode ? getComputedStyle(document.body).getPropertyValue('--primary-color') : getComputedStyle(document.body).getPropertyValue('--darkish-primary-color'),
				pointHoverRadius: 5,
				pointRadius: 5,
			}]
		},
		options: {
			plugins: {
				annotation: {
					annotations: annotations
				},
				legend: {
					display: false
				},
				tooltip: {
					callbacks: {
						title: (tooltip, data) => {
							return `Number of ${tooltip[0].label}s`;
						},
						label: (tooltip, data) => tooltip.formattedValue
					}
				}
			},
			responsive: true,
			scales: {
				x: type === "time" ? {
					type: 'time',
					min: Math.floor(pairedData[0][0] / 3600000) * 3600000,
					time: {
						stepSize: 60,
						unit: 'minute'
					}
				} : {
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

// @license-end
