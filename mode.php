<?php
	require_once($_SERVER['DOCUMENT_ROOT'].'/../protected/template.php');
	
	setup_top("Mode", "Matthew Miner's Crunching Calculators");
?>
		<main>
			<a class="button above" href=".">Back</a>
			<section>
				<h2>Mode</h2>
				<p>A mode is which item shows up the most times. The actual values do not matter.</p>
				<p>A mode is found by counting how many times each item appears in a list and then picking the most frequent.</p>
				<p>For example, if you have the numbers "1, 3, 3, 6, 7, 7, 7", you would count each:</p>
				<ul>
					<li>1: 1</li>
					<li>3: 2</li>
					<li>6: 1</li>
					<li>7: 3</li>
				</ul>
				<p>You would then see that 7, which 3 appearances is the mode of the list.</p>
				<p>Modes are not explicitly used very often, but they can be useful to figure out the most popular item when compromise is not wanted. For example, a shoe maker might take the mode of shoe sizes purchased to find out what item to produce and market most heavily. In such cases, you do not want to make a bunch of the wrong shoe size just because it's close to everyone's sizes. You would want to fit your customer's needs exactly.</p>
				<p>Modes can also be used for nominal data (things other than numbers). For example, you could take the mode of ordered flavors of donuts to find out what flavor is most popular.</p>
			</section>
		</main>
<?php
	setup_bottom();
?>