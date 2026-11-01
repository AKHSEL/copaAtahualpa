# Copa Atahualpa

## Desarrollo

1. Instala dependencias con `npm install`.
2. Configura `DATABASE_URL` y `DIRECT_URL` en `.env.local`.
3. Ejecuta `npm run dev` y abre `http://localhost:3000`.

## Administración

El panel está en `http://localhost:3000/admin`. Usa el usuario `admin` y la contraseña definida por `ADMIN_PASSWORD` en `.env.local`. El mismo valor debe configurarse como variable de entorno en el servidor de producción. Si falta, el panel y las operaciones de escritura responden con 503.

El panel permite crear, editar y eliminar equipos, jornadas y partidos. Un equipo o jornada con partidos asociados no puede eliminarse hasta retirar esos partidos. Los partidos simulados que completan las tablas de posiciones se calculan para la vista pública y no están guardados en la base de datos ni se editan desde el panel.

Todos los partidos se juegan en la misma sede. El campo histórico `venue` conserva los valores anteriores en la base de datos y usa la sede común por defecto para los partidos nuevos; no se pide ni se muestra por partido.

## Temporadas y eliminatorias

La temporada activa aparece en las páginas públicas y en el panel. El admin puede generar cuartos de final para los ocho primeros de cada categoría según **partidos reales** (1.º–8.º, 2.º–7.º, 3.º–6.º y 4.º–5.º). La fase regular debe estar terminada y cada clasificado debe haber jugado al menos un partido. Al completar los cuatro cruces se generan semifinales; luego, la final. Cada cruce es a partido único. Si termina empatado, el admin registra penales para definir al ganador. Los resultados eliminatorios no alteran la tabla de la fase regular.

Al finalizar ambas finales, el botón **Cerrar e iniciar nueva temporada** guarda una copia de la tabla oficial, los partidos eliminatorios y los campeones de Master y Libre. La nueva temporada comienza sin equipos, jornadas ni partidos. El histórico se consulta en `/history`. Los resultados simulados siguen sirviendo como vista provisional de la tabla pública antes de las eliminatorias, pero nunca determinan clasificados ni se archivan.
