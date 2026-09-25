function elem(elemId){
    return document.getElementById(elemId);
  } 
  //radial check swap
  function swap(a, b){
    document.getElementById(a).checked = false
    document.getElementById(b).checked = true
  }

  isEmpty = (list) => list.length == 0;
  //funcion de mapeo
  isAssoc = () => elem("0").checked == true;
  isDir = () => elem("1").checked == true;
  //memoria principal
  nCellIsEmpty = () => elem("nCell").value == 0;
  cellxBloqIsEmpty = () => elem("CellxBloq").value == 0;
  capMemIsEmpty = () => elem("capMemP").value == 0;
  capCellIsEmpty = () => elem("capCell").value == 0;
  //memoria cache
  nLinesIsEmpty = () => elem("nLines").value == 0;
  capLineIsEmpty = () => elem("capLine").value == 0;
  capCacheIsEmpty = () => elem("capMemC").value == 0;

  //calculos
  safeDiv = (x, y) => {
    if (y === 0) throw new Error("División por cero: capC no puede ser 0.");
    const result = x / y;
    if(result % 1 === 0){ return result;}
    else { throw new Error("revisar valores introducidos");
    }
  }
  safeDivP = (capM, unitM, capC, unitC) => {
    const tob = { b: 1, B: 8, Kb: 8192 };
    const toB = { b: 1/8, B: 1, Kb: 1024 };
    
    if (capC === 0) throw new Error("División por cero");
    const capMB = capM * toB[unitM]
    const capCB = capC * toB[unitC]
    const resB = capMB/capCB

    console.log("B", capMB, capCB, resB)
    if(capMB % 1 === 0 && capCB % 1 === 0 && resB % 1 === 0){ return {m: capMB, c:capCB, unit:'B', r:resB};}
    else{
      const capMb = capM * tob[unitM]
      const capCb = capC * tob[unitC]
      const resb = capMb/capCb
      console.log("bits", resb)
      if(capMb % 1 === 0 && capCb % 1 === 0 && resb % 1 === 0){ return {m: capMb, c:capCb, unit:'b', r:resb};}
      else { throw new Error("revisar valores introducidos");}
    }
  }
  //log
  log2 = (val) => Math.log(val) / Math.log(2);

  calcAssocS = (temp) => {//calculo de assoc con toda la info
    if(isEmpty(temp) && checkAssocS()){
      const ncell = elem("nCell").value;
      const cxb = elem("CellxBloq").value;
      const tag = safeDiv(ncell, cxb);
      temp.push(
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" , 
        "Tag(nro de blq) = n cell / cell x blq = "+ncell+" / "+cxb+" = "+tag+" => "+log2(tag)+" bits para tag"
      );
      return temp;
    }
    else{ return temp;}
  };
  calcAssocP = (temp) => {//calculo de assoc con cap de mem y de cell
    unitM = elem('capMemPeso').value
    unitC = elem('capCellPeso').value
    if(isEmpty(temp) && checkAssocP()){
      const capM = elem('capMemP').value;
      const capC = elem('capCell').value;
      const ncell = safeDivP(capM, unitM, capC, unitC).r;
      const cxb = elem("CellxBloq").value;
      const tag = safeDiv(ncell, cxb)
      temp.push(
        "nCell = capMemP / capCell = "+capM+unitM+" / "+capC+unitC+" = "+ncell+" celdas de memoria",
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" , 
        "Tag(nro de blq) = n cell / cell x blq = "+ncell+" / "+cxb+" = "+tag+" => "+log2(tag)+" bits para tag"
      );
      return temp;
    }
    else{ return temp; }
  };
  calcAssocP2 = (temp) => {//calculo de assoc con cap de mem y de linea
    unitL = elem('capLinePeso').value;
    unitM = elem('capMemPeso').value;
    if(isEmpty(temp) && checkAssocP2()){
      const capM = elem('capMemP').value;
      const capL = elem('capLine').value;
      const cxb = elem("CellxBloq").value;
      const capC = safeDiv(capL, cxb);
      const ncell = safeDivP(capM, unitM, capC, unitL).r;
      const tag = safeDiv(ncell, cxb);
      temp.push(
        "capCell = cap de line / cell x blq = " +capL+unitL+ " / "+cxb+" = "+capC+unitL,
        "nCell = capMemP / capCell = "+capM+unitM + " / "+capC+unitL+" = "+ncell+" celdas de memoria",
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" , 
        "Tag(nro de blq) = n cell / cell x blq = "+ncell+" / "+cxb+" = "+tag+" => "+log2(tag)+" bits para tag"
      );
      return temp;
    }
    else{return temp;}
  };
  calcDirS = (temp) => {//calculo de directo con toda la info
    if(isEmpty(temp) && checkDirS()){
      const ncell = elem('nCell').value;
      const cxb = elem("CellxBloq").value;
      const nl = elem("nLines").value;
      const nb = ncell / cxb;
      const tag = nb / nl;
      temp.push(
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" ,
        "Nro de blq = n cell / cell x blq = "+ncell+" / "+cxb+" = "+nb+" => "+log2(nb)+" bits para bloque", 
        "Nro de linea = n lieas = "+nl+"lineas => "+log2(nl)+" bits para linea",
        "Tag = nro de bloq / n lieas = "+nb+" / "+nl+" = "+tag+" => se necesitan "+log2(tag)+" bits para el tag"
      );
      return temp;
    }
    else{ return temp;}
  };
  calcDirP = (temp) => {//calculo de directo con la cap de cache y de linea
    unitC = elem('capCachePeso').value;
    unitL = elem('capLinePeso').value;
    if(isEmpty(temp) && checkDirP()){
      const capC = elem('capMemC').value
      const capL = elem('capLine').value
      const nl = safeDivP(capC, unitC, capL, unitL).r;
      const ncell = elem('nCell').value;
      const cxb = elem("CellxBloq").value;
      const nb = safeDiv(ncell, cxb);
      const tag = safeDiv(nb, nl);
      temp.push(
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" ,
        "Nro de blq = n cell / cell x blq = "+ncell+" / "+cxb+" = "+nb+" => "+log2(nb)+" bits para bloque", 
        "N lines = cap cache / cap line = "+capC+unitC+" / "+capL+unitL+" = "+nl+" lineas => "+log2(nl)+" bits para linea",
        "Tag = nro de bloq / n lieas = "+nb+" / "+nl+" = "+tag+" => se necesitan "+log2(tag)+" bits para el tag"
      );
      return temp;
    }
    else{ return temp;}
  };
  calcDirP2 = (temp) => {//calculo de directo con cap de cell y de cache
    unitCell = elem('capCellPeso').value;
    unitC = elem('capCachePeso').value
    if(isEmpty(temp) && checkDirP2()){
      const capCell = elem('capCell').value;
      const capC = elem('capMemC').value;
      const cxb = elem("CellxBloq").value;
      const capL = capCell * cxb;
      const nl = safeDivP(capC, unitC, capL, unitCell).r;
      const ncell = elem('nCell').value;
      const nb = safeDiv(ncell, cxb);ncell / cxb;
      const tag = safeDiv(nb, nl);
      temp.push(
        "cap line = cap de cell * cell x blq = "+capCell+unitCell+" * "+cxb+" => "+capL+"cap de linea",
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" ,
        "Nro de blq = n cell / cell x blq = "+ncell+" / "+cxb+" = "+nb+" => "+log2(nb)+" bits para bloque", 
        "N lines = cap cache / cap line = "+capC+unitC+" / "+capL+unitL+" = "+nl+" lineas => "+log2(nl)+" bits para linea",
        "Tag = nro de bloq / n lieas = "+nb+" / "+nl+" = "+tag+" => se necesitan "+log2(tag)+" bits para el tag"
      );
      return temp;
    }
    else{ return temp;}
  };
  calcDirP3 = (temp) => {//calculo de directo con cap de mem, cell y cache
    unitM = elem('capMemPeso').value;
    unitCell = elem('capCellPeso').value
    unitC = elem('capCachePeso').value
    if(isEmpty(temp) && checkDirP3()){
      const capCell = elem('capCell').value;
      const capC = elem('capMemC').value;
      const cxb = elem("CellxBloq").value;
      const capM = elem("capMemP").value;
      const capL = capCell * cxb;
      const nl = safeDivP(capC, unitC, capL, unitCell).r;
      const ncell = safeDivP(capM, unitM, capCell, unitCell).r;
      const nb = safeDiv(ncell, cxb);
      const tag = safeDiv(nb, nl);
      temp.push(
        "ncell = cap de mem / cap de cell = "+capM+unitM+" / "+capCell+unitCell+" => "+ncell+" celdas de memoria",
        "cap line = cap de cell * cell x blq = "+capCell+unitCell+" * "+cxb+" => "+capL+"cap de linea",
        "Palabra = cell x blq = "+cxb+" celdas por bloque => "+log2(cxb)+" bits para palabra" ,
        "Nro de blq = n cell / cell x blq = "+ncell+" / "+cxb+" = "+nb+" => "+log2(nb)+" bits para bloque", 
        "N lines = cap cache / cap line = "+capC+unitC+" / "+capL+unitL+" = "+nl+" lineas => "+log2(nl)+" bits para linea",
        "Tag = nro de bloq / n lieas = "+nb+" / "+nl+" = "+tag+" => se necesitan "+log2(tag)+" bits para el tag"
      );
      return temp;
    }
    else{ return temp;}
  };
  //check de errores
  function checkAssocS(){
      return isAssoc() && !nCellIsEmpty() && !cellxBloqIsEmpty();
  }
  function checkAssocP(){
      return isAssoc() && 
          !capMemIsEmpty() && 
          !cellxBloqIsEmpty() && 
          !capCellIsEmpty();
  }
  function checkAssocP2(){
    return isAssoc() && 
      !capMemIsEmpty() && 
      !cellxBloqIsEmpty() && 
      //con la cap de una linea
      !capLineIsEmpty();
  }
  function checkDirS(){
      return isDir() && !nCellIsEmpty() && !cellxBloqIsEmpty() && !nLinesIsEmpty();
  }
  function checkDirP(){
      return isDir() && 
          !nCellIsEmpty() &&
          !cellxBloqIsEmpty() && 
          !capCacheIsEmpty() && 
          //tengo la cap de una linea
          !capLineIsEmpty(); 
  }
  function checkDirP2(){
      return isDir() && 
          !nCellIsEmpty() &&
          !cellxBloqIsEmpty() && 
          !capCacheIsEmpty() && 
          //tengo la cap de una celda
          !capCellIsEmpty(); 
  }
  function checkDirP3(){
      return isDir() && 
          //cap de mem en lugar de las n cell
          !capMemIsEmpty() &&
          !cellxBloqIsEmpty() && 
          !capCacheIsEmpty() && 
          //tengo la cap de una celda
          !capCellIsEmpty(); 
  }

  function calculate(){
    const vistaCajas = document
    .getElementById("vista-cajas")
    .classList
    .contains("activa");

  if (vistaCajas) {
    sincronizarCajasALista();
  }
    var list = elem('resList');
    list.innerHTML = "";
    if (!elem('miTarjeta').classList.contains('activo')){
      elem('miTarjeta').classList.toggle('activo')
    }
    try {
      answer = [];
      answer = calcAssocP2(calcAssocP(calcAssocS(answer)))
      answer = calcDirP3(calcDirP2(calcDirP(calcDirS(answer))))
      console.log(answer)
      if(answer.length == 0) { throw new Error("faltan datos para resolver");}
      else{
        answer.forEach(e=> {temp = document.createElement('li');temp.textContent = e;list.appendChild(temp);});
      }
    } catch (error) {
      console.log(error);
      temp = document.createElement('li');temp.textContent = error;list.appendChild(temp);
    }
  }


