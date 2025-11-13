<?php

class Empleado {
    public $nombre;
    public $apellidos;
    public $salarioBase;

    public function __construct($nombre, $apellidos, $salarioBase) {
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->salarioBase = $salarioBase;
    }

    public function mostrarNombreApellidos() {
        echo "{$this->nombre} {$this->apellidos}";
    }

    public function calcularSalarioAnual() {
        return $this->salarioBase * 12;
    }
}

class Gerente extends Empleado {
    public $bonoGerente = 0.10; 

    public function calcularSalarioAnual() {
        $salarioBaseAnual = parent::calcularSalarioAnual();
        return $salarioBaseAnual + ($salarioBaseAnual * $this->bonoGerente);
    }
}

class Vendedor extends Empleado {
    public $bonoVendedor;

    public function __construct($nombre, $apellidos, $salarioBase) {
        parent::__construct($nombre, $apellidos, $salarioBase);
        $this->bonoVendedor = rand(0, 10) / 100;
    }

    public function calcularSalarioAnual() {
        $salarioBaseAnual = parent::calcularSalarioAnual();
        return $salarioBaseAnual + ($salarioBaseAnual * $this->bonoVendedor);
    }
}


$gerente = new Gerente("Ana", "Pérez", 3000);
$vendedor = new Vendedor("Luis", "Gómez", 1500);

echo "Gerente: ";
$gerente->mostrarNombreApellidos();
echo " - Salario anual: " . $gerente->calcularSalarioAnual() . " €<br>";

echo "Vendedor: ";
$vendedor->mostrarNombreApellidos();
echo " - Salario anual: " . $vendedor->calcularSalarioAnual() . " €<br>";

?>
