<?php
/*
//CREATE DATABASE ejercicioGit;

CREATE TABLE empleados (
    usuario VARCHAR(50) PRIMARY KEY,
    contraseña VARCHAR(50) NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL
);

INSERT INTO empleados (usuario, contraseña, salario_base)
VALUES 
('juan', '1234', 1500),
('manolo', '1234', 1750),
('paco', '1234', 2000);
*/

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ejercicioGit";

$conn = new mysqli($servername, $username, $password, $dbname, 3307);

// Variable para saber si el login fue correcto
$login = false;
$mensaje = "";

//Esto es pa que solo se ejecute el codigo cuando se invie el formulario(este se envia por post por eso el == post)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $contraseña = $_POST['contraseña'];

    $sql = "SELECT * FROM empleados WHERE usuario='$usuario' AND contraseña='$contraseña'";
    $resultado = $conn->query($sql);

    //num_row debuelve numero de filas y si es igual a 0 es que no hay ninguna fila con los datos metidos
    if ($resultado->num_rows > 0) {
        //coje la fila y la transforma en un array asociativo
        $fila = $resultado->fetch_assoc();
        $login = true;
        $mensaje = "<h3>Bienvenido, " . $fila['usuario'] . "</h3>
                    <p>Tu salario base es: $" . $fila['salario_base'] . "</p>";
    } else {
        $mensaje = "<h3>Usuario o contraseña incorrectos</h3>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login simple</title>
</head>
<body>
    <?php
    echo $mensaje;
    //Si no logeado dentro del if el formulario
    if (!$login) {
    ?>
        <h2>Iniciar sesión</h2>
        <form method="POST" action="">
            <label>Usuario:</label>
            <input type="text" name="usuario" required><br><br>

            <label>Contraseña:</label>
            <input type="password" name="contraseña" required><br><br>

            <input type="submit" value="Entrar">
        </form>
    <?php
    } else {
        //href vacio para recargar la pagina
        echo "<br><a href=''>Cerrar sesión</a>";
    }
    ?>
</body>
</html>