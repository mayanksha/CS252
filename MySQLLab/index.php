<html>
<body>

<?php
$servername = "127.0.0.1";
$username = "cs252";
$password = "secret";
$dbname = "employees";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$query_ID = $_POST["ID"];
$query_dept_name = $_POST["dept_name"];
$query_name = $_POST["name"];

if($query_ID)
{
    $sql = 'select * from employees,dept_emp where employees.emp_no = dept_emp.emp_no && employees.emp_no REGEXP '.$query_ID;
}
else if($query_dept_name)
{
    $sql = 'select * from employees,dept_emp where employees.emp_no = dept_emp.emp_no && dept_emp.dept_no REGEXP "'.$query_dept_name. '"';
}
else if($query_name)
{
    $sql = 'select * from employees,dept_emp where employees.emp_no = dept_emp.emp_no && employees.last_name REGEXP "'.$query_name. '"';
}

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
     "--------------------------------<br>";
}

$conn->close();
?>

</body>
</html>
