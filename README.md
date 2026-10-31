Valorant Broadcast Overlay

Sistema de broadcast gratuito y sin dependencias para retransmitir partidas de Valorant con OBS. Incluye una escena de selección de agentes y una escena en partida con vida, escudo y arma de cada jugador, con una estética oscura inspirada en la VCT EMEA.

Proyecto no oficial. No está avalado ni patrocinado por Riot Games. VALORANT y Riot Games son marcas registradas de Riot Games, Inc.

Características
Escena de selección de agentes: 5 cartas por equipo con retrato del agente y nombre del jugador.
Escena en partida: marcador, mapa y columnas de jugadores con vida, escudo (0/25/50) y arma.
Panel de control web para manejar todo en tiempo real.
Una sola Browser Source en OBS: el overlay cambia de escena desde el panel.
Servidor en Node.js puro, sin npm install.
Iconos de agentes y armas cargados desde valorant-api.com.
Limitaciones de los datos

Riot no ofrece una API pública con datos en vivo de Valorant (vida, escudo, armas, selección de agentes):

Las claves personales y de desarrollo no tienen acceso a las APIs de Valorant.
VAL-MATCH-V1 requiere una production key aprobada por Riot y solo devuelve partidas ya finalizadas.
Los datos en vivo de los 10 jugadores solo están disponibles mediante el feed oficial para organizadores de torneos aprobados.

Por eso este proyecto funciona con un operador manual que rellena el panel mientras ve la partida en modo observador. No usa endpoints no oficiales del cliente de Riot.

Requisitos
Node.js 18 o superior
OBS Studio
Conexión a internet (para los iconos de agentes y armas)

Instalación y uso

git clone https://github.com/<tu-usuario>/valorant-broadcast.git
cd valorant-broadcast
node server.js

  1. Abre el panel de control: http://localhost:3000
  2. En OBS, añade una Browser Source de 1920×1080 con la URL http://localhost:3000/overlay.html
  3. Cambia de escena (selección de agentes, en partida, ocultar) desde el panel.

Para usar otro puerto: PORT=4000 node server.js

Estructura

valorant-broadcast/
├── server.js            # Servidor HTTP + API + eventos en tiempo real (SSE)
└── public/
    ├── control.html     # Panel de control del operador
    └── overlay.html     # Overlay para OBS (ambas escenas)****

API

Método	Ruta	Descripción

GET	/api/state	Devuelve el estado actual
POST	/api/state	Actualiza el estado y lo envía a los overlays
GET	/events	Stream SSE con el estado en tiempo real
GET	/api/riot/match/:id	Proxy a Riot VAL-MATCH-V1 (solo partidas finalizadas)
Integración con la API de Riot (opcional)

Si Riot te aprueba una production key, puedes consultar partidas terminadas:

bash
RIOT_API_KEY=tu_clave RIOT_REGION=eu node server.js

Nunca subas tu clave al repositorio.

Personalización

Los colores y posiciones están en el bloque <style> de public/overlay.html (variables --l y --r para los equipos).

Ideas pendientes
Logos de equipos
Fase de bans y pausa técnica
Animaciones de entrada y salida
Importar resultados finales desde VAL-MATCH-V1

Créditos
Iconos y datos de agentes y armas: valorant-api.com
