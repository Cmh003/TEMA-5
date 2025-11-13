document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("btnCalcular");
    if (btn) {
        btn.addEventListener("click", function() {
            const salarioBase = parseFloat(document.getElementById("salarioBase").textContent);
            const salarioAnual = salarioBase * 12;
            document.getElementById("salarioAnual").textContent = salarioAnual.toFixed(2);
        });
    }
});