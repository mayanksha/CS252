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

$query_dept_no = $_POST["dept_no"];

$sql = 'select count(*) from employees,dept_emp where employees.emp_no = dept_emp.emp_no && dept_emp.dept_no="'.$query_dept_no. '"';

$retval = $conn->query($sql);

if(! $retval ) {
  die('Could not get data: ' . mysqli_error());
}

while($row = $retval->fetch_assoc()) {
  echo "Number of Employees : {$row['count(*)']}  <br> ";
}
$conn->close();
?>

</body>
</html>
