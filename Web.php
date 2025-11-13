<?php
/*
// BASE DE DATOS ACTUALIZADA
CREATE DATABASE ejercicioGit;

CREATE TABLE empleados (
    usuario VARCHAR(50) PRIMARY KEY,
    contraseña VARCHAR(50) NOT NULL,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    salario_base DECIMAL(10,2) NOT NULL
);

INSERT INTO empleados (usuario, contraseña, nombre, apellido, salario_base)
VALUES 
('juan', '1234', 'Juan', 'Pérez', 1500),
('manolo', '1234', 'Manolo', 'López', 1750),
('paco', '1234', 'Paco', 'Martín', 2000);
*/

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ejercicioGit";

$conn = new mysqli($servername, $username, $password, $dbname, 3307);

$login = false;
$mensaje = "";
$datosUsuario = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $contraseña = $_POST['contraseña'];

    $sql = "SELECT * FROM empleados WHERE usuario='$usuario' AND contraseña='$contraseña'";
    $resultado = $conn->query($sql);

    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        $login = true;
        $datosUsuario = $fila;
    } else {
        $mensaje = "<h3 class='error'>Usuario o contraseña incorrectos</h3>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Empleado</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="container">
        <?php
        if (!$login) {
            echo "<h2>Iniciar sesión</h2>";
            echo $mensaje;
            ?>
            <form method="POST" action="">
                <label>Usuario:</label>
                <input type="text" name="usuario" required>

                <label>Contraseña:</label>
                <input type="password" name="contraseña" required>

                <input type="submit" value="Entrar">
            </form>
            <?php
        } else {
            echo "<h2>Bienvenido, " . $datosUsuario['nombre'] . " " . $datosUsuario['apellido'] . " </h2>";
            echo "<table id='tablaEmpleado'>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Salario Base (€)</th>
                        <th>Salario Anual (€)</th>
                    </tr>
                    <tr>
                        <td>".$datosUsuario['nombre']."</td>
                        <td>".$datosUsuario['apellido']."</td>
                        <td id='salarioBase'>".$datosUsuario['salario_base']."</td>
                        <td id='salarioAnual'>-</td>
                    </tr>
                  </table>";
            echo "<button id='btnCalcular'>Calcular Salario Anual</button>";
        }
        ?>
    </div>

    <script src="script.js"></script>
</body>
</html>