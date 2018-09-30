<?php 
	if (!empty($_POST['first'])){
		echo "First";
	}
	if (!empty($_POST['second'])){
		echo "Second";
	}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>CS252 Lab 4</title>
<script>
	function show(val){
	val = val.id
	if (val == 'first'){
		elem = document.getElementById('one');
		elem2 = document.getElementById('first');
	elem.style.display = "";
	elem2.style.display = "none";
}
else if (val == 'sec'){
		elem = document.getElementById('two');
		elem2 = document.getElementById('sec');
	elem.style.display = "";
	elem2.style.display = "none";
}
else if (val == 'third'){
		elem = document.getElementById('three');
		elem2 = document.getElementById('third');
	elem.style.display = "";
	elem2.style.display = "none";
}
	console.log(val);
}	
</script>
</head>
<body>
</body>

<h3>The Police Station with  slowest response time to an FIR:</h3><br>
<?php
	echo "<form onsubmit='return false' onsubmit='return false' ;
		action='index.php/first'><button id='first' onclick='show(this)'>Click here to know</button></form>";
require_once __DIR__ . "/vendor/autoload.php";
$conn = (new MongoDB\Client)->cs252;
$coll = $conn->fir;

class PolStn{
	public $timeDiff;
	public $id;
}

$a = new PolStn();
$a->timeDiff = -11111;
$a->id = 'lsdjvldj';
$pol = array($a);

function printArray($array){
	foreach($array as $p){
		echo $p, ", ";
	}
}
function max_attribute_in_array($array, $prop) {
	$temp = max(array_map(function($o) use($prop) {
                            return $o->$prop;
                         },
							 $array));
	$idVal = '';
	foreach($array as $p){
		if ($p->timeDiff == $temp){
			$idVal = $p->id;
			break;
		}
	}
	return $idVal;
}
$laws = array();
$districts = array();
$cursor = $coll->find([]);
foreach ($cursor as $document){
	$regDate = DateTime::createFromFormat('d-m-Y H:i:s',$document['Registered_Date']);
	$regTS = strtotime($regDate);
	$frTS = strtotime($document['CS_FR_Date']);
	$diff = $frTS-$regTS;

	foreach($document['Act_Section'] as $foo){
		if ($foo != 'unknown') {
			if (array_key_exists($foo, $laws)){
				$laws[$foo] += 1;
			}
			else {
				$laws[$foo] = 0;
			}
		}
	}
	$temp = new PolStn();
	$temp->timeDiff = $diff;
	$temp->id = $document['_id'];
	if (array_key_exists($document['DISTRICT'], $districts )){
		$districts[$document['DISTRICT']]	+= 1;
	}
	else {
		$districts[$document['DISTRICT']] = 0;
	}
	array_push($districts, $document['DISTRICT']);
	array_push($pol, $temp);
}

echo "<div id='one' style='display:none'>";
$maxID = max_attribute_in_array($pol, 'timeDiff');
$cursor = $coll->findOne(['_id' => $maxID]);
echo "<b>FIR Number</b>:	", $cursor['FIR_REG_NUM'], "<br>"; 
echo "<b>Police Station</b>:	", $cursor['PS'], "<br>"; 
echo "<b>District</b>:	", $cursor['DISTRICT'], "<br>"; 
echo "<b>Zone_Name</b>:	", $cursor['ZONE_NAME'], "<br>"; 
echo "<b>Status</b>:	", $cursor['Status'], "<br>"; 
echo "<b>Act_Section</b>:	"; 
printArray($cursor['Act_Section']);
echo "<hr>"; 
echo "</div>";

$keyArr = array_keys($laws);
$max = 0;
$maxLaw = "";
foreach($keyArr as $a){
	if ($laws[$a] > $max){
		$maxLaw = $a;
		$max = $laws[$a];
	}
}
$min = 10000;
$minLaw = "";
/*for ($i = 0; $i <= sizeof($keyArr); $i++){
 *  [>echo $keyArr[$i], "\n";<]
 *}*/
foreach($keyArr as $a){
	if ($laws[$a] < $min && $laws[$a] > 0){
		$minLaw = $a;
		$min = $laws[$a];
	}
}
$keyArr = array_keys($districts);
$max = 0;
$maxDist = "";
foreach($keyArr as $a){
	if ($districts[$a] > $max){
		$maxDist = $a;
		$max = $districts[$a];
	}
}
echo "<h3>Most and least uniquely applied FIRs</h3>";
echo "<form onsubmit='return false' method='post' action='index.php/second'><button id='sec' onclick='show(this)'>Click here to know</button></form>";
echo "<div id='two' style='display:none'>";
	echo "<h3>The Act Section which has been violated most is :</h3><br>";
	echo "<b>Section $maxLaw - Criminal Intimidation</b>";
	echo "<h3>The Act Section which has been violated least is :</h3><br>";
	echo "<b>Section $minLaw = $min number of times</b>";
	echo "<hr>";
echo "</div>";
echo "<h3>The District with maximum number of FIRs registered: <br></h3>";
echo "<div id='three' style='display:none'>";
echo "<b>$maxDist = $max FIRs have been registered!";
echo "</div>";
echo "<button id='third' onclick='show(this)'>Click here to know</button>";
?>
</html>
