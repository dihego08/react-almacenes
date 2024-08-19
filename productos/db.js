import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('database.db');

async function configureDatabase() {
    await db.execAsync('PRAGMA cache_size = 2000;', []);
    await db.execAsync('PRAGMA cache_spill = OFF;', []);
};

async function eliminarTablas() {
    await db.execAsync(
        `DROP TABLE inventarios;
        DROP TABLE control;
        /*DROP TABLE estados;
        DROP TABLE sedes;
        DROP TABLE almacenes;
        DROP TABLE usuarios;
        DROP TABLE unidades;
        DROP TABLE materiales;*/`
    );
}
async function crearControl() {
    await db.execAsync(`CREATE TABLE IF NOT EXISTS control (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_sede TEXT,
        id_almacen TEXT,
        id_material TEXT,
        cantidad TEXT,
        estado TEXT,
        conteo TEXT,
        reconteo TEXT,
        reconteo2 TEXT,
        diferencia TEXT,
        sede TEXT,
        almacen TEXT,
        material TEXT,
        marca TEXT,
        modelo TEXT,
        serie TEXT,
        codigo TEXT
    );`);
}
async function crearInventarios() {
    // Crea la tabla si no existe
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS inventarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_sede TEXT,
            id_almacen TEXT,
            id_material TEXT,
            conteo TEXT,
            reconteo TEXT,
            reconteo2 TEXT,
            ubicacion TEXT,
            id_estado TEXT,
            observaciones TEXT,
            codigo_inventario TEXT,
            foto TEXT,
            fecha_creacion TEXT,
            fecha_modificacion TEXT,
            id_usuario TEXT,
            control TEXT,
            sede TEXT,
            nombres TEXT,
            almacen TEXT,
            estado TEXT,
            material TEXT,
            nuevo TEXT,
            marca TEXT,
            modelo TEXT,
            serie TEXT
        )`
    );
}
async function crearMateriales() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS materiales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            material TEXT,
            id_unidad TEXT,
            unidad TEXT
        )`
    );
}
async function crearSedes() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS sedes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            sede TEXT
        )`
    );
}
async function crearAlmacenes() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS almacenes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_sede INTEGER,
            codigo TEXT,
            almacen TEXT
        )`
    );
}
async function crearUsuario() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_remoto TEXT,
            codigo TEXT,
            nombres TEXT,
            user TEXT,
            pass TEXT,
            fecha_creacion TEXT,
            usuario_creacion TEXT,
            nivel INTEGER,
            id_almacen INTEGER
        )`
    );
}
async function crearUnidades() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS unidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            unidad TEXT
        )`
    );
}
async function crearEstado() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS estados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estado TEXT
        )`
    );
}
async function crearClasificacion() {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS clasificacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clasificacion 	TEXT
        )`
    );
}
async function addMaterial(data) {
    const result = await db.runAsync(`INSERT INTO materiales(id, material, id_unidad, codigo, unidad) VALUES (?, ?, ?, ?, ?)`, data);
}
async function addInventario(data) {
    const result = await db.runAsync(`INSERT INTO inventarios (
        id,
        id_sede,
        id_almacen,
        id_material,
        conteo,
        reconteo,
        reconteo2,
        ubicacion,
        id_estado,
        observaciones,
        codigo_inventario,
        foto,
        fecha_creacion,
        id_usuario,
        control,
        sede,
        nombres,
        almacen,
        estado,
        material,
        nuevo,
        marca,
        modelo,
        serie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, data);
    return result.lastInsertRowId;
};
async function addClasificacion(data) {
    await db.runAsync(`INSERT INTO clasificacion(id, clasificacion) VALUES (?, ?);`, data);
}
async function addEstado(data) {
    await db.runAsync(`INSERT INTO estados(id, estado) VALUES (?, ?)`, data);
}
async function addControl(data) {
    await db.runAsync(`INSERT INTO control(id, id_sede, id_almacen, id_material, cantidad, estado, conteo, reconteo, reconteo2, diferencia, sede, almacen, material, marca, modelo, serie, codigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
}
async function addUnidad(data) {
    await db.runAsync(`INSERT INTO unidades(id, unidad) VALUES (?, ?)`, data);
}
async function addSede(data) {
    await db.runAsync(`INSERT INTO sedes(id, codigo, sede) VALUES (?, ?, ?)`, data);
}
async function addAlmacenes(data) {
    await db.runAsync(`INSERT INTO almacenes(id, id_sede, codigo, almacen) VALUES (?, ?, ?, ?)`, data);
}
async function addUsuario(data) {
    await db.runAsync(`INSERT INTO usuarios(id_remoto, codigo, nombres, user, pass, fecha_creacion, usuario_creacion, nivel, id_almacen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
}
async function getCountInventario() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM inventarios;');
    return firstRow.cant;
}
async function getCountUsuarios() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM usuarios;');
    return firstRow.cant;
}
async function getCountAlmacenes() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM almacenes;');
    return firstRow.cant;
}
async function getCountSedes() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM sedes;');
    return firstRow.cant;
}
async function getCountClasificacion() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM clasificacion;');
    return firstRow.cant;
}
async function getCountEstado() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM estados;');
    return firstRow.cant;
}
async function getCountUnidad() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM unidades;');
    return firstRow.cant;
}
async function getCountInventarioById(id) {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM inventarios WHERE id = ?;', id);
    return firstRow.cant;
}
async function getAllInventario() {
    const allRows = await db.getAllAsync('SELECT i.*, m.codigo FROM inventarios i JOIN materiales m ON m.id = i.id_material ORDER BY i.material ASC');
    return allRows;
}
async function getAllControl() {
    const allRows = await db.getAllAsync('SELECT * FROM control ORDER BY material ASC');
    return allRows;
}
async function getAllControlParams(id_sede, id_almacen) {
    let str = '';
    if (id_almacen == 0 || id_almacen == "") {
        //str = `SELECT * FROM control WHERE id_sede = ${id_sede} ORDER BY material ASC`;
        str = `SELECT *, total FROM control c LEFT JOIN (SELECT sum(conteo) total, id_material, id_sede, id_almacen, marca, modelo, serie from inventarios GROUP BY id_sede, id_almacen, id_material, marca, modelo, serie) aux ON aux.id_sede = c.id_sede and aux.id_almacen = c.id_almacen AND aux.id_material = c.id_material AND aux.marca = c.marca AND aux.modelo = c.modelo AND aux.serie = c.serie WHERE c.id_sede = ${id_sede} ORDER BY c.material ASC; `;
    } else {
        // str = `SELECT * FROM control WHERE id_sede = ${id_sede} AND id_almacen = ${id_almacen} ORDER BY material ASC`;
        str = `SELECT *, total FROM control c LEFT JOIN (SELECT sum(conteo) total, id_material, id_sede, id_almacen, marca, modelo, serie from inventarios GROUP BY id_sede, id_almacen, id_material, marca, modelo, serie) aux ON aux.id_sede = c.id_sede and aux.id_almacen = c.id_almacen AND aux.id_material = c.id_material AND aux.marca = c.marca AND aux.modelo = c.modelo AND aux.serie = c.serie WHERE c.id_sede = ${id_sede} AND c.id_almacen = ${id_almacen} ORDER BY c.material ASC; `;
    }
    const allRows = await db.getAllAsync(str);
    return allRows;
}
async function getAllUsuarios() {
    const allRows = await db.getAllAsync('SELECT * FROM usuarios ORDER BY nombres ASC');
    return allRows;
}
async function getAllDistinctUsuarios() {
    const allRows = await db.getAllAsync('SELECT distinct id_remoto, nombres FROM usuarios ORDER BY nombres ASC');
    return allRows;
}
async function getAllSedes() {
    const allRows = await db.getAllAsync('SELECT * FROM sedes ORDER BY sede ASC');
    return allRows;
}
async function getSedeByID(id) {
    const firstRow = await db.getFirstAsync('SELECT * FROM sedes WHERE id = ?', id);
    return firstRow;
}
async function getEstadoByID(id) {
    const firstRow = await db.getFirstAsync('SELECT * FROM estados WHERE id = ?', id);
    return firstRow;
}
async function getUsuarioByIdIdAlmacen(id_almacen, id) {
    const firstRow = await db.getFirstAsync('SELECT distinct * FROM usuarios WHERE id_remoto = ?', [id]);
    return firstRow;
}
async function getClasificacionByID(id) {
    const firstRow = await db.getFirstAsync('SELECT * FROM clasificacion WHERE id = ?', id);
    return firstRow;
}
async function getAlmacenByID(id) {
    const firstRow = await db.getFirstAsync('SELECT * FROM almacenes WHERE id = ?', id);
    return firstRow;
}
async function getAllAlmacenes() {
    const allRows = await db.getAllAsync('SELECT * FROM almacenes ORDER BY almacen ASC');
    return allRows;
}
async function getAlmacenByIdSede(id_sede) {
    const allRows = await db.getAllAsync('SELECT * FROM almacenes WHERE id_sede = ? ORDER BY almacen ASC', id_sede);
    return allRows;
}
async function getAllEstado() {
    const allRows = await db.getAllAsync('SELECT * FROM estados');
    return allRows;
}
async function getAllClasificacion() {
    const allRows = await db.getAllAsync('SELECT * FROM clasificacion');
    return allRows;
}
async function getAllClasificacionNuevo() {
    const allRows = await db.getAllAsync('SELECT * FROM clasificacion WHERE id IN (3);');
    return allRows;
}
async function getAllClasificacionEditar() {
    const allRows = await db.getAllAsync('SELECT * FROM clasificacion WHERE id IN (1, 2);');
    return allRows;
}
async function getInventarioById(id_inventario) {
    const firstRow = await db.getFirstAsync('SELECT * FROM inventarios WHERE id = ?;', [id_inventario]);
    return firstRow;
}
async function getInventarioByIdLocal(id_inventario) {
    const firstRow = await db.getFirstAsync('SELECT * FROM inventarios WHERE id_local = ?;', [id_inventario]);
    return firstRow;
}
async function updateInventario(data) {
    const result = await db.runAsync(`UPDATE inventarios SET id_sede=?,id_almacen=?,id_material=?,conteo=?,reconteo=?,reconteo2=?,ubicacion=?,id_estado=?,observaciones=?,codigo_inventario=?,foto=?,fecha_modificacion=?,id_usuario=?,control=?, sede = ?,
nombres = ?,
almacen = ?,
estado = ?,
material = ?,
marca = ?,
modelo = ?,
serie = ? WHERE id = ?`, data);
}
async function updateNuevo(id) {
    const result = await db.runAsync(`UPDATE inventarios SET nuevo = 0 WHERE id = ?`, id);
}
async function getAllInventarioFechaModificacion() {
    const allRows = await db.getAllAsync('SELECT * FROM inventarios WHERE fecha_modificacion IS NOT NULL OR nuevo = 1');
    return allRows;
}
async function getAllInventarioByText(text) {
    const allRows = await db.getAllAsync(`SELECT * FROM inventarios WHERE material LIKE '%${text}%' OR codigo_af LIKE '%${text}%' OR codigo_fisico LIKE '%${text}%' OR modelo LIKE '%${text}%' OR serie LIKE '%${text}%' OR marca LIKE '%${text}%' OR observaciones LIKE '%${text}%'`);
    return allRows;
}
async function autocomplete(query, id_sede, id_almacen) {
    // console.log(`SELECT * FROM materiales WHERE codigo LIKE '%${query}%' AND id_sede = ${id_sede} AND id_almacen = ${id_almacen} ORDER BY material ASC;`);
    const allRows = await db.getAllAsync(`SELECT c.*, m.unidad FROM control c JOIN materiales m ON m.id = c.id_material WHERE m.codigo LIKE '%${query}%' AND c.id_sede = ${id_sede} AND c.id_almacen = ${id_almacen} ORDER BY m.material ASC;`);
    return allRows;
}
async function getMaterialById(id) {
    const allRows = await db.getFirstAsync(`SELECT * FROM materiales WHERE id = ${id};`);
    return allRows;
}
async function getFromControl(id_sede, id_almacen, id_material) {
    const allRows = await db.getFirstAsync(`SELECT * FROM control WHERE id_sede = ${id_sede} AND id_almacen = ${id_almacen} AND id_material = ${id_material};`);
    return allRows;
}
async function getDataGrafico(s, e, u) {
    let query = "SELECT COUNT(i.id) cant, c.clasificacion FROM inventarios i LEFT JOIN clasificacion c ON c.id = i.id_clasificacion WHERE 1 = 1 ";

    if (s == 0) {
    } else {
        query += ' AND i.id_sede = ' + s;
    }

    if (e == 0) {
    } else {
        query += ' AND i.id_almacen = ' + e;
    }
    if (u == 0) {
    } else {
        query += ' AND i.id_usuario = ' + u;
    }
    query += ' GROUP BY c.clasificacion;';
    const allRows = await db.getAllAsync(query);
    return allRows;
}
async function getAllCuentas() {
    const allRows = await db.getAllAsync(`SELECT DISTINCT cuenta FROM inventarios;`);
    return allRows;
}
async function buscarMedidor(serie){
    console.log(serie);
    const allRows = await db.getFirstAsync(`SELECT c.marca, c.modelo, c.serie, m.codigo, m.material, c.cantidad, u.unidad, c.id_sede, c.id_almacen, c.id_material FROM control c JOIN materiales m ON m.id = c.id_material JOIN unidades u ON u.id = m.id_unidad WHERE c.serie = ${serie};`);
    // const allRows = await db.getFirstAsync(`SELECT c.marca, c.modelo, c.serie, m.codigo, m.material, c.cantidad, c.id_sede, c.id_almacen, c.id_material FROM control c JOIN materiales m ON m.id = c.id_material WHERE c.serie = ${serie};`);
    // const allRows = await db.getFirstAsync(`SELECT * FROM control c join materiales m ON m.id = c.id_material WHERE c.serie = ${serie};`);
    // const allRows = await db.getAllAsync(`SELECT * FROM materiales;`);


    console.log(allRows);
    return allRows;
}
export {
    crearInventarios, addInventario, addAlmacenes, addEstado, addSede, addUsuario, crearAlmacenes, crearEstado, crearSedes, crearUsuario, getCountInventario, getAllInventario, getCountUsuarios, getCountAlmacenes, getCountSedes, getCountEstado, getAllUsuarios, getAllSedes, getAllAlmacenes, getAllEstado, getInventarioById, getInventarioByIdLocal, updateInventario, getAlmacenByIdSede, getCountInventarioById, getSedeByID, getAlmacenByID, getEstadoByID, getUsuarioByIdIdAlmacen, getAllInventarioFechaModificacion, getAllInventarioByText, getAllDistinctUsuarios, eliminarTablas, getDataGrafico, getAllCuentas, updateNuevo, configureDatabase, crearControl, crearMateriales, crearUnidades, addUnidad, addMaterial, addControl, getCountUnidad, getAllControl, autocomplete, getFromControl, getMaterialById, getAllControlParams, buscarMedidor
};