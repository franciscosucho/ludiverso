-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2025 a las 21:00:40
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
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `calificacion_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `juego_id` int(11) DEFAULT NULL,
  `estrellas` int(11) DEFAULT NULL CHECK (`estrellas` between 0 and 5),
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas`
--

CREATE TABLE `estadisticas` (
  `estadistica_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `juego_jugado` int(11) DEFAULT 0,
  `puntaje_total` int(11) DEFAULT 0,
  `fecha_actividad` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estadisticas`
--

INSERT INTO `estadisticas` (`estadistica_id`, `usuario_id`, `juego_jugado`, `puntaje_total`, `fecha_actividad`) VALUES
(3, 5, 3, 666, '2025-05-20 14:37:26'),
(4, NULL, 3, 651, '2025-05-14 14:57:25'),
(5, NULL, 3, 651, '2025-05-14 15:01:51'),
(6, NULL, 3, 651, '2025-05-14 15:02:39'),
(7, NULL, 3, 651, '2025-05-14 15:03:11'),
(8, NULL, 3, 651, '2025-05-14 15:03:11'),
(9, NULL, 3, 651, '2025-05-14 15:03:13'),
(10, NULL, 3, 651, '2025-05-14 15:03:13'),
(11, NULL, 3, 651, '2025-05-14 15:03:16'),
(12, NULL, 3, 651, '2025-05-14 15:03:16'),
(13, NULL, 3, 651, '2025-05-14 15:03:16'),
(14, NULL, 3, 651, '2025-05-14 15:03:19'),
(15, NULL, 3, 651, '2025-05-14 15:03:19'),
(16, NULL, 3, 651, '2025-05-14 15:03:19'),
(17, NULL, 3, 651, '2025-05-14 15:03:23'),
(18, NULL, 3, 651, '2025-05-14 15:03:23'),
(19, NULL, 3, 651, '2025-05-14 15:03:24'),
(20, NULL, 3, 651, '2025-05-14 15:03:24'),
(21, NULL, 3, 651, '2025-05-14 15:03:34'),
(22, NULL, 3, 651, '2025-05-14 15:03:37'),
(23, NULL, 3, 651, '2025-05-14 15:03:37'),
(24, NULL, 3, 651, '2025-05-14 15:03:55'),
(25, NULL, 3, 651, '2025-05-14 15:03:55'),
(26, NULL, 3, 651, '2025-05-14 15:03:55'),
(27, NULL, 3, 651, '2025-05-14 15:03:55'),
(28, NULL, 3, 651, '2025-05-14 15:03:55'),
(29, NULL, 3, 651, '2025-05-14 15:03:56'),
(30, NULL, 3, 651, '2025-05-14 15:03:56'),
(31, NULL, 3, 651, '2025-05-14 15:03:59'),
(32, NULL, 3, 651, '2025-05-14 15:03:59'),
(33, NULL, 3, 651, '2025-05-14 15:04:00'),
(34, NULL, 3, 651, '2025-05-14 15:04:00'),
(35, NULL, 3, 651, '2025-05-14 15:04:00'),
(36, NULL, 3, 651, '2025-05-14 15:04:12'),
(37, NULL, 3, 651, '2025-05-14 15:04:13'),
(38, NULL, 3, 651, '2025-05-14 15:05:09'),
(39, NULL, 3, 651, '2025-05-14 15:05:09'),
(40, NULL, 3, 651, '2025-05-14 15:05:24'),
(41, NULL, 3, 651, '2025-05-14 15:05:56'),
(42, NULL, 3, 651, '2025-05-14 15:05:56'),
(43, NULL, 3, 651, '2025-05-14 15:05:57'),
(44, NULL, 3, 651, '2025-05-14 15:05:57'),
(45, NULL, 3, 651, '2025-05-14 15:06:06'),
(46, NULL, 3, 651, '2025-05-14 15:06:06'),
(47, NULL, 3, 651, '2025-05-14 15:06:06'),
(48, NULL, 3, 651, '2025-05-14 15:06:07'),
(49, NULL, 3, 651, '2025-05-14 15:06:17'),
(50, NULL, 3, 651, '2025-05-14 15:06:17'),
(51, NULL, 3, 651, '2025-05-14 15:06:18'),
(52, NULL, 3, 651, '2025-05-14 15:06:18'),
(53, NULL, 3, 651, '2025-05-14 15:06:18'),
(54, NULL, 3, 651, '2025-05-14 15:06:26'),
(55, NULL, 3, 651, '2025-05-14 15:06:27'),
(56, NULL, 3, 651, '2025-05-14 15:06:27'),
(57, NULL, 3, 651, '2025-05-14 15:06:27'),
(58, NULL, 3, 651, '2025-05-14 15:06:27'),
(59, NULL, 3, 651, '2025-05-14 15:06:28'),
(60, NULL, 3, 651, '2025-05-14 15:06:28'),
(61, NULL, 3, 651, '2025-05-14 15:06:28'),
(62, NULL, 3, 651, '2025-05-14 15:06:34'),
(63, NULL, 3, 651, '2025-05-14 15:06:35'),
(64, NULL, 3, 651, '2025-05-14 15:06:35'),
(65, NULL, 3, 651, '2025-05-14 15:06:35'),
(66, NULL, 3, 651, '2025-05-14 15:06:35'),
(67, NULL, 3, 651, '2025-05-14 15:06:46'),
(68, NULL, 3, 651, '2025-05-14 15:06:46'),
(69, NULL, 3, 651, '2025-05-14 15:06:47'),
(70, NULL, 3, 651, '2025-05-14 15:06:47'),
(71, NULL, 3, 651, '2025-05-14 15:06:47'),
(72, NULL, 3, 651, '2025-05-14 15:06:52'),
(73, NULL, 3, 651, '2025-05-14 15:06:52'),
(74, NULL, 3, 651, '2025-05-14 15:06:53'),
(75, NULL, 3, 651, '2025-05-14 15:06:53'),
(76, NULL, 3, 651, '2025-05-14 15:06:53'),
(77, NULL, 3, 651, '2025-05-14 15:06:56'),
(78, NULL, 3, 651, '2025-05-14 15:06:56'),
(79, NULL, 3, 651, '2025-05-14 15:06:56'),
(80, NULL, 3, 651, '2025-05-14 15:06:57'),
(81, NULL, 3, 651, '2025-05-14 15:06:57'),
(82, NULL, 3, 651, '2025-05-14 15:07:04'),
(83, NULL, 3, 651, '2025-05-14 15:07:05'),
(84, NULL, 3, 651, '2025-05-14 15:07:14'),
(85, NULL, 3, 651, '2025-05-14 15:07:15'),
(86, NULL, 3, 651, '2025-05-14 15:07:15'),
(87, NULL, 3, 651, '2025-05-14 15:07:18'),
(88, NULL, 3, 651, '2025-05-14 15:07:19'),
(89, NULL, 3, 651, '2025-05-14 15:07:19'),
(90, NULL, 3, 651, '2025-05-14 15:07:19'),
(91, NULL, 3, 651, '2025-05-14 15:07:19'),
(92, NULL, 3, 651, '2025-05-14 15:07:26'),
(93, NULL, 3, 651, '2025-05-14 15:07:26'),
(94, NULL, 3, 651, '2025-05-14 15:07:27'),
(95, NULL, 3, 651, '2025-05-14 15:07:40'),
(96, NULL, 3, 651, '2025-05-14 15:07:41'),
(97, NULL, 3, 651, '2025-05-14 15:07:41'),
(98, NULL, 3, 651, '2025-05-14 15:07:58'),
(99, NULL, 3, 651, '2025-05-14 15:07:58'),
(100, NULL, 3, 651, '2025-05-14 15:07:58'),
(101, NULL, 3, 651, '2025-05-14 15:07:58'),
(102, NULL, 3, 651, '2025-05-14 15:08:05'),
(103, NULL, 3, 651, '2025-05-14 15:08:05'),
(104, NULL, 3, 651, '2025-05-14 15:08:05'),
(105, NULL, 3, 651, '2025-05-14 15:08:06'),
(106, NULL, 3, 651, '2025-05-14 15:08:06'),
(107, NULL, 3, 651, '2025-05-14 15:08:13'),
(108, NULL, 3, 651, '2025-05-14 15:08:13'),
(109, NULL, 3, 651, '2025-05-14 15:08:13'),
(110, NULL, 3, 651, '2025-05-14 15:08:13'),
(111, NULL, 3, 651, '2025-05-14 15:08:14'),
(112, NULL, 3, 651, '2025-05-14 15:08:14'),
(113, NULL, 3, 651, '2025-05-14 15:08:14'),
(114, NULL, 3, 651, '2025-05-14 15:08:14'),
(115, NULL, 3, 651, '2025-05-14 15:08:26'),
(116, NULL, 3, 651, '2025-05-14 15:08:26'),
(117, NULL, 3, 651, '2025-05-14 15:08:26'),
(118, NULL, 3, 651, '2025-05-14 15:08:26'),
(119, NULL, 3, 651, '2025-05-14 15:08:40'),
(120, NULL, 3, 651, '2025-05-14 15:08:40'),
(121, NULL, 3, 651, '2025-05-14 15:08:41'),
(122, NULL, 3, 651, '2025-05-14 15:08:41'),
(123, NULL, 3, 651, '2025-05-14 15:08:41'),
(124, NULL, 3, 651, '2025-05-14 15:08:45'),
(125, NULL, 3, 651, '2025-05-14 15:08:46'),
(126, NULL, 3, 651, '2025-05-14 15:08:46'),
(127, NULL, 3, 651, '2025-05-14 15:08:46'),
(128, NULL, 3, 651, '2025-05-14 15:08:46'),
(129, NULL, 3, 651, '2025-05-14 15:08:51'),
(130, NULL, 3, 651, '2025-05-14 15:08:51'),
(131, NULL, 3, 651, '2025-05-14 15:08:51'),
(132, NULL, 3, 651, '2025-05-14 15:08:51'),
(133, NULL, 3, 651, '2025-05-14 15:08:51'),
(134, NULL, 3, 651, '2025-05-14 15:08:52'),
(135, NULL, 3, 651, '2025-05-14 15:08:52'),
(136, NULL, 3, 651, '2025-05-14 15:09:01'),
(137, NULL, 3, 651, '2025-05-14 15:09:11'),
(138, NULL, 3, 651, '2025-05-14 15:09:11'),
(139, NULL, 3, 651, '2025-05-14 15:09:13'),
(140, NULL, 3, 651, '2025-05-14 15:09:18'),
(141, NULL, 3, 651, '2025-05-14 15:09:26'),
(142, NULL, 3, 651, '2025-05-14 15:09:26'),
(143, NULL, 3, 651, '2025-05-14 15:09:26'),
(144, NULL, 3, 651, '2025-05-14 15:09:26');

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
(1, 'wordle', 'Wordle es un juego de palabras en el que el estudiante tiene que adivinar una palabra secreta en un número limitado de intentos', 6, '2025-05-15 00:00:00', 'Resources/Imagenes/viajes_del_tiempo.png', 5, 'wordle_intro', 0, 'dash_wordle'),
(2, 'Laboratorio en Peligro', 'Juego de escape room donde los alumnos deben resolver acertijos de matemáticas y experimentos básicos de ciencias para evitar un accidente ficticio en el laboratorio.', 2, '2025-04-12 00:00:00', 'Resources/Imagenes/trivia_ciencia.png', 4, '0', 0, ''),
(3, 'Memory card', 'El estudiante debera encontrar todos los pares de las cartas antes de que se termine el tiempo', 7, '2025-04-12 00:00:00', 'Resources/Imagenes/taller_inventos.png', 4, 'juego_intro', 4, 'dash_memory'),
(4, 'Noticiero Escolar', 'Los estudiantes crean un mini noticiero: redactan noticias, practican la lectura en voz alta y presentan frente a sus compañeros. Se refuerzan habilidades de expresión oral, redacción y escucha.', 1, '2025-04-12 00:00:00', 'Resources/Imagenes/noticiero_escolar.png', 4, '0', 0, ''),
(5, 'Carrera de Reto y Conocimiento', 'Una competencia con estaciones que combinan desafíos físicos y preguntas sobre hábitos saludables o deporte. Gana el equipo con mejor combinación de velocidad y conocimientos.', 5, '2025-04-12 00:00:00', 'Resources/Imagenes/carrera_reto_conocimiento.png', 4, '0', 0, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_memory`
--

CREATE TABLE `niveles_memory` (
  `id_nivel` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_creador_us` int(11) NOT NULL,
  `actividad_juego` text NOT NULL,
  `desc_actividad` text NOT NULL,
  `tiempo_para_resolver` time(4) NOT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles_memory`
--

INSERT INTO `niveles_memory` (`id_nivel`, `id_area`, `id_creador_us`, `actividad_juego`, `desc_actividad`, `tiempo_para_resolver`, `fecha_creacion`) VALUES
(1, 7, 5, 'diferenciar los distintos símbolos esquemáticos', 'En la actividad de hoy, el objetivo será que los estudiantes aprendan a reconocer y diferenciar los distintos símbolos esquemáticos utilizados en los circuitos electrónicos. Se trabajará en la identificación precisa de cada símbolo y su función dentro del circuito.', '00:00:40.0000', '2025-05-13'),
(2, 7, 5, 'diferenciar las distintas herramientas utilizadas para carpintería', 'En la actividad de hoy, el objetivo será que los estudiantes aprendan a reconocer y diferenciar las distintas herramientas utilizadas en carpintería. Se trabajará en la identificación precisa de cada herramienta, su forma y su función específica dentro del taller, comprendiendo su uso correcto y seguro en distintas etapas del trabajo con madera.', '00:00:55.0000', '2025-05-13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_us`
--

CREATE TABLE `niveles_us` (
  `id_nivel_us` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles_us`
--

INSERT INTO `niveles_us` (`id_nivel_us`, `id_nivel`, `id_area`, `id_us`, `fecha`) VALUES
(3, 2, 7, 5, '2025-05-20');

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
(1, 5, 2, 35, '2025-05-15');

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
(1, 1, '1', 'Condensador', 'un condensador es un dispositivo capaz de almacenar energía en forma de campo eléctrico. Está formado por dos armaduras metálicas paralelas'),
(2, 1, '2', 'Electroválvula ', 'Una electroválvula es un dispositivo electromecánico que controla el flujo de fluidos, como líquidos o gases, mediante la aplicación de una corriente eléctrica. Funciona abriendo o cerrando un orificio a través del cual el fluido puede fluir.'),
(3, 1, '3', 'Fuente de tensión', 'Dispositivo que suministra energía eléctrica a un circuito, proporcionando un voltaje constante o variable que permite el funcionamiento de los componentes electrónicos.'),
(4, 1, '4', 'Transistor', 'Componente semiconductor que actúa como interruptor o amplificador, controlando el flujo de corriente eléctrica en circuitos electrónicos.'),
(5, 1, '5', 'Inductor', 'Componente pasivo que almacena energía en un campo magnético cuando circula corriente, utilizado en filtros, transformadores y fuentes de energía.'),
(6, 1, '6', 'Resistencia', 'Dispositivo que limita o regula el flujo de corriente eléctrica en un circuito, protegiendo componentes y ajustando niveles de voltaje.'),
(7, 1, '7', 'Transistor de efecto de campo tipo N de canal de empobrecimiento', 'Semiconductor que controla el flujo de corriente aplicando un voltaje negativo, operando en un estado normalmente conductor que puede bloquearse al modificar el campo eléctrico.'),
(8, 1, '8', 'TRIAC (Interruptor bidireccional controlado por corriente)', 'Dispositivo semiconductor que permite controlar la corriente alterna en ambas direcciones, utilizado en reguladores de potencia, controles de luz y motores.'),
(25, 2, 'bisagra', 'Bisagra de cazoleta', 'También llamada bisagra oculta o europea. Se instala dentro de un agujero circular y permite ajustar puertas de muebles en varias direcciones.'),
(26, 2, 'escuadra', 'Escuadra combinada', 'Herramienta multifunción con regla y cabezal ajustable que permite trazar y verificar ángulos de 90° y 45°, e incluye nivel y punzón.'),
(27, 2, 'formon', 'Formón', 'Cincel de carpintero que se usa para tallar o ajustar ensambles en madera. Funciona con la mano o mazo, y viene en varios anchos.'),
(28, 2, 'gubias', 'Gubias de tallado', 'Herramientas similares a los formones pero con hoja curva o en “U” o “V”, ideales para tallar y esculpir madera de forma decorativa.'),
(29, 2, 'ingletadora', 'Ingletadora', 'Sierra especial para cortar madera en ángulos precisos como 45° o 90°, usada comúnmente en molduras y marcos. Puede ser manual o eléctrica.'),
(30, 2, 'sargentopng', 'Sargento de prensa', 'Herramienta de sujeción que mantiene firmemente dos piezas unidas durante el pegado, taladrado o ensamblado.'),
(31, 2, 'sierra_banco', 'Sierra de banco', 'Herramienta estacionaria con hoja circular que permite cortes rectos y precisos. Se usa para cortes longitudinales o transversales en madera.'),
(32, 2, 'tarugo', 'Tarugo de madera', 'Cilindro de madera dura que se usa para unir piezas mediante orificios alineados y encolado. Da uniones firmes sin tornillos visibles.');

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
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('alumno','root','profesor','directivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombre`, `apellido`, `nombre_usuario`, `email`, `contraseña`, `rol`) VALUES
(5, 'Francisco', 'Suchomela', 'fransucho', 'franciscosuchomela@gmail.com', '$2b$10$VmZdIK9tS4Zk0OZhHFKP0e37AtZw7uMDlHPoWR6DAZoT8RraF.Q.6', 'alumno'),
(9, 'jorge', 'almiron', 'jorgealmiron', 'jorgealmiron@gmail.com', '$2b$10$CLLeEJ3GNyLCVfHYC.iySOqTiqd/tC80aCD8Yt3SnsnTQpmJ9rC5G', 'directivo'),
(12, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelass@gmail.com', '$2b$10$GURk.7Xwfu6Q936IiqGnnu.zdh8DK8z4fnMXWjS13uiiEMGYoz39.', 'alumno'),
(13, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelasss@gmail.com', '$2b$10$NqcXencqzseAIyPlvgdhFOiYu9pSbeFhrfKidDUVxmMYPZUTUnIDO', 'alumno'),
(15, 'Francisco', 'Suchomela', 'root', 'root@gmail.com', '$2b$10$uxAMYrN7wnfcmVGTOnH3YOi.x2CW/GCtiteQM7cBiAy.IkON/FdPW', 'root');

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
(210, 5, 'resistencia aeróbica', 'Capacidad para mantener esfuerzo con oxígeno.'),
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
(235, 7, 'llave inglesa', 'Herramienta ajustable para sujetar tuercas.'),
(236, 7, 'destornillador', 'Herramienta para atornillar o desatornillar.'),
(237, 7, 'alicate', 'Herramienta para sujetar o cortar.'),
(238, 7, 'soldadura', 'Unión de materiales por fusión.'),
(239, 7, 'taladro', 'Herramienta para perforar.'),
(240, 7, 'esmeril', 'Herramienta para afilar o desbastar.'),
(241, 7, 'limadora', 'Máquina para dar forma con precisión.'),
(242, 7, 'torno', 'Máquina para mecanizar piezas cilíndricas.'),
(243, 7, 'cinta métrica', 'Instrumento para medir longitudes.'),
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
(258, 7, 'cinta métrica', 'Instrumento para medir longitudes.'),
(259, 7, 'torno', 'Máquina para mecanizar piezas cilíndricas.'),
(260, 7, 'limadora', 'Máquina para dar forma con precisión.'),
(261, 7, 'esmeril', 'Herramienta para afilar o desbastar.'),
(262, 7, 'taladro', 'Herramienta para perforar.'),
(263, 7, 'soldadura', 'Unión de materiales por fusión.'),
(264, 7, 'alicate', 'Herramienta para sujetar o cortar.'),
(265, 7, 'destornillador', 'Herramienta para atornillar o desatornillar.'),
(266, 7, 'llave inglesa', 'Herramienta ajustable para sujetar tuercas.'),
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
(278, 7, 'cinta métrica', 'Instrumento para medir longitudes.'),
(279, 7, 'torno', 'Máquina para mecanizar piezas cilíndricas.'),
(280, 7, 'limadora', 'Máquina para dar forma con precisión.'),
(281, 7, 'esmeril', 'Herramienta para afilar o desbastar.'),
(282, 7, 'taladro', 'Herramienta para perforar.'),
(283, 7, 'soldadura', 'Unión de materiales por fusión.'),
(284, 7, 'alicate', 'Herramienta para sujetar o cortar.'),
(285, 7, 'destornillador', 'Herramienta para atornillar o desatornillar.'),
(286, 7, 'llave inglesa', 'Herramienta ajustable para sujetar tuercas.'),
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
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`calificacion_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `juego_id` (`juego_id`);

--
-- Indices de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD PRIMARY KEY (`estadistica_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `juego_jugado` (`juego_jugado`);

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
  ADD KEY `id_area` (`id_area`,`id_creador_us`),
  ADD KEY `id_creador_us` (`id_creador_us`);

--
-- Indices de la tabla `niveles_us`
--
ALTER TABLE `niveles_us`
  ADD PRIMARY KEY (`id_nivel_us`),
  ADD KEY `id_nivel` (`id_nivel`,`id_area`,`id_us`,`fecha`),
  ADD KEY `fecha` (`fecha`),
  ADD KEY `id_area` (`id_area`),
  ADD KEY `id_us` (`id_us`);

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
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `calificacion_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  MODIFY `estadistica_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

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
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `niveles_us`
--
ALTER TABLE `niveles_us`
  MODIFY `id_nivel_us` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id_novedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- AUTO_INCREMENT de la tabla `rankin_wordle`
--
ALTER TABLE `rankin_wordle`
  MODIFY `id_ranking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `resources_juego`
--
ALTER TABLE `resources_juego`
  MODIFY `id_rources` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `respuesta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `wordle`
--
ALTER TABLE `wordle`
  MODIFY `id_palabra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=291;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`juego_id`);

--
-- Filtros para la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD CONSTRAINT `estadisticas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `estadisticas_ibfk_2` FOREIGN KEY (`juego_jugado`) REFERENCES `juegos` (`juego_id`);

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
  ADD CONSTRAINT `niveles_memory_ibfk_2` FOREIGN KEY (`id_creador_us`) REFERENCES `usuarios` (`usuario_id`);

--
-- Filtros para la tabla `niveles_us`
--
ALTER TABLE `niveles_us`
  ADD CONSTRAINT `niveles_us_ibfk_1` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_memory` (`id_nivel`),
  ADD CONSTRAINT `niveles_us_ibfk_2` FOREIGN KEY (`id_area`) REFERENCES `areas` (`materia_id`),
  ADD CONSTRAINT `niveles_us_ibfk_3` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`);

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
-- Filtros para la tabla `rankin_wordle`
--
ALTER TABLE `rankin_wordle`
  ADD CONSTRAINT `rankin_wordle_ibfk_1` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resources_juego`
--
ALTER TABLE `resources_juego`
  ADD CONSTRAINT `resources_juego_ibfk_1` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_memory` (`id_nivel`);

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`pregunta_id`);
COMMIT;
