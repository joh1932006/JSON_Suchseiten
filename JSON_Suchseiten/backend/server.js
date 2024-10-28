const express = require('express');
const axios = require('axios'); // Für den HTTP-Request zur API
const sql = require('mssql');
const app = express();
const port = 3000;

// SQL Server Konfiguration
const dbConfig = {
    user: 'f4mbsappl',
    password: 'bTemrHU6Tn3pnkPRBuKc', // Ersetze mit dem tatsächlichen Passwort
    server: '192.168.44.20',
    database: 'dein_datenbankname', // Ersetze mit dem Datenbanknamen
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

// Endpoint, um das SQL-Statement zu generieren und auszuführen
app.get('/api/daten', async (req, res) => {
    try {
        // JSON-Objekt, das an die API gesendet werden soll
        const jsonString = {
            // Beispiel-Daten, die für die Abfrage benötigt werden
            "key1": "value1",
            "key2": "value2"
        };

        // Sende den JSON-Request an die externe API
        const apiResponse = await axios.post(
            'https://servicefabby.fab4minds.com/ACM/api/search/getsqlstatementforjsonobject',
            jsonString,
            { headers: { 'Content-Type': 'application/json' } }
        );

        // SQL-Statement aus der API-Antwort
        const sqlStatement = apiResponse.data;

        // Verbindung zum SQL Server herstellen und das SQL-Statement ausführen
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query(sqlStatement);

        // Ergebnisse an den Client senden
        res.json(result.recordset);
    } catch (err) {
        console.error('Fehler:', err);
        res.status(500).send('Fehler beim Abrufen der Daten');
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
