<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login simple</title>
</head>
<body>
    <h2>Iniciar sesión</h2>

    <form method="POST" action="">
        <label for="usuario">Usuario:</label><br>
        <input type="text" id="usuario" name="usuario" required><br><br>

        <label for="contrasena">Contraseña:</label><br>
        <input type="password" id="contrasena" name="contrasena" required><br><br>

        <input type="submit" value="Ingresar">
    </form>

    <?php if (!empty($mensaje)) echo "<p><strong>$mensaje</strong></p>"; ?>
</body>
</html>