/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { BadgeStatus, UiNavigationRoute, TelemetryResponse } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to local medical heuristics.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper function to handle transient Gemini API errors (503 Service Unavailable, 429 Rate Limits, etc.) with exponential backoff and jitter
async function generateContentWithRetry(ai: GoogleGenAI, params: any, maxRetries = 5, initialDelay = 2000) {
  let attempt = 0;
  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      attempt++;
      
      // Check if the error is transient/retryable
      const errorString = error?.message || error?.toString() || '';
      const status = error?.status || error?.code || error?.error?.code;
      
      // If it's a quota exceeded error, do not retry as it will take too long
      const isQuotaExceeded = status === 429 && errorString.toLowerCase().includes('quota');
      
      const isTransient = 
        !isQuotaExceeded && (
        status === 503 || 
        status === 429 || 
        status === 500 || 
        status === 504 || 
        status === 408 ||
        errorString.includes('503') || 
        errorString.includes('429') || 
        errorString.includes('UNAVAILABLE') || 
        errorString.includes('high demand') ||
        errorString.includes('timeout') ||
        errorString.includes('fetch'));

      if (attempt >= maxRetries || !isTransient) {
        throw error;
      }

      // Exponential backoff with 20% random jitter to distribute retries evenly
      const jitter = (Math.random() - 0.5) * 0.2 * initialDelay;
      const delay = Math.pow(2, attempt - 1) * initialDelay + jitter;
      console.warn(`[Gemini API Warning] Retryable error encountered (Attempt ${attempt}/${maxRetries}). Retrying in ${Math.round(delay)}ms... Error: ${errorString}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// REST Endpoint: Post Telemetry & Retrieve Real-time UI State (Mangla et al., 2023 compliant)
app.post('/api/telemetry', async (req, res) => {
  try {
    const { profile, telemetry, appointments } = req.body;

    const name = profile?.name || 'Warrior';
    const hemoglobinType = profile?.hemoglobinType || 'HbSS';
    const gender = profile?.gender || 'other';

    const painLevel = Number(telemetry?.painLevel ?? 0);
    const tempCelsius = Number(telemetry?.temperatureCelsius ?? 37.0);
    const bp = telemetry?.bloodPressure || '120/80';
    const emergencyButtonPressed = !!telemetry?.emergencyButtonPressed;
    const oxygenSaturation = Number(telemetry?.oxygenSaturation ?? 98);

    // 1. STRICT MEDICAL SAFETY OVERRIDE (Deterministic Logic)
    // - emergencyButtonPressed === true
    // - painLevel >= 7 (Severe VOC Crisis)
    // - tempCelsius >= 38.3 (High risk of severe bacterial infection due to functional asplenia)
    if (emergencyButtonPressed || painLevel >= 7 || tempCelsius >= 38.3) {
      let emergencyReason = '';
      if (emergencyButtonPressed) emergencyReason = 'Manual Emergency Trigger';
      else if (painLevel >= 7 && tempCelsius >= 38.3) emergencyReason = 'Combined Severe Pain Crisis (VOC) & Severe Pyrexia/Infection Risk';
      else if (painLevel >= 7) emergencyReason = 'Severe Vaso-Occlusive Pain Crisis (VOC)';
      else if (tempCelsius >= 38.3) emergencyReason = 'High Fever Alert (≥38.3°C / 101°F) indicating potential life-threatening sepsis due to functional asplenia';

      const clinicalSummary = `EMERGENCY ALERT: ${emergencyReason}.
• TIME-TO-ANALGESIC MANDATES: Must receive triage pain management within 30 minutes of arrival and registration-to-analgesic delivery within 60 minutes.
• CONTRAINDICATION: Meperidine (Demerol) is STRICTLY BLACKLISTED due to neurotoxicity risks. Use IV morphine, hydromorphone, or fentanyl.
• OXYGEN THERAPY: Administer supplemental O₂ ONLY if room-air oxygen saturation drops below 95% (Current: ${oxygenSaturation}%).
• CRITICAL RISKS: Monitor closely for:
  1. Acute Chest Syndrome (new infiltrate on chest X-ray + cough/shortness of breath).
  2. Splenic Sequestration (rapid spleen enlargement, Hb drop >2 g/dL, hypovolemic shock).
  3. Aplastic Crisis (triggered by Parvovirus B-19; rapid Hb drop + flat reticulocytes).
  4. Priapism (sustained erection >4 hours - emergency intervention required).`;

      const response: TelemetryResponse = {
        greetingText: `Emergency State Active. Stay calm, ${name}. We are guiding you to safety.`,
        uiNavigationRoute: UiNavigationRoute.EMERGENCY,
        globalEmergencyActive: true,
        vitalsInsightCard: {
          badgeStatus: BadgeStatus.RED_CRITICAL,
          displaySummary: clinicalSummary,
        },
        calendarWidget: {
          focusedEventSummary: 'All standard appointments suspended. Seek immediate clinical triage.',
          hasPendingAction: true,
        },
        locationService: {
          geoSearchQuery: 'Sickle Cell comprehensive care emergency room hospital near me',
          mapInstructionText: `Directing to the nearest Emergency Department. Present your WarriorLive SCD Emergency Card on arrival. Triage target: <30 min analgesic delivery.`,
        },
      };

      return res.json(response);
    }

    // 2. STABLE STATE OR WARN STATE - Calculate local heuristics as baseline
    const isWarnState = painLevel >= 4 || tempCelsius >= 37.8 || (oxygenSaturation > 0 && oxygenSaturation < 95);
    const badgeStatus = isWarnState ? BadgeStatus.ORANGE_WARN : BadgeStatus.GREEN_NORMAL;
    const uiNavigationRoute = isWarnState ? UiNavigationRoute.DASHBOARD : UiNavigationRoute.DASHBOARD;

    // Default heuristics to fall back on if Gemini is not available
    let fallbackGreeting = `Welcome back, ${name}. Let's optimize your SCD health today!`;
    let fallbackSummary = `Vitals are stable. Your baseline ${hemoglobinType} profile is logged. Keep hydrated (minimum 3L fluid daily) to promote low blood viscosity and support normal HbF levels.`;
    if (isWarnState) {
      fallbackGreeting = `Take caution, ${name}. Some of your telemetry indicators are slightly elevated.`;
      fallbackSummary = `Moderate pain/temperature logged. Hydrate aggressively, avoid cold drafts/sudden temperature changes, and track your symptoms. If pain increases to 7+ or temperature reaches 38.3°C, activate the Emergency state immediately. Ensure Meperidine is NOT administered.`;
    }

    const nextAppointment = appointments && appointments.length > 0 
      ? appointments[0] 
      : null;
    const apptSummary = nextAppointment 
      ? `Upcoming: ${nextAppointment.title} at ${nextAppointment.facility} on ${nextAppointment.date} at ${nextAppointment.time}.` 
      : 'No upcoming appointments scheduled.';

    const fallbackGeo = isWarnState 
      ? 'Sickle Cell Specialized Care Center Day Clinic' 
      : 'Comprehensive Sickle Cell Treatment Clinic';
    const fallbackMapInst = isWarnState 
      ? 'Recommend contacting your specialized care clinic or hematology day unit for advice.' 
      : 'Find routine comprehensive SCD clinics near you for preventive maintenance checkups.';

    // Try utilizing Gemini 3.5-flash for personalized supportive micro-copy and clinical insights
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Analyze this Sickle Cell Disease patient profile and telemetry stream to generate personalized clinical state insights and supportive copy.
Patient Name: ${name}
Hemoglobin Genotype: ${hemoglobinType}
Gender: ${gender}
Pain Level: ${painLevel}/10
Temperature: ${tempCelsius}°C
Blood Pressure: ${bp}
Oxygen Saturation: ${oxygenSaturation}%
Upcoming appointments: ${JSON.stringify(appointments)}

Guidelines (Mangla et al., 2023):
- Since pain is < 7 and temp is < 38.3°C, this is a non-emergency state.
- If pain is 4-6 or temp is 37.8-38.2°C, mark as ORANGE_WARN, otherwise GREEN_NORMAL.
- Provide custom clinical-grade, highly empathetic recommendations tailored to their genotype.
- For HbSS: emphasize hydration, avoidance of cold stress, keeping hydroxyurea adherence to elevate fetal HbF.
- For HbSC: highlight retinopathy screening (high risk of proliferative sickle retinopathy) and monitoring for joint/renal symptoms.
- Speak in a supportive, de-identified tone. Mention fluid intake target of 3-4 liters.
- Emphasize meperidine (Demerol) blacklist contraindication if any pain is reported.
- Detail map instructions and geo-search queries for nearby specialized SCD comprehensive centers.

Return the result as a raw JSON matching the following schema exactly (DO NOT include any markdown, backticks, or intro/outro text, just the raw JSON):
{
  "greetingText": "Empathetic, personalized greeting including user's name, mentioning their Hb variant",
  "uiNavigationRoute": "/dashboard",
  "globalEmergencyActive": false,
  "vitalsInsightCard": {
    "badgeStatus": "${badgeStatus}",
    "displaySummary": "Detailed, clinical-grade analysis of their vitals, hydration, Hb genotype specifics, and precautions, written professionally."
  },
  "calendarWidget": {
    "focusedEventSummary": "Analysis of the next scheduled appointment and actionable advice.",
    "hasPendingAction": ${nextAppointment ? 'true' : 'false'}
  },
  "locationService": {
    "geoSearchQuery": "Pre-formatted search string targeting specialized clinics",
    "mapInstructionText": "Navigation advice or medical day-unit recommendation"
  }
}`;

        const aiResponse = await generateContentWithRetry(ai, {
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = aiResponse.text?.trim() || '';
        if (rawText) {
          // Parse and validate JSON structure
          const parsed = JSON.parse(rawText);
          if (parsed && typeof parsed === 'object') {
            return res.json({
              greetingText: parsed.greetingText || fallbackGreeting,
              uiNavigationRoute: parsed.uiNavigationRoute || uiNavigationRoute,
              globalEmergencyActive: false,
              vitalsInsightCard: {
                badgeStatus: parsed.vitalsInsightCard?.badgeStatus || badgeStatus,
                displaySummary: parsed.vitalsInsightCard?.displaySummary || fallbackSummary,
              },
              calendarWidget: {
                focusedEventSummary: parsed.calendarWidget?.focusedEventSummary || apptSummary,
                hasPendingAction: !!parsed.calendarWidget?.hasPendingAction,
              },
              locationService: {
                geoSearchQuery: parsed.locationService?.geoSearchQuery || fallbackGeo,
                mapInstructionText: parsed.locationService?.mapInstructionText || fallbackMapInst,
              },
            });
          }
        }
      } catch (geminiError) {
        console.error("Gemini API stream evaluation error:", geminiError);
        // Fall through to local heuristics
      }
    }

    // Fallback response using local medical intelligence rule engine
    const response: TelemetryResponse = {
      greetingText: fallbackGreeting,
      uiNavigationRoute,
      globalEmergencyActive: false,
      vitalsInsightCard: {
        badgeStatus,
        displaySummary: fallbackSummary,
      },
      calendarWidget: {
        focusedEventSummary: apptSummary,
        hasPendingAction: !!nextAppointment,
      },
      locationService: {
        geoSearchQuery: fallbackGeo,
        mapInstructionText: fallbackMapInst,
      },
    };

    return res.json(response);
  } catch (err: any) {
    console.error("General API telemetry parsing error:", err);
    res.status(500).json({ error: "Failed to parse telemetry stream. " + err.message });
  }
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message, modelName = 'gemini-2.5-flash' } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured' });
    }

    const systemInstruction = `You are a specialized clinical assistant for Sickle Cell Disease (WarriorLive). 
Your role is to provide empathetic, highly accurate, and clinically safe information based on Mangla et al. (2023) guidelines. 
Always prioritize patient safety. If a user reports pain >= 7, fever >= 38.3C, or breathing issues, advise immediate emergency care and do NOT provide diagnostic substitutes. 
Never recommend Meperidine (Demerol). Emphasize hydration and hydroxyurea adherence.`;

    const chatParams = {
      model: modelName,
      contents: history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] }
      }
    };
    
    // Append the latest message if not in history
    if (message) {
      chatParams.contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    const response = await generateContentWithRetry(ai, chatParams);
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// Weather proxy endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { latitude = 38.9072, longitude = -77.0369 } = req.query;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch from open-meteo');
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Weather API Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

// Bootstrapping Vite dev server or serving compiled build static folder
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WarriorLive telemetry engine online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