const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

function cambiarVista(vista) {

    const lista = document.getElementById("vista-lista");
    const cajas = document.getElementById("vista-cajas");

    if (vista === "cajas") {

        sincronizarListaACajas();

        lista.classList.add("oculta");
        cajas.classList.add("activa");

    } else {

        sincronizarCajasALista();

        cajas.classList.remove("activa");
        lista.classList.remove("oculta");
    }
}

function sincronizarListaACajas() {

    document.getElementById("box-capMemP").value =
        document.getElementById("capMemP").value;

    document.getElementById("box-capMemPeso").value =
        document.getElementById("capMemPeso").value;

    document.getElementById("box-nCell").value =
        document.getElementById("nCell").value;

    document.getElementById("box-CellxBloq").value =
        document.getElementById("CellxBloq").value;

    document.getElementById("box-capCell").value =
        document.getElementById("capCell").value;

    document.getElementById("box-capCellPeso").value =
        document.getElementById("capCellPeso").value;

    document.getElementById("box-capMemC").value =
        document.getElementById("capMemC").value;

    document.getElementById("box-capCachePeso").value =
        document.getElementById("capCachePeso").value;

    document.getElementById("box-capLine").value =
        document.getElementById("capLine").value;

    document.getElementById("box-capLinePeso").value =
        document.getElementById("capLinePeso").value;

    document.getElementById("box-nLines").value =
        document.getElementById("nLines").value;
}

function sincronizarCajasALista() {

    document.getElementById("capMemP").value =
        document.getElementById("box-capMemP").value;

    document.getElementById("capMemPeso").value =
        document.getElementById("box-capMemPeso").value;

    document.getElementById("nCell").value =
        document.getElementById("box-nCell").value;

    document.getElementById("CellxBloq").value =
        document.getElementById("box-CellxBloq").value;

    document.getElementById("capCell").value =
        document.getElementById("box-capCell").value;

    document.getElementById("capCellPeso").value =
        document.getElementById("box-capCellPeso").value;

    document.getElementById("capMemC").value =
        document.getElementById("box-capMemC").value;

    document.getElementById("capCachePeso").value =
        document.getElementById("box-capCachePeso").value;

    document.getElementById("capLine").value =
        document.getElementById("box-capLine").value;

    document.getElementById("capLinePeso").value =
        document.getElementById("box-capLinePeso").value;

    document.getElementById("nLines").value =
        document.getElementById("box-nLines").value;
}