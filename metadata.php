<?php
	$doc = new DOMDocument();
	$doc->loadHTMLFile("http://95.31.25.212:8000/");
	
	$finder = new DomXPath($doc);
	$classname = 'streamdata';
	$nodes = $finder->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $classname ')]");
	
	echo json_encode(array(
		'metadata' => $nodes->item($nodes->length-1)->nodeValue
	));
?>
	