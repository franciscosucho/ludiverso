-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-08-2025 a las 20:07:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `ludiverso`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `materia_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `jefe_de_area` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`materia_id`, `nombre`, `descripcion`, `jefe_de_area`) VALUES
(1, 'Comunicaciones', 'Esta área estudia cómo viven las personas en sociedad, su historia, costumbres, formas de gobierno, y el entorno geográfico. Ayuda a comprender el pasado, el presente y a reflexionar sobre el mundo que nos rodea.', 'Prof. Nancy Dunjó'),
(2, 'Exactas y Naturales', 'Agrupa materias como Matemática, Física, Química y Biología. Estudia fenómenos naturales, el universo y el funcionamiento del cuerpo y la materia, desarrollando el pensamiento lógico, el análisis y la curiosidad científica.', '  Prof. Matias Gutierrez'),
(5, 'Educación Física', 'Promueve el desarrollo del cuerpo y la salud a través del movimiento, el juego y el deporte. Fomenta hábitos saludables, el trabajo en equipo y el respeto por uno mismo y los demás.', 'Prof. Nora Cavia'),
(6, 'Ciencias Sociales', 'Esta área estudia cómo viven las personas en sociedad, su historia, costumbres, formas de gobierno, y el entorno geográfico. Ayuda a comprender el pasado, el presente y a reflexionar sobre el mundo que nos rodea.', 'Prof. Diana Cozzani'),
(7, 'Taller', 'Es un espacio práctico donde se aprenden habilidades manuales, técnicas y creativas. Se trabaja en proyectos que integran conocimientos de distintas áreas y fomentan la autonomía y el trabajo colaborativo.', 'Prof. Alejandro Hsia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas`
--

