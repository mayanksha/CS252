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

$query_dept_no = $_POST["dept_no4"];
$sql = 'select sum(case when `gender` = "F" then salaries.salary else 0 end)/sum(salaries.salary) as male_ratio FROM employees,dept_emp,salaries where employees.emp_no = dept_emp.emp_no && employees.emp_no = salaries.emp_no && dept_emp.dept_no="'.$query_dept_no.'"';

$retval = $conn->query($sql);

if(! $retval ) {
  die('Could not get data_1: ' . mysqli_error());
}

while($row = $retval->fetch_assoc()) {
  echo "Ratio of salaries of M/Total Salary : {$row['male_ratio']}  <br> ";
}

$conn->close();
?>

</body>
</html>
