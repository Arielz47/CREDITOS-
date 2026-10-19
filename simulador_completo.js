// Taller de simulación de crédito - Parte 1.
// Los datos se conservan en memoria hasta recargar o cerrar la página.
let clientes = [];
let tasaInteres = 15;
let clienteSeleccionado = null;

function ocultarSecciones() {
  document.querySelectorAll("section").forEach(function(seccion) {
    seccion.classList.remove("activa");
  });
}

function mostrarSeccion(id) {
  const seccion = document.getElementById(id);
  if (!seccion || seccion.tagName !== "SECTION") return;
  ocultarSecciones();
  seccion.classList.add("activa");
}

function guardarTasa() {
  const texto = recuperaraTexto("tasaInteres").trim();
  const tasa = Number(texto);
  if (texto === "" || !Number.isFinite(tasa) || tasa < 10 || tasa > 20) {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    return;
  }
  tasaInteres = tasa;
  mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
}

function buscarCliente(cedula) {
  return clientes.find(function(cliente) {
    return cliente.cedula === cedula;
  }) || null;
}

function guardarCliente() {
  const cedula = clienteSeleccionado ? clienteSeleccionado.cedula : recuperaraTexto("cedula").trim();
  const nombre = recuperaraTexto("nombre").trim();
  const apellido = recuperaraTexto("apellido").trim();
  const textoIngresos = recuperaraTexto("ingresos").trim();
  const textoEgresos = recuperaraTexto("egresos").trim();
  const ingresos = Number(textoIngresos);
  const egresos = Number(textoEgresos);
  if (!cedula || !nombre || !apellido || !textoIngresos || !textoEgresos) {
    mostrarTexto("mensajeCliente", "Complete todos los campos.");
    return;
  }
  if (!Number.isFinite(ingresos) || !Number.isFinite(egresos) || ingresos < 0 || egresos < 0) {
    mostrarTexto("mensajeCliente", "Ingresos y egresos deben ser números mayores o iguales a cero.");
    return;
  }
  const existente = buscarCliente(cedula);
  if (existente) {
    // La cédula identifica al cliente y nunca se modifica al actualizar.
    existente.nombre = nombre;
    existente.apellido = apellido;
    existente.ingresos = ingresos;
    existente.egresos = egresos;
  } else {
    clientes.push({cedula, nombre, apellido, ingresos, egresos});
  }
  pintarClientes();
  limpiar();
  mostrarTexto("mensajeCliente", existente ? "Cliente actualizado correctamente." : "Cliente registrado correctamente.");
}

function pintarClientes() {
  const tabla = document.getElementById("tablaClientes");
  tabla.replaceChildren();
  clientes.forEach(function(cliente) {
    const fila = document.createElement("tr");
    [cliente.cedula, cliente.nombre, cliente.apellido,
      cliente.ingresos.toFixed(2), cliente.egresos.toFixed(2)].forEach(function(valor) {
      const celda = document.createElement("td");
      // textContent evita interpretar como HTML los datos del formulario.
      celda.textContent = valor;
      fila.appendChild(celda);
    });
    const acciones = document.createElement("td");
    const boton = document.createElement("button");
    boton.textContent = "Actualizar";
    boton.addEventListener("click", function() {
      seleccionarCliente(cliente.cedula);
    });
    acciones.appendChild(boton);
    fila.appendChild(acciones);
    tabla.appendChild(fila);
  });
}

function seleccionarCliente(cedula) {
  const cliente = buscarCliente(cedula);
  if (!cliente) {
    mostrarTexto("mensajeCliente", "Cliente no encontrado.");
    return;
  }
  clienteSeleccionado = cliente;
  ["cedula", "nombre", "apellido", "ingresos", "egresos"].forEach(function(campo) {
    mostrarTextoEnCaja(campo, cliente[campo]);
  });
  document.getElementById("cedula").readOnly = true;
  mostrarTexto("btnGuardarCliente", "Guardar cambios");
  mostrarTexto("mensajeCliente", "Edite los datos y pulse Guardar cambios. La cédula no se modifica.");
}

function limpiar() {
  ["cedula", "nombre", "apellido", "ingresos", "egresos"].forEach(function(campo) {
    mostrarTextoEnCaja(campo, "");
  });
  clienteSeleccionado = null;
  document.getElementById("cedula").readOnly = false;
  mostrarTexto("btnGuardarCliente", "Guardar cliente");
  mostrarTexto("mensajeCliente", "");
}
pintarClientes();
