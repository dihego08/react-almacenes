import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

const db = SQLite.openDatabaseSync('database.db');

async function eliminarTablas() {
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
        `DROP TABLE inventario;
        DROP TABLE clasificacion;
        DROP TABLE estados;
        DROP TABLE sedes;
        DROP TABLE emplazamiento;
        DROP TABLE usuarios;`
    );
}
async function crearInventario() {
    // Crea la tabla si no existe
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
        `CREATE TABLE IF NOT EXISTS inventario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cuenta TEXT,
            id_sede TEXT,
            codigo_af TEXT,
            sap_padre TEXT,
            sap_comp TEXT,
            codigo_fisico TEXT,
            descripcion TEXT,
            marca TEXT,
            modelo TEXT,
            serie TEXT,
            medida TEXT,
            color TEXT,
            detalles TEXT,
            observaciones TEXT,
            otros TEXT,
            id_usuario TEXT,
            inventariador TEXT,
            id_clasificacion TEXT,
            id_estado TEXT,
            usuario_creacion TEXT,
            fecha_creacion TEXT,
            foto TEXT,
            cod_inventario TEXT,
            id_emplazamiento TEXT,
            fecha_modificacion TEXT,
            cantidad TEXT,
            unidad TEXT,
            sede TEXT,
            nombres TEXT,
            emplazamiento TEXT,
            clasificacion TEXT,
            estado TEXT,
            nuevo TEXT
        )`
    );
}
async function crearSedes() {
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
        `CREATE TABLE IF NOT EXISTS sedes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            sede TEXT,
            usuario_creacion INTEGER,
            fecha_creacion TEXT
        )`
    );
}
async function crearEmplazamiento() {
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
        `CREATE TABLE IF NOT EXISTS emplazamiento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_sede INTEGER,
            codigo TEXT,
            emplazamiento TEXT,
            usuario_creacion INTEGER,
            fecha_creacion TEXT
        )`
    );
}
async function crearUsuario() {
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
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
            id_emplazamiento INTEGER
        )`
    );
}
async function crearEstado() {
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
        `CREATE TABLE IF NOT EXISTS estados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estado TEXT
        )`
    );
}
async function crearClasificacion() {
    await db.execAsync(
        //'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
        `CREATE TABLE IF NOT EXISTS clasificacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clasificacion 	TEXT
        )`
    );
}
async function addInventario(data) {
    const result = await db.runAsync(`INSERT INTO inventario (
        id, 
        cuenta,
        id_sede,
        codigo_af,
        sap_padre,
        sap_comp,
        codigo_fisico,
        descripcion,
        marca,
        modelo,
        serie,
        medida,
        color,
        detalles,
        observaciones,
        otros,
        id_usuario,
        inventariador,
        id_clasificacion,
        id_estado,
        usuario_creacion,
        fecha_creacion,
        foto,
        id_emplazamiento,
        cantidad,
        unidad,
        sede,
        nombres,
        emplazamiento,
        clasificacion,
        estado,
        fecha_modificacion, nuevo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, data);
    console.log(result.lastInsertRowId, result.changes);
    return result.lastInsertRowId;
};
async function addClasificacion(data) {
    const result = await db.runAsync(`INSERT INTO clasificacion(id, clasificacion) VALUES (?, ?);`, data);
    console.log(result.lastInsertRowId, result.changes);
}
async function addEstado(data) {
    const result = await db.runAsync(`INSERT INTO estados(id, estado) VALUES (?, ?)`, data);
    console.log(result.lastInsertRowId, result.changes);
}
async function addSede(data) {
    const result = await db.runAsync(`INSERT INTO sedes(id, codigo, sede, usuario_creacion, fecha_creacion) VALUES (?, ?, ?, ?, ?)`, data);
    console.log(result.lastInsertRowId, result.changes);
}
async function addEmplazamiento(data) {
    const result = await db.runAsync(`INSERT INTO emplazamiento(id, id_sede, codigo, emplazamiento, usuario_creacion, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)`, data);
    console.log(result.lastInsertRowId, result.changes);
}
async function addUsuario(data) {
    const result = await db.runAsync(`INSERT INTO usuarios(id_remoto, codigo, nombres, user, pass, fecha_creacion, usuario_creacion, nivel, id_emplazamiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
    console.log(result.lastInsertRowId, result.changes);
}
async function getCountInventario() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM inventario;');
    return firstRow.cant;
}
async function getCountUsuarios() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM usuarios;');
    return firstRow.cant;
}
async function getCountEmplazamiento() {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM emplazamiento;');
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
async function getCountInventarioById(id) {
    const firstRow = await db.getFirstAsync('SELECT COUNT(*) AS cant FROM inventario WHERE id = ?;', id);
    return firstRow.cant;
}
async function getAllInventario() {
    const allRows = await db.getAllAsync('SELECT * FROM inventario ORDER BY descripcion ASC');
    console.log("Seleccion Inventario desde SQLite");
    return allRows;
}
async function getAllUsuarios() {
    const allRows = await db.getAllAsync('SELECT * FROM usuarios ORDER BY nombres ASC');
    console.log("Seleccion Usuarios desde SQLite");
    return allRows;
}
async function getAllDistinctUsuarios() {
    const allRows = await db.getAllAsync('SELECT distinct id_remoto, nombres FROM usuarios ORDER BY nombres ASC');
    console.log("Seleccion Usuarios desde SQLite");
    return allRows;
}
async function getAllSedes() {
    const allRows = await db.getAllAsync('SELECT * FROM sedes ORDER BY sede ASC');
    console.log("Seleccion Sedes desde SQLite");
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
async function getUsuarioByIdIdEmplazamiento(id_emplazamiento, id) {
    const firstRow = await db.getFirstAsync('SELECT distinct * FROM usuarios WHERE id_remoto = ?', [id]);
    return firstRow;
}
async function getClasificacionByID(id) {
    const firstRow = await db.getFirstAsync('SELECT * FROM clasificacion WHERE id = ?', id);
    return firstRow;
}
async function getEmplazamientoByID(id) {
    const firstRow = await db.getFirstAsync('SELECT * FROM emplazamiento WHERE id = ?', id);
    return firstRow;
}
async function getAllEmplazamientos() {
    const allRows = await db.getAllAsync('SELECT * FROM emplazamiento ORDER BY emplazamiento ASC');
    console.log("Seleccion Emplazamiento desde SQLite");
    return allRows;
}
async function getEmplazamientoByIdSede(id_sede) {
    const allRows = await db.getAllAsync('SELECT * FROM emplazamiento WHERE id_sede = ? ORDER BY emplazamiento ASC', id_sede);
    console.log("Seleccion Emplazamiento desde SQLite");
    return allRows;
}
async function getAllEstado() {
    const allRows = await db.getAllAsync('SELECT * FROM estados');
    console.log("Seleccion estados desde SQLite");
    return allRows;
}
async function getAllClasificacion() {
    const allRows = await db.getAllAsync('SELECT * FROM clasificacion');
    console.log("Seleccion clasificacion desde SQLite");
    return allRows;
}
async function getAllClasificacionNuevo() {
    const allRows = await db.getAllAsync('SELECT * FROM clasificacion WHERE id IN (3);');
    console.log("Seleccion clasificacion desde SQLite");
    return allRows;
}
async function getAllClasificacionEditar() {
    const allRows = await db.getAllAsync('SELECT * FROM clasificacion WHERE id IN (1, 2);');
    console.log("Seleccion clasificacion desde SQLite");
    return allRows;
}
async function getInventarioById(id_inventario) {
    const firstRow = await db.getFirstAsync('SELECT * FROM inventario WHERE id = ?;', [id_inventario]);
    return firstRow;
}
async function getInventarioByIdLocal(id_inventario) {
    const firstRow = await db.getFirstAsync('SELECT * FROM inventario WHERE id_local = ?;', [id_inventario]);
    return firstRow;
}
async function updateInventario(data) {
    const result = await db.runAsync(`UPDATE inventario SET cuenta=?,id_sede=?,codigo_af=?,sap_padre=?,sap_comp=?,codigo_fisico=?,descripcion=?,marca=?,modelo=?,serie=?,medida=?,color=?,detalles=?,observaciones=?,otros=?,id_usuario=?,inventariador=?,id_clasificacion=?,id_estado=?,usuario_creacion=?,fecha_creacion=?,foto=?,cod_inventario=?,id_emplazamiento=?,fecha_modificacion=?,cantidad=?,unidad=?, sede = ?,
nombres = ?,
emplazamiento = ?,
clasificacion = ?,
estado = ? WHERE id = ?`, data);
    console.log(result.lastInsertRowId, result.changes);
}
async function getAllInventarioFechaModificacion() {
    const allRows = await db.getAllAsync('SELECT * FROM inventario WHERE fecha_modificacion IS NOT NULL');
    console.log("Seleccion las fechas modificaciones desde SQLite");
    return allRows;
}
async function getAllInventarioByText(text) {
    const allRows = await db.getAllAsync(`SELECT * FROM inventario WHERE descripcion LIKE '%${text}%' OR codigo_af LIKE '%${text}%' OR codigo_fisico LIKE '%${text}%' OR modelo LIKE '%${text}%' OR serie LIKE '%${text}%'`);
    return allRows;
}
async function getDataGrafico(s, e, u) {
    let query = "SELECT COUNT(i.id) cant, c.clasificacion FROM inventario i LEFT JOIN clasificacion c ON c.id = i.id_clasificacion WHERE 1 = 1 ";

    if (s == 0) {
    } else {
        query += ' AND i.id_sede = ' + s;
    }

    if (e == 0) {
    } else {
        query += ' AND i.id_emplazamiento = ' + e;
    }
    if (u == 0) {
    } else {
        query += ' AND i.id_usuario = ' + u;
    }
    query += ' GROUP BY c.clasificacion;';
    const allRows = await db.getAllAsync(query);
    console.log("Seleccion la data del grafico");
    return allRows;
}
async function getAllCuentas() {
    const allRows = await db.getAllAsync(`SELECT DISTINCT cuenta FROM inventario;`);
    return allRows;
}
export {
    crearInventario, addInventario, addClasificacion, addEmplazamiento, addEstado, addSede, addUsuario, crearClasificacion, crearEmplazamiento, crearEstado, crearSedes, crearUsuario, getCountInventario, getAllInventario, getCountUsuarios, getCountEmplazamiento, getCountSedes, getCountClasificacion, getCountEstado, getAllUsuarios, getAllSedes, getAllEmplazamientos, getAllEstado, getAllClasificacion, getInventarioById, getInventarioByIdLocal, updateInventario, getEmplazamientoByIdSede, getCountInventarioById, getSedeByID, getEmplazamientoByID, getEstadoByID, getClasificacionByID, getUsuarioByIdIdEmplazamiento, getAllInventarioFechaModificacion, getAllInventarioByText, getAllDistinctUsuarios, eliminarTablas, getAllClasificacionNuevo, getAllClasificacionEditar, getDataGrafico, getAllCuentas
};