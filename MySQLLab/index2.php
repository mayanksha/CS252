<html>
<body>

<?php
$servername = "localhost";
$username = "cs252";
$password = "secret";
$dbname = "employees";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$query_dept_no = $_POST["dept_no2"];

$sql = 'select * from employees,dept_emp where employees.emp_no = dept_emp.emp_no && dept_emp.dept_no="'.$query_dept_no.'" ORDER By hire_date';

$retval = $conn->query($sql);
if(! $retval ) {
  die('Could not get data: ' . mysqli_error());
}

while($row = $retval->fetch_assoc()) {
  echo "dept_no :{$row['dept_no']}  <br> ".
     "emp_no: {$row['emp_no']} <br> ".
     "birth_date: {$row['birth_date']} <br> ".
     "first_name: {$row['first_name']} <br> ".
     "last_name: {$row['last_name']} <br> ".
     "gender: {$row['gender']} <br> ".
     "emp_no: {$row['emp_no']} <br> ".
     "hire_date: {$row['hire_date']} <br> ".
     "--------------------------------<br>";
}
$conn->close();
?>

</body>
</html>
