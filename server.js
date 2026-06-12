const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const SHEET_ID = '1F0s1yeToNckVqeu1mh3uNNh42u1zvg5SMEHLo4l22FU';
const SHEET_NAME = 'prueba';

const auth = new google.auth.JWT(
  'keys-system@clever-environs-478712-g2.iam.gserviceaccount.com',
  null,
  '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwlstfwdj2S0qh\n23f59zOeN4SwgIccql6oS7oyDlr+lLGxR9h0Kak0VtxNagPx4wevkbyd12wqujr3\n993w2kQ0Wx5kIcrug0JvdG5qhJ2YLaGW7sV1NGx39EQz5SVr9klfGZCO17UfntgP\n1OPfSrdZERPsjipdnTMHaXpSqZrg95BXerVFeczuFLuehinsgo8k4hHQKZbeg57k\ngWuBK3YuSVqlGxFsCRtrB/zPDxLyKDFyu8oZ1Y1OyGRIlZoV8vvKPapxp6rDbE47\ngICIaMNGF9sasxC+9+QbL+w+RvFTrRGOPfsjWLxGRNzbXl4CGvXKCCf+6gGtKF+r\nX0+qjPP9AgMBAAECggEAN7XDAHkz3PPA3lJSRepefv4t3s8VkQ4QodCOM8eCnolD\ni9XKLE+OYYQ7qTKWfwOsQ4/bLQKuzcYF33/zpU3+sXPDoTxl/JwtY+McCH/BBibz\nMR4v7jt1Mty9fY+/oBFJcXaru9zCd/DRYiE8KJA2SqOQIRNyuyjiVebJX/XA9lKt\nY6vOhBFfltQI2JeKgkmbV6DsAIcM/sjJpLGGt0TVHtjeIG2FJ/yRLRWvff4L7Yvg\n3T0qsTal+zAUSPd6CGFhL8K9TL6mlCFj1w5Aj6667UHv5U9GvBIFeetOMIMtFHYI\nubS92PH0YcsVcTGaYgtB6bDXgRAnsDQbh0okIj6EIwKBgQDjPMshShpPMxaWQ2yr\nvg7Dw8SW39mAvRa7vQK4Ncjo2f3jhAzmoP2dHgltEy8WWjJuJbcvC++LFdHNi46h\nHn4pm9GL4gdLIj7XKfayRa68XNK7DMXNpuR7tp+ghKXKXMh/tQFQFzzxmhNJIxoE\n1H3xYX892TIJWFit2bnPcpuNOwKBgQDG8NU6kxBZ06/N2IwXaI1xFpxOMQaTTN6d\ndql+NcQHeTrX1WNonYuRmI5ZtCRcKVGQDRWLer4hc5Je7trE/VUkLy21SPIO+iwV\nvF5xdCH1YPRIUrr5C+t+lO3//OUzktcbv3of5F8h3LsS9T2ZbPA3oFYiaumRhU6i\n3OyZHqhQJwKBgFJYZG/iz5fltoirVEUEMYuFdMcLxWDepM9Rlhu0+eJPpK5+2sH0\nkxMNoHLTYdviwaWiqzg0RhELziSDLyN5zlQ7r/rV5Li4ZzdHcKt3jvOZW5AG9+Mn\nWGLwcfYUO5QSfWGx8RDZ6u7OW7DENJiNfDotj5OVEonKZxBQ9wGS0YWjAoGAeQVw\n8Z0dSUfZnuOo9WSJBs62b2qrkVgl5KyXF0wl4FYDUeFiA/YzPXMMxc0sgVQxZexP\nuvYES90+obm0JDnoXYbFy46AklPmFaLt4R7AucEtWgHZ9D8oF20KC7wQwnsFmL+2\nz0fiB3t74mCGBJuc1noXbACV7gymdbTnyY443ekCgYBcsUjZ6xkvL9npMey/Plg7\nKxzS+HTfxipKLcrO49rNLt4f8XVFVeDTndqT+OUwyM+zqzTfOC/Te8ELVcpccWfF\nsAr+nnpS/oXakMeeKA5g09fQ+fGPjhAp0K3DTl+dfJa31F6bU6AbD3pqc0pOpAw/\nCWN1TOUA/y3opEkqWuqjWA==\n-----END PRIVATE KEY-----\n',
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

function getDate() {
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

async function findKeyRow(code) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_NAME + '!E:E'
  });
  const rows = res.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim().toUpperCase() === code.toUpperCase()) return i + 1;
  }
  return null;
}

async function findPropertyRow(property) {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "'Keys Information'!E:E"
  });
  const rows = result.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim() === property) return i + 1;
  }
  return null;
}

const DEPT_COLUMNS = { 'Sales Home':'A', 'Customer Service':'B', 'Maintenance':'C', 'HK':'D', 'Property Management':'E', 'Landlord':'F' };

