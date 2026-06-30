import { getAccessToken, googleSignIn } from './googleAuth';

export const exportToGoogleSheets = async (patients: any[], telemetryLogs: any[], centers: any[], announcements: any[]) => {
  let accessToken = await getAccessToken();
  if (!accessToken) {
    const result = await googleSignIn();
    if (result) {
      accessToken = result.accessToken;
    } else {
      throw new Error("Could not authenticate with Google");
    }
  }

  // 1. Create a new Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: `WarriorLive Export - ${new Date().toLocaleDateString()}`
      },
      sheets: [
        { properties: { title: 'Patients' } },
        { properties: { title: 'Telemetry Logs' } },
        { properties: { title: 'Centers' } },
        { properties: { title: 'Announcements' } }
      ]
    })
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error("Create spreadsheet error", err);
    throw new Error('Failed to create spreadsheet');
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = spreadsheet.spreadsheetUrl;

  // 2. Prepare Data arrays
  const patientData = [
    ['ID', 'Name', 'Email', 'Genotype', 'Baseline Hb', 'Baseline Reticulocytes', 'Gender', 'Splenomegaly Risk', 'Created At'],
    ...patients.map(p => [p.id, p.name, p.email, p.hemoglobinType, p.baselineHb, p.baselineRetics, p.gender, p.hasSplenomegaly ? 'Yes' : 'No', p.createdAt])
  ];

  const telemetryData = [
    ['ID', 'User Name', 'Email', 'Pain Level', 'Temp (°C)', 'Blood Pressure', 'Heart Rate', 'O2 Saturation', 'Emergency Event', 'Timestamp'],
    ...telemetryLogs.map(l => [l.id, l.userName, l.email, l.painLevel, l.temperatureCelsius, l.bloodPressure, l.heartRate, l.oxygenSaturation, l.emergencyButtonPressed ? 'Yes' : 'No', l.timestamp])
  ];

  const centersData = [
    ['ID', 'Name', 'Type', 'Address', 'Distance', 'Phone', 'Triage Goal', 'Specialty'],
    ...centers.map(c => [c.id, c.name, c.type, c.address, c.distance, c.phone, c.triageGoal, c.specialty])
  ];

  const announcementsData = [
    ['ID', 'Title', 'Type', 'Content', 'Active', 'Created At'],
    ...announcements.map(a => [a.id, a.title, a.type, a.content, a.active ? 'Yes' : 'No', a.createdAt])
  ];

  // 3. Batch Update values
  const data = [
    {
      range: 'Patients!A1',
      values: patientData
    },
    {
      range: 'Telemetry Logs!A1',
      values: telemetryData
    },
    {
      range: 'Centers!A1',
      values: centersData
    },
    {
      range: 'Announcements!A1',
      values: announcementsData
    }
  ];

  const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: data
    })
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error("Batch update error", err);
    throw new Error('Failed to update spreadsheet data');
  }

  return spreadsheetUrl;
};
