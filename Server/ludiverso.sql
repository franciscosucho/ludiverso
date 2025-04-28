-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-04-2025 a las 21:34:26
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
  `juegos_jugados` int(11) DEFAULT 0,
  `puntaje_total` int(11) DEFAULT 0,
  `ultima_actividad` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `niveles` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juegos`
--

INSERT INTO `juegos` (`juego_id`, `titulo`, `descripcion`, `materia_id`, `fecha_creacion`, `url_img`, `valoracion`, `url_juego`, `niveles`) VALUES
(1, 'Viajeros del Tiempo', 'Los estudiantes forman equipos y viajan simbólicamente a diferentes épocas históricas. Deben resolver desafíos o acertijos relacionados con la cultura, geografía y personajes de esa época para avanzar en el \"tiempo\".', 6, '2025-04-12 00:00:00', 'Resources/Imagenes/viajes_del_tiempo.png', 5, '0', 0),
(2, 'Laboratorio en Peligro', 'Juego de escape room donde los alumnos deben resolver acertijos de matemáticas y experimentos básicos de ciencias para evitar un accidente ficticio en el laboratorio.', 2, '2025-04-12 00:00:00', 'Resources/Imagenes/trivia_ciencia.png', 4, '0', 0),
(3, 'Memory card', 'El estudiante debera encontrar todos los pares de las cartas antes de que se termine el tiempo', 7, '2025-04-12 00:00:00', 'Resources/Imagenes/taller_inventos.png', 4, 'juego_memoria', 4),
(4, 'Noticiero Escolar', 'Los estudiantes crean un mini noticiero: redactan noticias, practican la lectura en voz alta y presentan frente a sus compañeros. Se refuerzan habilidades de expresión oral, redacción y escucha.', 1, '2025-04-12 00:00:00', 'Resources/Imagenes/noticiero_escolar.png', 4, '0', 0),
(5, 'Carrera de Reto y Conocimiento', 'Una competencia con estaciones que combinan desafíos físicos y preguntas sobre hábitos saludables o deporte. Gana el equipo con mejor combinación de velocidad y conocimientos.', 5, '2025-04-12 00:00:00', 'Resources/Imagenes/carrera_reto_conocimiento.png', 4, '0', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `memory_car`
--

CREATE TABLE `memory_car` (
  `id_juego` int(11) NOT NULL,
  `id_area` int(11) NOT NULL,
  `id_us` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `memory_car`
--

INSERT INTO `memory_car` (`id_juego`, `id_area`, `id_us`, `fecha_creacion`) VALUES
(1, 7, 5, '2025-04-28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_memory`
--