app.post('/add-employee', async (req, res) => {
  try {
    const { name, email, dept } = req.body;
    if (!name || !email || !dept) return res.status(400).json({ error: 'Faltan campos' });

    // 1. Añadir a la lista Person/E-Mail (columnas H/I) empezando en fila 2
    const hiResult = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "'Departments'!H2:I"
    });
    const hiRows = hiResult.data.values || [];
    const exists = hiRows.some(r => r[1] && r[1].toString().trim().toLowerCase() === email.toLowerCase());
    if (!exists) {
      const nextRow = 2 + hiRows.length;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: "'Departments'!H" + nextRow + ':I' + nextRow,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[name, email]] }
      });
    }

    // 2. Añadir el nombre al final de la columna del departamento (empezando en fila 4)
    const col = DEPT_COLUMNS[dept];
    if (col) {
      const colResult = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "'Departments'!" + col + '4:' + col
      });
      const colRows = colResult.data.values || [];
      const existsInDept = colRows.some(r => r[0] && r[0].toString().trim().toLowerCase() === name.toLowerCase());
      if (!existsInDept) {
        const nextDeptRow = 4 + colRows.length;
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: "'Departments'!" + col + nextDeptRow,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[name]] }
        });
      }
    }

    console.log('EMPLOYEE OK: ' + name + ' | ' + email + ' | ' + dept);
    res.json({ ok: true });
  } catch (err) {
    console.error('Employee Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/key-info/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const rowNum = await findKeyRow(code);
    if (!rowNum) return res.status(404).json({ error: 'No encontrada' });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_NAME + '!H' + rowNum + ':O' + rowNum
    });
    const row = result.data.values?.[0] || [];
    res.json({
      status: row[0] || '', name: row[1] || '', dept: row[2] || '',
      dateTaken: row[3] || '', dateReturned: row[4] || '',
      lastPerson: row[5] || '', reminder: row[6] || '', comment: row[7] || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/update-key', async (req, res) => {
  try {
    const { code, status, name, dept, comment, property, eircode, email, action } = req.body;
    if (!code || !status) return res.status(400).json({ error: 'Faltan campos' });
    const rowNum = await findKeyRow(code);
    if (!rowNum) return res.status(404).json({ error: 'Llave no encontrada: ' + code });
    const now = getDate();
    let values;
    if (status === 'In use') {
      values = [['In use', name||'', dept||'', now, '', '', '', comment||'']];
    } else {
      let realStatus = 'Available';
      if (comment && comment.startsWith('Missing key')) realStatus = 'Missing Key';
      else if (comment && comment.startsWith('Key not working')) realStatus = 'Key not working';
      else if (comment === 'No key') realStatus = 'No key';
      values = [[realStatus, '', '', '', now, name||'', '', comment||'']];
    }
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: SHEET_NAME + '!H' + rowNum + ':O' + rowNum,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
    console.log('OK: ' + code + ' -> ' + status + ' | ' + name + ' | fila ' + rowNum);

    // Registrar movimiento en LogsNew
    if (action === 'Take' || action === 'Return') {
      try {
        const timestamp = new Date().toISOString().slice(0,19).replace('T',' ');
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: "'LogsNew'!A:I",
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[timestamp, action, code, property||'', eircode||'', dept||'', name||'', email||'', comment||'']] }
        });
        console.log('LOG OK: ' + action + ' ' + code);
      } catch (logErr) {
        console.error('Log Error:', logErr.message);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Lookup de Keys Information para prellenar el modal al devolver una llave
app.get('/keyinfo-lookup', async (req, res) => {
  try {
    const property = req.query.property;
    if (!property) return res.status(400).json({ error: 'Falta propiedad' });
    const rowNum = await findPropertyRow(property);
    if (!rowNum) return res.status(404).json({ error: 'Propiedad no encontrada: ' + property });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "'Keys Information'!F" + rowNum + ':O' + rowNum
    });
    const row = result.data.values?.[0] || [];
    res.json({
      eircode: row[0] || '',
      type: row[1] || '',
      aptKeys: row[2] || '',
      buildingDoor: row[3] || '',
      codedKey: row[4] || '',
      codedKey2: row[5] || '',
      fob: row[6] || '',
      codedFob: row[7] || '',
      codeAccess: row[8] || '',
      extraInfo: row[9] || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/update-keyinfo', async (req, res) => {
  try {
    const { property, type, aptKeys, buildingDoor, codedKey, codedKey2, fob, codedFob, codeAccess, extraInfo } = req.body;
    if (!property) return res.status(400).json({ error: 'Falta propiedad' });
    const rowNum = await findPropertyRow(property);
    if (!rowNum) return res.status(404).json({ error: 'Propiedad no encontrada: ' + property });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: "'Keys Information'!G" + rowNum + ':O' + rowNum,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[type||'', aptKeys||'', buildingDoor||'', codedKey||'', codedKey2||'', fob||'', codedFob||'', codeAccess||'', extraInfo||'']] }
    });
    console.log('KI OK: ' + property + ' | fila ' + rowNum);
    res.json({ ok: true });
  } catch (err) {
    console.error('KI Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

async function checkReminders() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_NAME + '!E:N'
    });
    const rows = res.data.values || [];
    const now = new Date();
    for (let i = 1; i < rows.length; i++) {
      const status = rows[i][3];
      const dateTaken = rows[i][6];
      const reminded = rows[i][9];
      if (status === 'In use' && dateTaken && dateTaken.trim() !== '' && reminded !== 'Sí') {
        const parts = dateTaken.split(/[/,\s:]+/);
        if (parts.length >= 3) {
          const taken = new Date(parts[2], parts[1]-1, parts[0]);
          if (!isNaN(taken.getTime())) {
            const diffDays = (now - taken) / (1000 * 60 * 60 * 24);
            if (diffDays >= 2) {
              await sheets.spreadsheets.values.update({
                spreadsheetId: SHEET_ID,
                range: SHEET_NAME + '!N' + (i + 1),
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [['Sí']] }
              });
              console.log('Recordatorio marcado: fila ' + (i + 1));
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error en recordatorios:', err.message);
  }
}

setInterval(checkReminders, 60 * 60 * 1000);
checkReminders();

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'leevin_keys_control.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
