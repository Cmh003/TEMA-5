import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

const STRAVA_CLIENT_ID     = '223084';
const STRAVA_CLIENT_SECRET = '1fb23c1a4887157c500cdbad0ce3fd5e8dd27112'; // ⚠️ Rellena esto

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/ping', (req, res) => {
    res.json({ ok: true, mensaje: 'Servidor Yoopo online ✅' });
});

app.post('/api/strava/exchange', async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Código no recibido.' });

    try {
        // PASO 1: Código → Token de acceso
        const tokenRes = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id:     STRAVA_CLIENT_ID,
                client_secret: STRAVA_CLIENT_SECRET,
                code:          code,
                grant_type:    'authorization_code'
            })
        });

        const tokenData = await tokenRes.json();
        console.log('📦 Respuesta Strava token:', tokenData);

        if (!tokenData.access_token) {
            return res.status(401).json({ 
                error: 'Strava rechazó el código.', 
                detalle: tokenData 
            });
        }

        // PASO 2: Token → Actividades del atleta
        const actRes = await fetch(
            'https://www.strava.com/api/v3/athlete/activities?per_page=30',
            { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
        );
        const actividades = await actRes.json();

        res.json({ 
            access_token: tokenData.access_token, 
            athlete:      tokenData.athlete, 
            actividades 
        });

    } catch (err) {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: 'Error interno.', detalle: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor Yoopo corriendo en http://localhost:${PORT}`);
    console.log(`🔍 Prueba aquí: http://localhost:${PORT}/ping`);
});