const assert = require("chai").assert;
const main = require("./../Server/main.js");
const mysql = require('mysql2/promise');

describe("Suite Principal", function () {
    // Configuración inicial para las pruebas
    let conexion;

    before(async function () {
        // Crear conexión para las pruebas
        conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ludiverso',
            port: 3306
        });
    });

    after(async function () {
        // Cerrar conexión después de las pruebas
        if (conexion) {
            await conexion.end();
        }
    });

    describe("Gestión de Contraseñas", function () {
        it("debería hashear una contraseña correctamente", async function () {
            const contraseñaPlana = "testPassword123";
            const contraseñaHasheada = await main.hashPassword(contraseñaPlana);
            assert.isString(contraseñaHasheada);
            assert.notEqual(contraseñaHasheada, contraseñaPlana);
            assert.isTrue(contraseñaHasheada.startsWith('$2b$'));
        });

        it("debería verificar la contraseña correctamente", async function () {
            const contraseñaPlana = "testPassword123";
            const contraseñaHasheada = await main.hashPassword(contraseñaPlana);
            const coincide = await main.verifyPassword(contraseñaPlana, contraseñaHasheada);
            assert.isTrue(coincide);
        });

        it("debería rechazar una contraseña incorrecta", async function () {
            const contraseñaPlana = "testPassword123";
            const contraseñaIncorrecta = "wrongPassword123";
            const contraseñaHasheada = await main.hashPassword(contraseñaPlana);
            const coincide = await main.verifyPassword(contraseñaIncorrecta, contraseñaHasheada);
            assert.isFalse(coincide);
        });
    });

    describe("Registro e Inicio de Sesión de Usuarios", function () {

        const uniqueId = Date.now();
        const usuarioPrueba = {
            nombre_us: "Usuario",
            apellido_us: "Prueba",
            nombre_usuario_us: "usuarioprueba" + uniqueId,
            email_us: "prueba" + uniqueId + "@test.com",
            password_us: "ContraseñaPrueba123"
        };

        let idUsuario;

        after(async function () {
            if (idUsuario) {
                try {
                    await conexion.execute('DELETE FROM usuarios WHERE usuario_id = ?', [idUsuario]);
                } catch (err) {
                    console.error('Error al limpiar usuario de prueba:', err);
                }
            }
        });

        it("debería registrar un nuevo usuario exitosamente", async function () {
            // Hash de la contraseña
            const contraseñaHasheada = await main.hashPassword(usuarioPrueba.password_us);

            // Insertar usuario
            const [resultado] = await conexion.execute(
                'INSERT INTO usuarios (nombre, apellido, nombre_usuario, email, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [usuarioPrueba.nombre_us, usuarioPrueba.apellido_us, usuarioPrueba.nombre_usuario_us, usuarioPrueba.email_us, contraseñaHasheada, "alumno"]
            );

            idUsuario = resultado.insertId;
            assert.isNumber(idUsuario);
            assert.isAbove(idUsuario, 0);
        });

        it("no debería permitir nombres de usuario duplicados", async function () {
            try {
                const contraseñaHasheada = await main.hashPassword(usuarioPrueba.password_us);
                await conexion.execute(
                    'INSERT INTO usuarios (nombre, apellido, nombre_usuario, email, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)',
                    [usuarioPrueba.nombre_us, usuarioPrueba.apellido_us, usuarioPrueba.nombre_usuario_us, "otro" + usuarioPrueba.email_us, contraseñaHasheada, "alumno"]
                );
                assert.fail('Debería haber lanzado un error por nombre de usuario duplicado');
            } catch (err) {
                assert.isDefined(err);
            }
        });

        it("debería iniciar sesión exitosamente con credenciales correctas", async function () {
            const [filas] = await conexion.execute(
                'SELECT * FROM usuarios WHERE nombre_usuario = ?',
                [usuarioPrueba.nombre_usuario_us]
            );

            assert.isArray(filas);
            assert.lengthOf(filas, 1);

            const coincide = await main.verifyPassword(usuarioPrueba.password_us, filas[0].contraseña);
            assert.isTrue(coincide);
        });

        it("debería rechazar el inicio de sesión con contraseña incorrecta", async function () {
            const [filas] = await conexion.execute(
                'SELECT * FROM usuarios WHERE nombre_usuario = ?',
                [usuarioPrueba.nombre_usuario_us]
            );

            const coincide = await main.verifyPassword("ContraseñaIncorrecta123", filas[0].contraseña);
            assert.isFalse(coincide);
        });

        it("debería tener el rol correcto", async function () {
            const [filas] = await conexion.execute(
                'SELECT rol FROM usuarios WHERE nombre_usuario = ?',
                [usuarioPrueba.nombre_usuario_us]
            );

            assert.equal(filas[0].rol, "alumno");
        });
    });

    describe("Funciones de Fecha", function () {
        it("debería devolver una cadena de fecha válida", function () {
            const fechaHora = main.Datatime();
            assert.isString(fechaHora);
            assert.match(fechaHora, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });
    });

    describe("Gestión de Sesiones", function () {
        it("debería crear datos de sesión válidos", async function () {
            const peticionSimulada = {
                session: {}
            };

            const datosUsuario = {
                usuario_id: 1,
                nombre: "Francisco",
                apellido: "Suchomela",
                nombre_usuario: "fransucho",
                email: "franciscosuchomela@gmail.com",
                contraseña: "$2b$10$VmZdIK9tS4Zk0OZhHFKP0e37AtZw7uMDlHPoWR6DAZoT8RraF.Q.6",
                rol: "alumno"
            };

            // Simular la creación de una sesión
            peticionSimulada.session.usuario_id = datosUsuario.usuario_id;
            peticionSimulada.session.nombre_us = datosUsuario.nombre;
            peticionSimulada.session.apellido_us = datosUsuario.apellido;
            peticionSimulada.session.nombre_usuario_us = datosUsuario.nombre_usuario;
            peticionSimulada.session.email_us = datosUsuario.email;
            peticionSimulada.session.password_us = datosUsuario.contraseña;
            peticionSimulada.session.rol_us = datosUsuario.rol;
            peticionSimulada.session.user_sesion = true;

            assert.isDefined(peticionSimulada.session.usuario_id);
            assert.equal(peticionSimulada.session.rol_us, "alumno");
            assert.isTrue(peticionSimulada.session.user_sesion);
        });
    });
});