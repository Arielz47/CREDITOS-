const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
class E{constructor(){this.value='';this.children=[];this.textContent='';this.innerText='';this.className='';this.tags=new Set();this.classList={add:x=>this.tags.add(x),remove:x=>this.tags.delete(x)}}
set value(x){this.v=String(x)}get value(){return this.v}appendChild(x){this.children.push(x)}replaceChildren(){this.children=[];this.textContent=''}addEventListener(t,f){this[t]=f}}
const html=fs.readFileSync(__dirname+'/simulador_completo.html','utf8');
const els=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new E()]));
for(const id of ['clientes','creditos','parametros'])els[id].tagName='SECTION';
const c=vm.createContext({document:{getElementById:id=>els[id],querySelectorAll:()=>['clientes','creditos','parametros'].map(id=>els[id]),createElement:()=>new E()}});
const run=s=>vm.runInContext(s,c);
for(const f of ['utilitarios.js','simulador_completo.js'])run(fs.readFileSync(__dirname+'/'+f,'utf8'));
function fill(o){for(const [id,v] of Object.entries(o))els[id].value=v}
run("mostrarSeccion('creditos')");assert(els.creditos.tags.has('activa'));assert(!els.clientes.tags.has('activa'));
run('calcularCredito()');assert.match(els.resultadoCredito.textContent,/Busque/);
run('buscarClienteCredito()');assert.match(els.datosClienteCredito.textContent,/Ingrese/);
fill({buscarCedulaCredito:'no'});run('buscarClienteCredito()');assert.match(els.datosClienteCredito.textContent,/no encontrado/);
fill({cedula:'0101234567',nombre:'Juan',apellido:'Pérez',ingresos:'1200',egresos:'500'});run('guardarCliente()');assert.equal(run('clientes.length'),1);
fill({buscarCedulaCredito:'0101234567'});run('buscarClienteCredito()');assert.equal(els.datosClienteCredito.children.length,6);
fill({montoCredito:'1200',plazoCredito:'12'});run('calcularCredito()');assert.equal(els.resultadoCredito.className,'aprobado');
assert.equal(run('calcularTotalPagar(1200,15,12)'),1380);assert.equal(run('calcularCuotaMensual(1380,12)'),115);
fill({montoCredito:'12000'});run('calcularCredito()');assert.equal(els.resultadoCredito.className,'rechazado');
for(const [m,p]of [['0','12'],['-5','12'],['1200','0'],['1200','1.5'],['','12'],['1200','']]){fill({montoCredito:m,plazoCredito:p});run('calcularCredito()');assert.match(els.resultadoCredito.textContent,/Ingrese un monto/)}
assert.equal(run('evaluarCredito(115,115)'),true);assert.equal(run('evaluarCredito(-1,115)'),false);
fill({tasaInteres:'20'});run('guardarTasa()');assert.equal(run('tasaInteres'),20);assert.equal(els.resultadoCredito.className,'');
run("seleccionarCliente('0101234567')");fill({ingresos:'1300'});run('guardarCliente()');assert.equal(run('clienteCredito'),null);assert.equal(run('clientes.length'),1);
fill({buscarCedulaCredito:'0101234567'});run('buscarClienteCredito()');run('invalidarBusquedaCredito()');assert.equal(run('clienteCredito'),null);
console.log('PRUEBAS OK: navegación; búsqueda vacía/inexistente/existente; cinco datos; aprobación/rechazo; fórmulas; igualdad; capacidad negativa; montos y plazos inválidos; cambio de tasa y actualización de cliente invalidan resultados; Parte 1 conserva actualización sin duplicados. Pruebas de lógica con DOM de prueba, sin validación visual de navegador.');
