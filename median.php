<?php
	require_once($_SERVER['DOCUMENT_ROOT'].'/../protected/template.php');
	
	setup_top("Median", "Matthew Miner's Crunching Calculators");
?>
		<main>
			<a class="button above" href=".">Back</a>
			<section>
				<h2>Median</h2>
				<p>A median is the number in the middle of a sorted list. Half the numbers are above it, and half the numbers are below it. Or it's the average of the two middle numbers if there are an even number of numbers in the list.</p>
				<p>To find the mean of an odd number of items, you count the number, subtract one, and then divide by two to get how many numbers are on each side of the median. Then you sort the numbers, count that many numbers off either side, and the number in the middle is your median.</p>
				<p>For example, if you have the numbers "1, 4, 14, 57, 303", you first count that there are 5 numbers, you subtract one and divide by two to find out there are 2 items on each side of the median. So take off two numbers from either side to find that 14 is the median.</p>
				<p>For an even number of items, you subtract two instead. There will also be two numbers in the middle, so you take the <a href="/mean">mean</a> of the two.</p>
				<p>For example, if you have the numbers "2, 7, 13, 108", you count that there are 4 numbers, subtract two and divide by two to find that there's 1 number on each side of the median numbers. Take this number off to learn that 7 and 13 are the median numbers. Take the <a href="/mean">mean</a> of these, and you get the median of 10.</p>
				<p>You probably could do those examples in your head, but doing this method helps you understand the process when you are dealing with thousands or millions of items where you can't just pick out the middle on first sight.</p>
				<p>Medians are extremely useful. Although the <a href="/mean">mean</a> is what we typically think of as an average because it gives us the average value, the median gives us something that is more typical for the most cases.</p>
				<p>For example, if eight people have $0, $1, $2, $3, $4, $5, $6, and $7; and a ninth person has $1,000,000 dollars, the <a href="/mean">mean</a> would say the average is $111,115 per person. This is far from the average case. Most people have almost none. This might be good for some areas where they are all contributing and where the average of the total is what you want, but if you want to actually understand the average person, the median is much more applicable. The median gives us a much more practical answer of $4, which gives us a better picture of the "average person."</p>
			</section>
		</main>
<?php
	setup_bottom();
?>