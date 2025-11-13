<?php
require 'conexion.php';
require 'Empleado.php';


$sql = "SELECT nombre, apellidos, salarioBase, tipo FROM empleados";
$stmt = $conexion->prepare($sql);
$stmt->execute();
$empleados = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($empleados as $row) {
    switch ($row['tipo']) {
        case 'gerente':
            $empleado = new Gerente($row['nombre'], $row['apellidos'], $row['salarioBase']);
            break;
        case 'vendedor':
            $empleado = new Vendedor($row['nombre'], $row['apellidos'], $row['salarioBase']);
            break;
        default:
            $empleado = new Empleado($row['nombre'], $row['apellidos'], $row['salarioBase']);
    }

    echo "<b>" . $empleado->mostrarNombreApellidos() . "</b> - ";
    echo "Salario anual: " . number_format($empleado->calcularSalarioAnual(), 2, ',', '.') . "<br>";
}
?>