CREATE TABLE `estadisticas` (
  `estadistica_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `juego_jugado` int(11) DEFAULT 0,
  `puntaje_total` int(11) DEFAULT 0,
  `fecha_actividad` datetime DEFAULT NULL,
  `id_nivel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estadisticas`
--

INSERT INTO `estadisticas` (`estadistica_id`, `usuario_id`, `juego_jugado`, `puntaje_total`, `fecha_actividad`, `id_nivel`) VALUES
(149, 5, 3, 200, '2025-06-27 10:21:40', 1),
(150, 5, 3, 100, '2025-07-30 18:42:58', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_ahorcado`
--

CREATE TABLE `historial_ahorcado` (
  `id_historial` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `intentos_fallidos` int(11) NOT NULL,
  `tiempo` int(11) NOT NULL,
  `victoria` tinyint(1) NOT NULL DEFAULT 0,
  `palabra_jugada` varchar(50) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_wordle`
--

CREATE TABLE `historial_wordle` (
  `id_historial` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `tiempo` int(11) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_wordle`
--

INSERT INTO `historial_wordle` (`id_historial`, `id_us`, `aciertos`, `tiempo`, `fecha`) VALUES
(1, 5, 6, 95, '2025-07-30 20:16:05'),
(2, 5, 0, 30, '2025-08-11 13:53:41'),
(3, 5, 0, 10, '2025-08-11 14:04:07'),
(4, 5, 0, 10, '2025-08-11 14:11:50'),
(5, 5, 0, 10, '2025-08-11 14:17:56'),
(6, 5, 0, 10, '2025-08-11 14:18:31'),
(7, 5, 0, 20, '2025-08-11 14:19:28'),
(8, 5, 0, 13, '2025-08-11 14:20:06'),
(9, 5, 0, 38, '2025-08-11 14:22:36'),
(10, 5, 0, 40, '2025-08-11 14:24:08'),
(11, 5, 0, 40, '2025-08-11 14:26:17'),
(12, 5, 0, 40, '2025-08-11 14:37:22'),
(13, 5, 0, 40, '2025-08-11 14:40:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intentos`
--

CREATE TABLE `intentos` (
  `intento_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `juego_id` int(11) DEFAULT NULL,
  `puntaje` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegos`
--

CREATE TABLE `juegos` (
  `juego_id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `materia_id` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `url_img` varchar(255) NOT NULL,
  `valoracion` float NOT NULL,
  `url_juego` varchar(255) NOT NULL,
  `niveles` int(10) NOT NULL,
  `url_dash` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juegos`
--

INSERT INTO `juegos` (`juego_id`, `titulo`, `descripcion`, `materia_id`, `fecha_creacion`, `url_img`, `valoracion`, `url_juego`, `niveles`, `url_dash`) VALUES
(1, 'wordle', 'Wordle es un juego de palabras en el que el estudiante tiene que adivinar una palabra secreta en un número limitado de intentos', 6, '2025-05-15 00:00:00', 'Resources/Imagenes/wordle.webp', 5, 'wordle_intro', 0, 'dash_wordle'),
(2, 'rompecabezas', 'Rompecabezas es un juego de lógica visual en el que el estudiante debe reconstruir una imagen dividiéndola en piezas desordenadas. El objetivo es colocar cada parte en su lugar correcto, prestando atención a formas, colores y detalles. Es ideal para ejercitar la observación, la concentración y el reconocimiento espacial mientras se resuelve un desafío concreto.', 2, '2025-04-12 00:00:00', 'Resources/Imagenes/rompecabezas.webp', 4, 'juego_intro', 0, 'dash_rompecabezas'),
(3, 'Memory card', 'El estudiante debera encontrar todos los pares de las cartas antes de que se termine el tiempo', 7, '2025-04-12 00:00:00', 'Resources/Imagenes/memory_card.webp', 4, 'juego_intro', 4, 'dash_memory'),
(4, 'Ahorcado', 'Ahorcado es un juego de palabras en el que el estudiante debe descubrir una palabra oculta letra por letra antes de completar la figura del ahorcado.', 1, '2025-04-12 00:00:00', 'Resources/Imagenes/ahorcado.webp', 4, 'ahorcado_intro', 0, ''),
(5, 'Resolver ecuaciones', 'Una competencia con estaciones que combinan desafíos físicos y preguntas sobre hábitos saludables o deporte. Gana el equipo con mejor combinación de velocidad y conocimientos.', 5, '2025-04-12 00:00:00', 'Resources/Imagenes/ecuaciones.webp', 4, 'exactas', 0, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_memory`
--

CREATE TABLE `niveles_memory` (
  `id_nivel` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_creador_us` int(11) NOT NULL,
  `actividad_juego` varchar(1000) NOT NULL,
  `desc_actividad` varchar(1000) NOT NULL,
  `tiempo_para_resolver` time(4) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `id_juego` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles_memory`
--

INSERT INTO `niveles_memory` (`id_nivel`, `id_area`, `id_creador_us`, `actividad_juego`, `desc_actividad`, `tiempo_para_resolver`, `fecha_creacion`, `id_juego`) VALUES
(1, 7, 5, 'diferenciar los distintos símbolos esquemáticos', 'En la actividad de hoy, el objetivo será que los estudiantes aprendan a reconocer y diferenciar los distintos símbolos esquemáticos utilizados en los circuitos electrónicos. Se trabajará en la identificación precisa de cada símbolo y su función dentro del circuito.', '00:00:40.0000', '2025-05-13', 3),
(2, 7, 5, 'diferenciar las distintas herramientas utilizadas para carpintería', 'En la actividad de hoy, el objetivo será que los estudiantes aprendan a reconocer y diferenciar las distintas herramientas utilizadas en carpintería. Se trabajará en la identificación precisa de cada herramienta, su forma y su función específica dentro del taller, comprendiendo su uso correcto y seguro en distintas etapas del trabajo con madera.', '00:00:55.0000', '2025-05-13', 3),
(3, 2, 15, ' Identificar moléculas simples y sus elementos constitutivos', 'En la actividad de hoy, los estudiantes aprenderán a reconocer algunas de las moléculas más simples que encontramos en la vida cotidiana. El objetivo es que puedan identificar su composición química, sus elementos constituyentes y la función o presencia d', '00:00:50.0000', '2025-05-31', 3),
(4, 2, 15, 'Figuras geométricas planas y sus propiedades', 'En esta actividad, los estudiantes repasarán y reforzarán sus conocimientos sobre figuras geométricas planas. A través del juego, deberán relacionar cada figura con sus propiedades fundamentales, como la cantidad de lados, vértices, simetría o clasificación según sus ángulos. Esta dinámica contribuye a desarrollar la visualización espacial y el vocabulario técnico relacionado con la geometría.', '00:00:50.0000', '2025-06-01', 3),
(5, 5, 15, 'Capacidades físicas y sistemas del cuerpo en el ejercicio', 'Este nivel desafía a los estudiantes a identificar distintas capacidades físicas fundamentales para el rendimiento corporal, así como los principales sistemas del cuerpo que intervienen durante la actividad física. Se busca desarrollar una comprensión más técnica del cuerpo humano en movimiento, vinculando biología con práctica deportiva.', '00:00:50.0000', '2025-06-01', 3),
(6, 5, 15, ' Técnicas de natación y fundamentos acuáticos', 'En esta actividad, los estudiantes deberán identificar los principales estilos de natación competitiva, así como habilidades y elementos esenciales asociados al rendimiento en el agua. Este nivel promueve el conocimiento técnico del deporte, estimula el reconocimiento visual de movimientos y refuerza la comprensión de la biomecánica básica aplicada a la natación.', '00:00:50.0000', '2025-06-01', 3),
(7, 6, 15, ' Formas del relieve terrestre: Mesetas, llanuras y montañas', 'En este nivel, los estudiantes aprenderán a reconocer distintos tipos de relieve presentes en la superficie terrestre. A través del juego de memoria, identificarán visualmente cada formación geográfica, asociándola con sus características principales, su origen y su distribución en el planeta. Este conocimiento es clave para la comprensión de los paisajes naturales y su influencia en la vida humana y el clima.', '00:00:50.0000', '2025-06-02', 3),
(8, 6, 15, 'Culturas y creencias: los pueblos originarios de Argentina', 'Este nivel introduce a los estudiantes en el mundo de la antropología a través del reconocimiento de culturas, rituales y sistemas de creencias de los pueblos originarios de Argentina. Se busca promover el respeto por la diversidad cultural y el conocimiento de las tradiciones ancestrales que forman parte de la identidad del país. Las cartas mostrarán elementos simbólicos, costumbres y prácticas religiosas que han sido parte de la vida de estas comunidades.', '00:00:50.0000', '2025-06-02', 3),
(9, 1, 15, ' El circuito de la comunicación', 'En este nivel, los estudiantes descubrirán los componentes fundamentales del circuito de la comunicación. A través de la asociación de imágenes y conceptos clave, aprenderán a reconocer cada elemento del proceso comunicativo y su función. Se busca que los chicos puedan identificar en diversas situaciones quién es el emisor, receptor, cuál es el canal, el código, el mensaje y el referente.', '00:00:50.0000', '2025-06-02', 3),
(10, 1, 15, 'Tipos de textos y recursos de cohesión', 'En este nivel, los chicos aprenderán a diferenciar los principales tipos de textos que usamos para comunicarnos: narrativos, descriptivos, instructivos y más. Además, conocerán algunos recursos de cohesión importantes como la sinonimia o la hiponimia, que ayudan a dar fluidez y coherencia a los mensajes escritos. Esta actividad refuerza habilidades de lectura y escritura desde un enfoque lúdico.', '00:00:50.0000', '2025-06-02', 3),
(12, 6, 15, 'Aprender sobre el país brasl', 'Aprender sobre el país brasl', '00:00:33.0000', '2025-06-09', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_us`
--

CREATE TABLE `niveles_us` (
  `id_nivel_us` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_juego` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles_us`
--

INSERT INTO `niveles_us` (`id_nivel_us`, `id_nivel`, `id_area`, `id_us`, `fecha`, `id_juego`) VALUES
(6, 3, 7, 5, '2025-07-30', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades`
--

CREATE TABLE `novedades` (
  `id_novedad` int(11) NOT NULL,
  `titulo_novedad` varchar(255) DEFAULT NULL,
  `subtitulo_novedad` varchar(255) DEFAULT NULL,
  `cuerpo_novedad` varchar(3000) DEFAULT NULL,
  `url_foto_novedad` varchar(255) DEFAULT NULL,
  `fecha_novedad` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades`
--

INSERT INTO `novedades` (`id_novedad`, `titulo_novedad`, `subtitulo_novedad`, `cuerpo_novedad`, `url_foto_novedad`, `fecha_novedad`) VALUES
(1, 'Torneo de actividades Ludicas', 'Se realizara un torneo sobre actividades ludicas en la Escuela de Educación Secundaria Técnica Nro 1 Eduardo Ader', 'El  dia lunes 20 del mes de octubre los estudiantes de la institucion Técnica Nro 1 \"Eduardo Ader, podran competir entre ellos el los distintos juegos en los que se cuenta en la aplicacion. El evento se hara en la franja horaria de 10hs hasta las 11.55hs, para poder participar se deberan inscribir con anterioridad', 'Resources/Imagenes/Novedades/torneo.png', '2025-01-01'),
(2, 'Nuevos juegos en Ludiversoo', 'Con el equipo de ludivero desarrollamos nuevos juegos para ustedes. Dentro de poco estaran disponibles', 'Nos complace anunciar que con el equipo de Ludivero hemos estado trabajando arduamente para ofrecerles una emocionante selección de nuevos juegos. Nuestro objetivo es brindarles experiencias aún más entretenidas y divertidas que disfrutarán en sus momentos libres.\r\nEstos nuevos juegos están diseñados pensando en ustedes, con características innovadoras y dinámicas que prometen captar su atención y mantenerlos enganchados. Dentro de poco, estarán disponibles para que todos puedan disfrutarlos. Estamos seguros de que les encantarán tanto como a nosotros.\r\n¡Manténganse atentos para más detalles sobre el lanzamiento! ¡No querrán perdérselos!', 'Resources/Imagenes/Novedades/torneo.png', '2025-04-12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `palabras_ahorcado`
--

CREATE TABLE `palabras_ahorcado` (
  `id_palabra` int(11) NOT NULL,
  `palabra` varchar(100) NOT NULL,
  `pista` varchar(255) NOT NULL,
  `materia_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `palabras_ahorcado`
--

INSERT INTO `palabras_ahorcado` (`id_palabra`, `palabra`, `pista`, `materia_id`) VALUES
(1, 'PERIODICO', 'Medio de comunicación impreso', 1),
(2, 'REPORTERO', 'Persona que recoge y transmite noticias', 1),
(3, 'ENTREVISTA', 'Conversación para obtener información', 1),
(4, 'NOTICIA', 'Información sobre un hecho reciente', 1),
(5, 'ARTICULO', 'Texto periodístico sobre un tema', 1),
(6, 'MATEMATICA', 'Ciencia de los números y formas', 2),
(7, 'QUIMICA', 'Estudio de la materia y sus cambios', 2),
(8, 'FISICA', 'Ciencia que estudia la energía y materia', 2),
(9, 'BIOLOGIA', 'Estudio de los seres vivos', 2),
(10, 'ATOMO', 'Partícula más pequeña de un elemento', 2),
(11, 'DEPORTE', 'Actividad física competitiva', 5),
(12, 'ATLETISMO', 'Conjunto de pruebas deportivas', 5),
(13, 'NATACION', 'Deporte acuático', 5),
(14, 'FUTBOL', 'Deporte de equipo con balón', 5),
(15, 'BASQUET', 'Deporte con canasta y pelota', 5),
(16, 'HISTORIA', 'Estudio del pasado', 6),
(17, 'GEOGRAFIA', 'Estudio de la Tierra', 6),
(18, 'ECONOMIA', 'Estudio de la producción y consumo', 6),
(19, 'POLITICA', 'Actividad de gobierno', 6),
(20, 'CULTURA', 'Conjunto de costumbres y creencias', 6),
(21, 'HERRAMIENTA', 'Instrumento para trabajar', 7),
(22, 'MARTILLO', 'Herramienta para golpear', 7),
(23, 'DESTORNILLADOR', 'Herramienta para tornillos', 7),
(24, 'SERRUCHO', 'Herramienta para cortar', 7),
(25, 'TALADRO', 'Herramienta para perforar', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `pregunta_id` int(11) NOT NULL,
  `juego_id` int(11) DEFAULT NULL,
  `texto` text NOT NULL,
  `tipo` enum('multiple_choice','verdadero_falso','completar') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntaje_juego`
--

CREATE TABLE `puntaje_juego` (
  `id_puntaje` int(10) NOT NULL,
  `id_juego` int(10) NOT NULL,
  `id_us` int(10) NOT NULL,
  `input_diver` varchar(255) NOT NULL,
  `input_dificultad` varchar(255) NOT NULL,
  `input_diseno` varchar(255) NOT NULL,
  `input_punto_fuerte` varchar(255) NOT NULL,
  `input_futuro` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puntaje_juego`
--

INSERT INTO `puntaje_juego` (`id_puntaje`, `id_juego`, `id_us`, `input_diver`, `input_dificultad`, `input_diseno`, `input_punto_fuerte`, `input_futuro`) VALUES
(1, 2, 5, '3', '2', '2', 'jugabilidad', 'nuevos_niveles'),
(2, 2, 5, '2', '2', '1', 'jugabilidad', 'nuevos_niveles'),
(3, 3, 5, '2', '2', '1', 'jugabilidad', 'nuevos_niveles');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ranking_ahorcado`
--

CREATE TABLE `ranking_ahorcado` (
  `id_ranking` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `intentos_fallidos` int(11) NOT NULL,
  `tiempo` int(11) NOT NULL,
  `victoria` tinyint(1) NOT NULL DEFAULT 0,
  `palabra_jugada` varchar(50) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rankin_wordle`
--

CREATE TABLE `rankin_wordle` (
  `id_ranking` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `tiempo` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rankin_wordle`
--

INSERT INTO `rankin_wordle` (`id_ranking`, `id_us`, `aciertos`, `tiempo`, `fecha`) VALUES
(1, 5, 6, 95, '2025-07-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resources_juego`
--

CREATE TABLE `resources_juego` (
  `id_rources` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `url_img` text NOT NULL,
  `titulo_img` text NOT NULL,
  `descripcion_img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resources_juego`
--

INSERT INTO `resources_juego` (`id_rources`, `id_nivel`, `url_img`, `titulo_img`, `descripcion_img`) VALUES
(1, 1, '1.png', 'Condensador', 'un condensador es un dispositivo capaz de almacenar energía en forma de campo eléctrico. Está formado por dos armaduras metálicas paralelas'),
(2, 1, '2.png', 'Electroválvula ', 'Una electroválvula es un dispositivo electromecánico que controla el flujo de fluidos, como líquidos o gases, mediante la aplicación de una corriente eléctrica. Funciona abriendo o cerrando un orificio a través del cual el fluido puede fluir.'),
(3, 1, '3.png', 'Fuente de tensión', 'Dispositivo que suministra energía eléctrica a un circuito, proporcionando un voltaje constante o variable que permite el funcionamiento de los componentes electrónicos.'),
(4, 1, '4.png', 'Transistor', 'Componente semiconductor que actúa como interruptor o amplificador, controlando el flujo de corriente eléctrica en circuitos electrónicos.'),
(5, 1, '5.png', 'Inductor', 'Componente pasivo que almacena energía en un campo magnético cuando circula corriente, utilizado en filtros, transformadores y fuentes de energía.'),
(6, 1, '6.png', 'Resistencia', 'Dispositivo que limita o regula el flujo de corriente eléctrica en un circuito, protegiendo componentes y ajustando niveles de voltaje.'),
(7, 1, '7.png', 'Transistor de efecto de campo tipo N de canal de empobrecimiento', 'Semiconductor que controla el flujo de corriente aplicando un voltaje negativo, operando en un estado normalmente conductor que puede bloquearse al modificar el campo eléctrico.'),
(8, 1, '8.png', 'TRIAC (Interruptor bidireccional controlado por corriente)', 'Dispositivo semiconductor que permite controlar la corriente alterna en ambas direcciones, utilizado en reguladores de potencia, controles de luz y motores.'),
(25, 2, 'bisagra.png', 'Bisagra de cazoleta', 'También llamada bisagra oculta o europea. Se instala dentro de un agujero circular y permite ajustar puertas de muebles en varias direcciones.'),
(26, 2, 'escuadra.png', 'Escuadra combinada', 'Herramienta multifunción con regla y cabezal ajustable que permite trazar y verificar ángulos de 90° y 45°, e incluye nivel y punzón.'),
(27, 2, 'formon.png', 'Formón', 'Cincel de carpintero que se usa para tallar o ajustar ensambles en madera. Funciona con la mano o mazo, y viene en varios anchos.'),
(28, 2, 'gubias.png', 'Gubias de tallado', 'Herramientas similares a los formones pero con hoja curva o en “U” o “V”, ideales para tallar y esculpir madera de forma decorativa.'),
(29, 2, 'ingletadora.png', 'Ingletadora', 'Sierra especial para cortar madera en ángulos precisos como 45° o 90°, usada comúnmente en molduras y marcos. Puede ser manual o eléctrica.'),
(30, 2, 'sargento.png', 'Sargento de prensa', 'Herramienta de sujeción que mantiene firmemente dos piezas unidas durante el pegado, taladrado o ensamblado.'),
(31, 2, 'sierra_banco.png', 'Sierra de banco', 'Herramienta estacionaria con hoja circular que permite cortes rectos y precisos. Se usa para cortes longitudinales o transversales en madera.'),
(32, 2, 'tarugo.png', 'Tarugo de madera', 'Cilindro de madera dura que se usa para unir piezas mediante orificios alineados y encolado. Da uniones firmes sin tornillos visibles.'),
(33, 3, 'agua.webp', 'Agua (H₂O)', 'Compuesta por dos átomos de hidrógeno y uno de oxígeno. Es esencial para la vida y está presente en la mayoría de los seres vivos.'),
(34, 3, 'dio.webp', 'Dióxido de carbono (CO₂)', 'Gas que exhalamos al respirar y que las plantas utilizan en la fotosíntesis para producir oxígeno y glucosa.'),
(35, 3, 'oxigeno.webp', 'Oxígeno (O₂)', 'Molécula formada por dos átomos de oxígeno. Es vital para la respiración de los seres vivos aeróbicos.'),
(36, 3, 'nitrogeno.webp', 'Nitrógeno (N₂)', 'Gas incoloro e inodoro que representa el 78% del aire atmosférico. No es respirable directamente, pero las plantas lo absorben en forma de compuestos.'),
(37, 3, 'metano.webp', 'Metano (CH₄)', 'Compuesto formado por un átomo de carbono y cuatro de hidrógeno. Es un gas inflamable utilizado como fuente de energía.'),
(38, 3, 'amoniaco.webp', 'Amoníaco (NH₃)', 'Molécula compuesta por un átomo de nitrógeno y tres de hidrógeno. Se encuentra en productos de limpieza y fertilizantes.'),
(39, 3, 'ozono.webp', 'Ozono (O₃)', 'Compuesta por tres átomos de oxígeno. Forma una capa en la atmósfera que nos protege de los rayos ultravioleta del Sol.'),
(40, 3, 'naci.webp', 'Cloruro de sodio (NaCl)', 'La sal de mesa común. Formada por un átomo de sodio y uno de cloro. Se utiliza para sazonar alimentos y conservarlos.'),
(41, 4, '1748818402968-503140899.webp', 'Triángulo equilátero', 'Figura de tres lados iguales y tres ángulos internos de 60°. Es simétrica y se clasifica como regular.'),
(42, 4, '1748818402968-532937819.webp', 'Cuadrado', 'Tiene cuatro lados y cuatro ángulos rectos. Todos sus lados son iguales.'),
(43, 4, '1748818402969-488272125.webp', 'Rectángulo', 'Cuatro lados, con lados opuestos iguales y cuatro ángulos rectos.'),
(44, 4, '1748818402969-122345557.webp', 'Círculo', 'Figura curva sin lados ni vértices. Su distancia del centro al borde se llama radio.'),
(45, 4, '1748818402970-487335458.webp', 'Trapecio', 'Cuadrilátero con solo un par de lados paralelos. Puede ser isósceles, escaleno o rectángulo.'),
(46, 4, '1748818402970-372430830.webp', 'Rombo', 'Cuatro lados iguales, pero ángulos no necesariamente rectos. Tiene dos ejes de simetría.'),
(47, 4, '1748818402970-911226367.webp', 'Pentágono', 'Figura de cinco lados y cinco vértices'),
(48, 4, '1748818402971-213377059.webp', 'Hexágono', 'Figura de seis lados, presente en estructuras como los panales de abejas.'),
(49, 5, '1748819587423-195685390.webp', 'Resistencia cardiovascular', 'Capacidad del corazón y los pulmones para suministrar oxígeno al cuerpo durante esfuerzos prolongados.'),
(50, 5, '1748819587423-782792734.webp', 'Fuerza muscular', 'Habilidad para ejercer tensión muscular contra una resistencia.'),
(51, 5, '1748819587423-244251105.webp', 'Flexibilidad', 'Capacidad de las articulaciones para moverse con amplitud.'),
(52, 5, '1748819587424-667810245.webp', 'Velocidad', 'Capacidad de realizar un movimiento en el menor tiempo posible.'),
(53, 5, '1748819587425-936641393.webp', 'Coordinación', 'Habilidad para sincronizar correctamente los movimientos del cuerpo.'),
(54, 5, '1748819587427-517369837.webp', 'Sistema respiratorio', 'Encargado de suministrar oxígeno y eliminar dióxido de carbono durante el ejercicio.'),
(55, 5, '1748819587427-164275319.webp', 'Sistema circulatorio', 'Transporta oxígeno y nutrientes a los músculos durante la actividad física.'),
(56, 5, '1748819587428-736594567.webp', 'Sistema muscular', 'Proporciona el movimiento y la estabilidad necesarios para la actividad física.'),
(57, 6, '1748820596511-894359523.webp', 'Crol (libre)', 'Estilo de nado más rápido y común, caracterizado por brazadas alternas y patada de batido.'),
(58, 6, '1748820596511-70945417.webp', 'Espalda', 'Estilo que se realiza boca arriba, con brazadas continuas hacia atrás y patada de batido.'),
(59, 6, '1748820596511-186179739.webp', 'Pecho (braza)', 'Estilo simétrico donde los brazos se extienden hacia adelante y se acompañan con una patada tipo rana.'),
(60, 6, '1748820596511-600350456.webp', 'Mariposa', 'Estilo exigente que combina movimientos simultáneos de brazos en forma de arco con una patada tipo delfín.'),
(61, 6, '1748820596512-295568465.webp', 'Viraje', 'Movimiento técnico que se utiliza al llegar al borde de la piscina para impulsarse y continuar el recorrido.'),
(62, 6, '1748820596512-169264313.webp', 'Salida de plataforma', 'Técnica de inicio explosivo desde una plataforma elevada, importante para competiciones.'),
(63, 6, '1748820596512-586264129.webp', 'Respiración lateral', 'Técnica usada principalmente en el crol, donde se gira la cabeza a un lado para tomar aire sin interrumpir el ritmo.'),
(64, 6, '1748820596512-177402206.webp', 'Flotación horizontal', 'Habilidad básica para mantenerse en equilibrio en el agua con el cuerpo alineado.'),
(65, 7, '1748875722671-784710228.webp', 'Meseta', 'Terreno plano ubicado a gran altitud. Se forma por erosión o movimientos tectónicos y se caracteriza por tener pendientes abruptas en sus bordes.'),
(66, 7, '1748875722671-650224202.webp', 'Llanura', 'Zona extensa y plana a baja altitud. Es común en áreas cercanas a ríos y se utiliza frecuentemente para la agricultura.'),
(67, 7, '1748875722671-909980956.webp', 'Montaña', 'Elevación natural del terreno con gran pendiente. Se forma por el choque de placas tectónicas.'),
(68, 7, '1748875722674-590310675.webp', 'Valle', 'Depresión del terreno entre montañas o colinas, usualmente recorrida por un río.'),
(69, 7, '1748875722675-110704468.webp', 'Cañón', 'Garganta profunda y estrecha formada por la erosión de un río durante millones de años.'),
(70, 7, '1748875722677-867206732.webp', 'Colina', 'Elevación del terreno más baja y suave que una montaña. Se forma por acumulación de sedimentos o erosión.'),
(71, 7, '1748875722677-592484276.webp', 'Depresión', 'Zona del terreno que está por debajo del nivel del mar o del relieve circundante. Puede ser natural o resultado de hundimientos.'),
(72, 7, '1748875722679-494957354.webp', 'Delta fluvial', 'Área de acumulación de sedimentos en la desembocadura de un río, con forma triangular y múltiples brazos de agua.'),
(73, 8, '1748876281163-769694826.webp', 'Pueblo Mapuche', 'Pueblo originario del sur argentino. Conocidos por su resistencia histórica y sus prácticas comunitarias. Valoran fuertemente la naturaleza y la tierra (\"Ñuke Mapu\").'),
(74, 8, '1748876281166-529558687.webp', 'Machis (Curanderos Mapuche)', 'Líderes espirituales que practican rituales de sanación. Son figuras clave dentro de la espiritualidad mapuche.'),
(75, 8, '1748876281167-237900435.webp', 'Pueblo Qom (Toba)', 'Habitan el norte del país. Su cultura se basa en la vida en comunidad, la caza, la pesca y el respeto por los ancestros.'),
(76, 8, '1748876281169-564909121.webp', 'Ceremonia del Inti Raymi', 'Ritual de origen andino que celebra al Sol. Aunque se origina en Perú, pueblos del noroeste argentino también lo practican.'),
(77, 8, '1748876281170-941494508.webp', 'Yupana (Ábaco Andino)', 'Herramienta de cálculo usada por culturas andinas como los quechuas y aimaras. Refleja un sistema de conocimiento ancestral.'),
(78, 8, '1748876281171-999485924.webp', 'Wiphala', 'Bandera de colores que representa a los pueblos originarios andinos. Simboliza la armonía y la convivencia con la naturaleza.'),
(79, 8, '1748876281171-543558064.webp', 'La Pachamama', 'Madre Tierra en la cosmovisión andina. Cada agosto, se le hacen ofrendas para agradecer sus frutos y pedir protección.'),
(80, 8, '1748876281213-964018406.webp', 'Chamanismo Guaraní', 'Sistema de creencias del pueblo guaraní basado en espíritus de la naturaleza. Los chamanes median entre el mundo espiritual y el terrenal.'),
(81, 9, '1748876927396-404809487.webp', 'Emisor', 'Persona o entidad que produce y envía el mensaje. Por ejemplo, un profesor que da una clase.'),
(82, 9, '1748876927396-701545612.webp', 'Receptor', 'Quien recibe e interpreta el mensaje. En una charla, el oyente cumple este rol.'),
(83, 9, '1748876927396-685898123.webp', 'Mensaje', 'La información que se transmite entre el emisor y el receptor. Puede ser verbal o no verbal.'),
(84, 9, '1748876927396-465766718.webp', 'Canal', 'El medio por el cual se transmite el mensaje. Puede ser el aire, una carta, un celular, etc.'),
(85, 9, '1748876927397-445144732.webp', 'Código', 'Sistema de signos que el emisor y el receptor deben compartir. Por ejemplo, el idioma español.'),
(86, 9, '1748876927397-341022291.webp', 'Referente', 'El tema o realidad a la que hace referencia el mensaje. Por ejemplo, hablar sobre el clima.'),
(87, 9, '1748876927397-50021191.webp', 'Comunicación verbal', 'Cuando el mensaje se transmite con palabras habladas o escritas. Ejemplo: una conversación.'),
(88, 9, '1748876927418-208465032.webp', 'Comunicación no verbal', 'Mensajes transmitidos sin palabras, como gestos, expresiones faciales o posturas.'),
(89, 10, '1748877784757-304561550.webp', 'Texto narrativo', 'Cuenta una historia real o ficticia con personajes, un conflicto y un desenlace. Ejemplo: un cuento.'),
(90, 10, '1748877784757-433672678.webp', 'Texto descriptivo', 'Explica cómo es algo o alguien usando muchos detalles. Ejemplo: una descripción de una persona.'),
(91, 10, '1748877784759-925654626.webp', 'Texto argumentativo', 'Presenta una idea u opinión con razones para convencer. Ejemplo: una carta de opinión.'),
(92, 10, '1748877784759-565576324.webp', 'Texto instructivo', 'Da pasos o indicaciones para hacer algo. Ejemplo: una receta de cocina.'),
(93, 10, '1748877784760-378970160.webp', 'Sinonimia', 'Palabras diferentes con significados parecidos. Ejemplo: “feliz” y “contento”.'),
(94, 10, '1748877784760-125614741.webp', 'Antonimia', 'Palabras con significados opuestos. Ejemplo: “grande” y “pequeño”.'),
(95, 10, '1748877784761-839011025.webp', 'Hiperonimia', 'Palabra general que agrupa otras más específicas. Ejemplo: “fruta” es hiperónimo de “manzana”.'),
(96, 10, '1748877784761-342142657.webp', 'Hiponimia', 'Palabra específica que pertenece a un grupo más general. Ejemplo: “perro” es hipónimo de “animal”.'),
(99, 12, '090ef001fb59e1da.webp', 'ss', 'ss'),
(100, 12, '5b1689261e639b40.webp', 'ww', 'ww');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `respuesta_id` int(11) NOT NULL,
  `pregunta_id` int(11) DEFAULT NULL,
  `texto` text NOT NULL,
  `es_correcta` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `recibir_nov` tinyint(1) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('alumno','root','profesor','directivo') NOT NULL,
  `daltonismo` enum('no_daltonico','protanopia','deuteranopia','tritanopia','protanomaly','deuteranomaly','tritanomaly','acromatopsia','acromatomaly','otro') DEFAULT NULL,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombre`, `apellido`, `nombre_usuario`, `email`, `recibir_nov`, `contraseña`, `rol`, `daltonismo`, `reset_password_token`, `reset_password_expires`) VALUES
(5, 'Francisco', 'Suchomela', 'fransucho', 'franciscosuchomela@gmail.com', 1, '$2b$10$xtobt7uMfLAKDmTaR62SJuwXzJ5E09iyL1YlBb2nSK0IMdKlQmLpm', 'alumno', 'acromatopsia', NULL, NULL),
(9, 'jorge', 'almiron', 'jorgealmiron', 'jorgealmiron@gmail.com', 0, '$2b$10$CLLeEJ3GNyLCVfHYC.iySOqTiqd/tC80aCD8Yt3SnsnTQpmJ9rC5G', 'directivo', NULL, NULL, NULL),
(12, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelass@gmail.com', 0, '$2b$10$GURk.7Xwfu6Q936IiqGnnu.zdh8DK8z4fnMXWjS13uiiEMGYoz39.', 'alumno', NULL, NULL, NULL),
(13, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelasss@gmail.com', 0, '$2b$10$NqcXencqzseAIyPlvgdhFOiYu9pSbeFhrfKidDUVxmMYPZUTUnIDO', 'alumno', NULL, NULL, NULL),
(15, 'Francisco', 'Suchomela', 'root', 'root@gmail.com', 0, '$2b$10$uxAMYrN7wnfcmVGTOnH3YOi.x2CW/GCtiteQM7cBiAy.IkON/FdPW', 'root', NULL, NULL, NULL),
(18, 'Francisco', 'Suchomela', 'davidmingueza12', 'franciscosuchomela1@gmail.com', 0, '$2b$10$labEk2dYhDWQWAW/x4AvMOCX9ViChzwR9TTqV4yiBqGuXX07GcvJ2', 'alumno', 'deuteranopia', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wordle`
--

CREATE TABLE `wordle` (
  `id_palabra` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `palabra` varchar(255) NOT NULL,
  `descrip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `wordle`
--

INSERT INTO `wordle` (`id_palabra`, `id_area`, `palabra`, `descrip`) VALUES
(1, 1, 'alfabetos', '        conjunto de letras de un idiomas'),
(2, 1, 'oracion', 'conjunto de palabras con sentido completo'),
(3, 1, 'verbo', 'palabra que indica accion o estado'),
(4, 1, 'sujeto', 'persona o cosa que realiza la accion'),
(5, 1, 'predicado', 'lo que se dice del sujeto'),
(6, 1, 'texto', 'conjunto de oraciones con un mensaje'),
(7, 1, 'letra', 'unidad basica del alfabeto'),
(8, 1, 'parrafo', 'conjunto de oraciones relacionadas'),
(9, 1, 'comunicacion', 'proceso de intercambio de informacion'),
(10, 1, 'mensaje', 'contenido que se transmite'),
(11, 1, 'escucha', 'accion de oir activamente'),
(12, 1, 'dialogo', 'intercambio oral entre personas'),
(13, 1, 'lectura', 'accion de interpretar un texto'),
(14, 1, 'cuento', 'relato corto de ficcion'),
(15, 1, 'narracion', 'relato de hechos reales o imaginarios'),
(16, 1, 'escritura', 'accion de plasmar palabras'),
(17, 1, 'poesia', 'composicion literaria que expresa sentimientos'),
(18, 1, 'relato', 'narracion de una historia'),
(19, 1, 'significado', 'lo que quiere decir una palabra'),
(20, 1, 'gramatica', 'conjunto de reglas del lenguaje'),
(21, 1, 'puntuar', 'usar signos para estructurar el texto'),
(22, 1, 'lenguaje', 'sistema de comunicacion verbal o escrito'),
(23, 1, 'oralidad', 'forma de comunicarse mediante la voz'),
(24, 1, 'argumento', 'idea principal de un texto'),
(25, 1, 'redaccion', 'accion de escribir con claridad y coherencia'),
(26, 1, 'vocablo', 'palabra en un idioma'),
(27, 1, 'lexico', 'conjunto de palabras de una lengua'),
(28, 1, 'metafora', 'comparacion implicita entre dos cosas'),
(29, 1, 'literal', 'significado exacto de una palabra'),
(30, 1, 'frase', 'grupo de palabras con sentido'),
(151, 1, 'mensaje', 'Información transmitida entre emisor y receptor.'),
(152, 1, 'diálogo', 'Conversación entre dos o más personas.'),
(153, 1, 'comunicación', 'Proceso de intercambio de información.'),
(154, 1, 'lenguaje', 'Sistema de signos para comunicarse.'),
(155, 1, 'señal', 'Indicio que comunica algo.'),
(156, 1, 'expresión', 'Manifestación de ideas o sentimientos.'),
(157, 1, 'voz', 'Sonido producido al hablar.'),
(158, 1, 'texto', 'Conjunto de palabras con sentido.'),
(159, 1, 'oración', 'Unidad gramatical con sentido completo.'),
(160, 1, 'lectura', 'Interpretación de textos escritos.'),
(161, 1, 'escritura', 'Representación gráfica del lenguaje.'),
(162, 1, 'párrafo', 'Conjunto de oraciones relacionadas.'),
(163, 1, 'vocabulario', 'Conjunto de palabras de una lengua.'),
(164, 1, 'mensaje', 'Contenido que se transmite.'),
(165, 1, 'oralidad', 'Uso del lenguaje hablado.'),
(166, 1, 'escuchar', 'Acción de oír con atención.'),
(167, 1, 'noticia', 'Información reciente sobre un hecho.'),
(168, 1, 'metáfora', 'Comparación implícita entre elementos.'),
(169, 1, 'literal', 'Sentido exacto de una palabra.'),
(170, 1, 'frase', 'Grupo de palabras con significado.'),
(171, 2, 'átomo', 'Unidad básica de la materia.'),
(172, 2, 'molécula', 'Conjunto de átomos unidos.'),
(173, 2, 'energía', 'Capacidad para realizar trabajo.'),
(174, 2, 'fuerza', 'Interacción que cambia el movimiento.'),
(175, 2, 'gravedad', 'Fuerza que atrae hacia la Tierra.'),
(176, 2, 'velocidad', 'Rapidez de un movimiento.'),
(177, 2, 'masa', 'Cantidad de materia en un cuerpo.'),
(178, 2, 'peso', 'Fuerza que ejerce la gravedad.'),
(179, 2, 'temperatura', 'Medida del calor de un cuerpo.'),
(180, 2, 'volumen', 'Espacio que ocupa un cuerpo.'),
(181, 2, 'densidad', 'Relación entre masa y volumen.'),
(182, 2, 'ecosistema', 'Conjunto de seres vivos y su entorno.'),
(183, 2, 'célula', 'Unidad básica de los seres vivos.'),
(184, 2, 'oxígeno', 'Elemento vital para la respiración.'),
(185, 2, 'nitrógeno', 'Gas abundante en la atmósfera.'),
(186, 2, 'fotosíntesis', 'Proceso vegetal para producir alimento.'),
(187, 2, 'planeta', 'Cuerpo celeste que gira alrededor de una estrella.'),
(188, 2, 'luz', 'Forma de energía visible.'),
(189, 2, 'onda', 'Perturbación que se propaga en un medio.'),
(190, 2, 'ácido', 'Sustancia con pH menor que 7.'),
(191, 5, 'resistencia', 'Capacidad de sostener un esfuerzo prolongado.'),
(192, 5, 'fuerza', 'Capacidad de vencer una resistencia.'),
(193, 5, 'velocidad', 'Capacidad de realizar movimientos rápidos.'),
(194, 5, 'agilidad', 'Capacidad de cambiar de dirección rápidamente.'),
(195, 5, 'flexibilidad', 'Capacidad de mover articulaciones con amplitud.'),
(196, 5, 'coordinación', 'Sincronización de movimientos.'),
(197, 5, 'equilibrio', 'Control del cuerpo en movimiento o en reposo.'),
(198, 5, 'postura', 'Posición del cuerpo al estar de pie o sentado.'),
(199, 5, 'calentamiento', 'Ejercicios previos a la actividad física.'),
(200, 5, 'estiramiento', 'Ejercicios para alargar los músculos.'),
(201, 5, 'deporte', 'Actividad física reglamentada.'),
(202, 5, 'juego', 'Actividad recreativa con reglas.'),
(203, 5, 'recreación', 'Actividad para el tiempo libre.'),
(204, 5, 'higiene', 'Conjunto de cuidados del cuerpo.'),
(205, 5, 'hidratación', 'Consumo adecuado de líquidos.'),
(206, 5, 'salud', 'Estado de bienestar físico y mental.'),
(207, 5, 'nutrición', 'Proceso de obtención de nutrientes.'),
(208, 5, 'carrera', 'Desplazamiento rápido a pie.'),
(209, 5, 'salto', 'Despegue del cuerpo desde el suelo.'),
(211, 6, 'sociedad', 'Conjunto de personas que conviven.'),
(212, 6, 'cultura', 'Costumbres y conocimientos de un pueblo.'),
(213, 6, 'historia', 'Estudio de los hechos pasados.'),
(214, 6, 'economía', 'Administración de recursos y bienes.'),
(215, 6, 'política', 'Ciencia del gobierno y el poder.'),
(216, 6, 'estado', 'Organización política de un territorio.'),
(217, 6, 'ciudadanía', 'Derechos y deberes de los ciudadanos.'),
(218, 6, 'gobierno', 'Conjunto de autoridades de un estado.'),
(219, 6, 'democracia', 'Sistema político basado en la participación ciudadana.'),
(220, 6, 'población', 'Conjunto de habitantes de un lugar.'),
(221, 6, 'territorio', 'Espacio geográfico delimitado.'),
(222, 6, 'frontera', 'Límite entre territorios.'),
(223, 6, 'geografía', 'Ciencia que estudia la superficie terrestre.'),
(224, 6, 'migración', 'Desplazamiento de personas entre lugares.'),
(225, 6, 'trabajo', 'Actividad realizada para obtener bienes o servicios.'),
(226, 6, 'educación', 'Proceso de enseñanza y aprendizaje.'),
(227, 6, 'familia', 'Grupo de personas unidas por vínculos de parentesco.'),
(228, 6, 'patrimonio', 'Conjunto de bienes culturales heredados.'),
(229, 6, 'constitución', 'Norma fundamental de un estado.'),
(230, 6, 'justicia', 'Principio de equidad y legalidad.'),
(231, 7, 'martillo', 'Herramienta para golpear.'),
(232, 7, 'sierra', 'Herramienta para cortar materiales.'),
(233, 7, 'tornillo', 'Elemento metálico de fijación.'),
(234, 7, 'tuerca', 'Pieza que enrosca al tornillo.'),
(236, 7, 'destornillador', 'Herramienta para atornillar o desatornillar.'),
(237, 7, 'alicate', 'Herramienta para sujetar o cortar.'),
(238, 7, 'soldadura', 'Unión de materiales por fusión.'),
(239, 7, 'taladro', 'Herramienta para perforar.'),
(240, 7, 'esmeril', 'Herramienta para afilar o desbastar.'),
(241, 7, 'limadora', 'Máquina para dar forma con precisión.'),
(242, 7, 'torno', 'Máquina para mecanizar piezas cilíndricas.'),
(244, 7, 'escuadra', 'Herramienta para trazos rectos o perpendiculares.'),
(245, 7, 'nivel', 'Instrumento para verificar horizontalidad.'),
(246, 7, 'remache', 'Elemento de unión permanente.'),
(247, 7, 'chapa', 'Lámina delgada de metal.'),
(248, 7, 'tijera', 'Herramienta para cortar.'),
(249, 7, 'pintura', 'Sustancia usada para recubrir superficies.'),
(250, 7, 'cepillo', 'Herramienta para alisar madera.'),
(251, 7, 'cepillo', 'Herramienta para alisar madera.'),
(252, 7, 'pintura', 'Sustancia usada para recubrir superficies.'),
(253, 7, 'tijera', 'Herramienta para cortar.'),
(254, 7, 'chapas', 'Lámina delgada de metal.'),
(255, 7, 'remache', 'Elemento de unión permanente.'),
(256, 7, 'nivel', 'Herramienta para verificar horizontalidad.'),
(257, 7, 'escuadra', 'Herramienta para trazos rectos o perpendiculares.'),
(259, 7, 'torno', 'Máquina para mecanizar piezas cilíndricas.'),
(260, 7, 'limadora', 'Máquina para dar forma con precisión.'),
(261, 7, 'esmeril', 'Herramienta para afilar o desbastar.'),
(262, 7, 'taladro', 'Herramienta para perforar.'),
(263, 7, 'soldadura', 'Unión de materiales por fusión.'),
(264, 7, 'alicate', 'Herramienta para sujetar o cortar.'),
(265, 7, 'destornillador', 'Herramienta para atornillar o desatornillar.'),
(267, 7, 'tuerca', 'Pieza que enrosca el tornillo.'),
(268, 7, 'tornillo', 'Elemento metálico de fijación.'),
(269, 7, 'sierra', 'Herramienta para cortar materiales.'),
(270, 7, 'martillo', 'Herramienta para golpear.'),
(271, 7, 'cepillo', 'Herramienta para alisar madera.'),
(272, 7, 'pintura', 'Sustancia usada para recubrir superficies.'),
(273, 7, 'tijera', 'Herramienta para cortar.'),
(274, 7, 'chapas', 'Lámina delgada de metal.'),
(275, 7, 'remache', 'Elemento de unión permanente.'),
(276, 7, 'nivel', 'Herramienta para verificar horizontalidad.'),
(277, 7, 'escuadra', 'Herramienta para trazos rectos o perpendiculares.'),
(279, 7, 'torno', 'Máquina para mecanizar piezas cilíndricas.'),
(280, 7, 'limadora', 'Máquina para dar forma con precisión.'),
(281, 7, 'esmeril', 'Herramienta para afilar o desbastar.'),
(282, 7, 'taladro', 'Herramienta para perforar.'),
(283, 7, 'soldadura', 'Unión de materiales por fusión.'),
(284, 7, 'alicate', 'Herramienta para sujetar o cortar.'),
(285, 7, 'destornillador', 'Herramienta para atornillar o desatornillar.'),
(287, 7, 'tuerca', 'Pieza que enrosca el tornillo.'),
(288, 7, 'tornillo', 'Elemento metálico de fijación.'),
(289, 7, 'sierra', 'Herramienta para cortar materiales.');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`materia_id`);

--
-- Indices de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD PRIMARY KEY (`estadistica_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `juego_jugado` (`juego_jugado`),
  ADD KEY `id_nivel` (`id_nivel`);

--
-- Indices de la tabla `historial_ahorcado`
--
ALTER TABLE `historial_ahorcado`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_us` (`id_us`),
  ADD KEY `id_area` (`id_area`);

--
-- Indices de la tabla `historial_wordle`
--
ALTER TABLE `historial_wordle`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_us` (`id_us`);

--
-- Indices de la tabla `intentos`
--
ALTER TABLE `intentos`
  ADD PRIMARY KEY (`intento_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `juego_id` (`juego_id`);

--
-- Indices de la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD PRIMARY KEY (`juego_id`),
  ADD KEY `materia_id` (`materia_id`);

--
-- Indices de la tabla `niveles_memory`
--
ALTER TABLE `niveles_memory`
  ADD PRIMARY KEY (`id_nivel`),
  ADD KEY `id_area` (`id_area`,`id_creador_us`,`id_juego`),
  ADD KEY `id_juego` (`id_juego`),
  ADD KEY `id_creador_us` (`id_creador_us`);

--
-- Indices de la tabla `niveles_us`
--
ALTER TABLE `niveles_us`
  ADD PRIMARY KEY (`id_nivel_us`),
  ADD KEY `id_nivel` (`id_nivel`,`id_area`,`id_us`,`fecha`),
  ADD KEY `fecha` (`fecha`),
  ADD KEY `id_area` (`id_area`),
  ADD KEY `id_us` (`id_us`),
  ADD KEY `id_juego` (`id_juego`);

--
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD PRIMARY KEY (`id_novedad`);

--
-- Indices de la tabla `palabras_ahorcado`
--
ALTER TABLE `palabras_ahorcado`
  ADD PRIMARY KEY (`id_palabra`),
  ADD KEY `materia_id` (`materia_id`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`pregunta_id`),
  ADD KEY `juego_id` (`juego_id`);

--
-- Indices de la tabla `puntaje_juego`
--
ALTER TABLE `puntaje_juego`
  ADD PRIMARY KEY (`id_puntaje`),
  ADD KEY `id_juego` (`id_juego`,`id_us`),
  ADD KEY `id_us` (`id_us`);

--
-- Indices de la tabla `ranking_ahorcado`
--
ALTER TABLE `ranking_ahorcado`
  ADD PRIMARY KEY (`id_ranking`),
  ADD KEY `id_us` (`id_us`),
  ADD KEY `id_area` (`id_area`);

--
-- Indices de la tabla `rankin_wordle`
--
ALTER TABLE `rankin_wordle`
  ADD PRIMARY KEY (`id_ranking`),
  ADD KEY `id_us` (`id_us`);

--
-- Indices de la tabla `resources_juego`
--
ALTER TABLE `resources_juego`
  ADD PRIMARY KEY (`id_rources`),
  ADD KEY `id_juego` (`id_nivel`),
  ADD KEY `id_nivel` (`id_nivel`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`respuesta_id`),
  ADD KEY `pregunta_id` (`pregunta_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `wordle`
--
ALTER TABLE `wordle`
  ADD PRIMARY KEY (`id_palabra`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `materia_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  MODIFY `estadistica_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT de la tabla `historial_ahorcado`
--
ALTER TABLE `historial_ahorcado`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_wordle`
--
ALTER TABLE `historial_wordle`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `intentos`
--
ALTER TABLE `intentos`
  MODIFY `intento_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `juegos`
--
ALTER TABLE `juegos`
  MODIFY `juego_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `niveles_memory`
--
ALTER TABLE `niveles_memory`
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `niveles_us`
--
ALTER TABLE `niveles_us`
  MODIFY `id_nivel_us` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id_novedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `palabras_ahorcado`
--
ALTER TABLE `palabras_ahorcado`
  MODIFY `id_palabra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `pregunta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntaje_juego`
--
ALTER TABLE `puntaje_juego`
  MODIFY `id_puntaje` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ranking_ahorcado`
--
ALTER TABLE `ranking_ahorcado`
  MODIFY `id_ranking` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rankin_wordle`
--
ALTER TABLE `rankin_wordle`
  MODIFY `id_ranking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `resources_juego`
--
ALTER TABLE `resources_juego`
  MODIFY `id_rources` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `respuesta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `wordle`
--
ALTER TABLE `wordle`
  MODIFY `id_palabra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=291;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD CONSTRAINT `estadisticas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `estadisticas_ibfk_2` FOREIGN KEY (`juego_jugado`) REFERENCES `juegos` (`juego_id`),
  ADD CONSTRAINT `estadisticas_ibfk_3` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_memory` (`id_nivel`);

--
-- Filtros para la tabla `historial_ahorcado`
--
ALTER TABLE `historial_ahorcado`
  ADD CONSTRAINT `historial_ahorcado_ibfk_1` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `historial_ahorcado_ibfk_2` FOREIGN KEY (`id_area`) REFERENCES `areas` (`materia_id`);

--
-- Filtros para la tabla `historial_wordle`
--
ALTER TABLE `historial_wordle`
  ADD CONSTRAINT `historial_wordle_ibfk_1` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD CONSTRAINT `juegos_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `areas` (`materia_id`);

--
-- Filtros para la tabla `niveles_memory`
--
ALTER TABLE `niveles_memory`
  ADD CONSTRAINT `niveles_memory_ibfk_1` FOREIGN KEY (`id_area`) REFERENCES `areas` (`materia_id`),
  ADD CONSTRAINT `niveles_memory_ibfk_2` FOREIGN KEY (`id_juego`) REFERENCES `juegos` (`juego_id`),
  ADD CONSTRAINT `niveles_memory_ibfk_3` FOREIGN KEY (`id_creador_us`) REFERENCES `usuarios` (`usuario_id`);

--
-- Filtros para la tabla `niveles_us`
--
ALTER TABLE `niveles_us`
  ADD CONSTRAINT `niveles_us_ibfk_2` FOREIGN KEY (`id_area`) REFERENCES `areas` (`materia_id`),
  ADD CONSTRAINT `niveles_us_ibfk_3` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `niveles_us_ibfk_4` FOREIGN KEY (`id_juego`) REFERENCES `juegos` (`juego_id`);

--
-- Filtros para la tabla `palabras_ahorcado`
--
ALTER TABLE `palabras_ahorcado`
  ADD CONSTRAINT `palabras_ahorcado_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `areas` (`materia_id`);

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`juego_id`);

--
-- Filtros para la tabla `puntaje_juego`
--
ALTER TABLE `puntaje_juego`
  ADD CONSTRAINT `puntaje_juego_ibfk_1` FOREIGN KEY (`id_juego`) REFERENCES `juegos` (`juego_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `puntaje_juego_ibfk_2` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`);

--
-- Filtros para la tabla `ranking_ahorcado`
--
ALTER TABLE `ranking_ahorcado`
  ADD CONSTRAINT `ranking_ahorcado_ibfk_1` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `ranking_ahorcado_ibfk_2` FOREIGN KEY (`id_area`) REFERENCES `areas` (`materia_id`);

--
-- Filtros para la tabla `rankin_wordle`
--
ALTER TABLE `rankin_wordle`
  ADD CONSTRAINT `rankin_wordle_ibfk_1` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`pregunta_id`);
COMMIT;