CREATE TABLE `niveles_memory` (
  `id_nivel` int(11) NOT NULL,
  `id_juego` int(11) NOT NULL,
  `actividad_juego` text NOT NULL,
  `desc_actividad` text NOT NULL,
  `tiempo_para_resolver` time(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles_memory`
--

INSERT INTO `niveles_memory` (`id_nivel`, `id_juego`, `actividad_juego`, `desc_actividad`, `tiempo_para_resolver`) VALUES
(1, 1, 'diferenciar los distintos símbolos esquemáticos', 'En la actividad de hoy, el objetivo será que los estudiantes aprendan a reconocer y diferenciar los distintos símbolos esquemáticos utilizados en los circuitos electrónicos. Se trabajará en la identificación precisa de cada símbolo y su función dentro del circuito.', '00:00:40.0000');

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
(2, 'Nuevos juegos en Ludiverso', 'Con el equipo de ludivero desarrollamos nuevos juegos para ustedes. Dentro de poco estaran disponibles', 'Nos complace anunciar que con el equipo de Ludivero hemos estado trabajando arduamente para ofrecerles una emocionante selección de nuevos juegos. Nuestro objetivo es brindarles experiencias aún más entretenidas y divertidas que disfrutarán en sus momentos libres.\r\nEstos nuevos juegos están diseñados pensando en ustedes, con características innovadoras y dinámicas que prometen captar su atención y mantenerlos enganchados. Dentro de poco, estarán disponibles para que todos puedan disfrutarlos. Estamos seguros de que les encantarán tanto como a nosotros.\r\n¡Manténganse atentos para más detalles sobre el lanzamiento! ¡No querrán perdérselos!', 'Resources/Imagenes/Novedades/torneo.png', '2025-04-12');

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
(8, 1, '8', 'TRIAC (Interruptor bidireccional controlado por corriente)', 'Dispositivo semiconductor que permite controlar la corriente alterna en ambas direcciones, utilizado en reguladores de potencia, controles de luz y motores.');

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
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `nombre`) VALUES
(1, 'Root'),
(2, 'Alumno'),
(5, 'Profesor');

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
  `rol_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombre`, `apellido`, `nombre_usuario`, `email`, `contraseña`, `rol_id`) VALUES
(5, 'Francisco', 'Suchomela', 'fransucho', 'franciscosuchomela@gmail.com', '$2b$10$VmZdIK9tS4Zk0OZhHFKP0e37AtZw7uMDlHPoWR6DAZoT8RraF.Q.6', 2),
(6, 'david', 'mingueza', 'davidmingueza', 'davidmingueza@gmail.com', '$2b$10$0EvUQrkWB43ZavtXyX85fe8y/Rzy7DGuqoVatH0lcvQ3hoAhSJUdO', 2),
(8, 'jorge', 'mingueza', 'jorgemingueza', 'jorgemingueza@gmail.com', '$2b$10$ZB5qktwKxh3MgDCD425YMej0wZj8/zR7GAR9O.mnSDxb10c4Njcfe', 2),
(9, 'jorge', 'almiron', 'jorgealmiron', 'jorgealmiron@gmail.com', '$2b$10$CLLeEJ3GNyLCVfHYC.iySOqTiqd/tC80aCD8Yt3SnsnTQpmJ9rC5G', 2),
(10, 'jorge', 'almiron', 'jorgealmiron', 'jorgealmissron@gmail.com', '$2b$10$0bVwWy.35qE7HmXhmu.7JeLaYt./MDv0Crcdi4x1aYyH8XXlSSPcO', 2),
(11, 'jorge', 'almiron', 'jorgealmiron', 'jorgealmsissron@gmail.com', '$2b$10$mROJ/C6X7baUf.S4km.fE.rQ2Ra2/xfLyDQzHgOjRQj2Vxk77HpoC', 2),
(12, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelass@gmail.com', '$2b$10$GURk.7Xwfu6Q936IiqGnnu.zdh8DK8z4fnMXWjS13uiiEMGYoz39.', 2),
(13, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelasss@gmail.com', '$2b$10$NqcXencqzseAIyPlvgdhFOiYu9pSbeFhrfKidDUVxmMYPZUTUnIDO', 2),
(14, 'Francisco', 'Suchomela', 'davidmingueza', 'franciscosuchomelassss@gmail.com', '$2b$10$DxW.Lvdl.At7WPz00C3qbOfBRAbtyV5AyXUbvBOAm5MR8f8y4sw2q', 2);

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
  ADD KEY `usuario_id` (`usuario_id`);

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
-- Indices de la tabla `memory_car`
--
ALTER TABLE `memory_car`
  ADD PRIMARY KEY (`id_juego`),
  ADD KEY `id_area` (`id_area`,`id_us`),
  ADD KEY `id_us` (`id_us`);

--
-- Indices de la tabla `niveles_memory`
--
ALTER TABLE `niveles_memory`
  ADD PRIMARY KEY (`id_nivel`),
  ADD KEY `id_juego` (`id_juego`);

--
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD PRIMARY KEY (`id_novedad`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`pregunta_id`),
  ADD KEY `juego_id` (`juego_id`);

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
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `rol_id` (`rol_id`);

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
  MODIFY `estadistica_id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT de la tabla `memory_car`
--
ALTER TABLE `memory_car`
  MODIFY `id_juego` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `niveles_memory`
--
ALTER TABLE `niveles_memory`
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id_novedad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `pregunta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resources_juego`
--
ALTER TABLE `resources_juego`
  MODIFY `id_rources` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `respuesta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `rol_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  ADD CONSTRAINT `estadisticas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`);

--
-- Filtros para la tabla `intentos`
--
ALTER TABLE `intentos`
  ADD CONSTRAINT `intentos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `intentos_ibfk_2` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`juego_id`);

--
-- Filtros para la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD CONSTRAINT `juegos_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `areas` (`materia_id`);

--
-- Filtros para la tabla `memory_car`
--
ALTER TABLE `memory_car`
  ADD CONSTRAINT `memory_car_ibfk_1` FOREIGN KEY (`id_area`) REFERENCES `areas` (`materia_id`),
  ADD CONSTRAINT `memory_car_ibfk_2` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`usuario_id`);

--
-- Filtros para la tabla `niveles_memory`
--
ALTER TABLE `niveles_memory`
  ADD CONSTRAINT `niveles_memory_ibfk_1` FOREIGN KEY (`id_juego`) REFERENCES `memory_car` (`id_juego`);

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`juego_id`);

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

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`);
COMMIT;
