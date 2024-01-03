<?php
	require_once($_SERVER['DOCUMENT_ROOT'].'/../protected/template.php');
	
	setup_top("Mean, Median, Mode", "Matthew Miner's Crunching Calculators", '<meta name="description" property="og:description" content="What is an average&quot;? What&apos;s the difference between a mean, a median, and a mode? Confused? Find out here with our original calculator and visualization tool!">
	<link rel="stylesheet" href="css/style.css">
	<link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js" defer></script>
	<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@1.4.0/dist/chartjs-plugin-annotation.min.js" defer></script>
	<script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js" defer></script>
	<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@1.0.0/dist/chartjs-adapter-moment.min.js" defer></script>
	<script src="js/main.js" defer></script>');
?>
		<main>
			<a class="button above" href="..">Back</a>
			<section>
				<h2>Mean, Median, Mode</h2>
				<p>What is an "average"? What's the difference between a mean, a median, and a mode? Confused? Find out here with our original calculator and visualization tool!</p>
			</section>
			<details open>
				<summary>Data <a id="input-link" href="/"></a></summary>
				<textarea id="data-box" rows="4">1, 1, 1, 2, 3, 4, 4.5, 5, 7, 8, 50</textarea>
			</details>
			<section>
				<div class="comparison-container">
					<div>
						<h2>Mean <a href="mean" class="about-link">(About)</a></h2>
						<div class="result-container" id="mean">
							<canvas></canvas>
							<div class="list"></div>
							<div class="answer"></div>
						</div>
						<div id="mean-math"></div>
					</div>
					<div>
						<h2>Median <a href="median" class="about-link">(About)</a></h2>
						<div class="result-container" id="median">
							<canvas></canvas>
							<div class="list"></div>
							<div class="answer"></div>
						</div>
					</div>
					<div>
						<h2>Mode<span id="mode-pluralizer">s</span> <a href="mode" class="about-link">(About)</a></h2>
						<div class="result-container" id="mode">
							<canvas></canvas>
							<div class="list"></div>
							<div class="answer"></div>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div>
					<h2>Chart</h2>
					<canvas id="chart"></canvas>
				</div>
			</section>
			<noscript>
				<section>
					<p>Sorry, this visualizer requires JavaScript enabled to function properly. You can still see text definitions at these links, however:</p>
					<ul>
						<li><a href="mean">Mean</a></li>
						<li><a href="median">Median</a></li>
						<li><a href="mode">Mode</a></li>
					</ul>
				</section>
			</noscript>
		</main>
<?php
	setup_bottom();
?>