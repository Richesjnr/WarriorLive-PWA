/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  hemoglobinType: 'HbSS' | 'HbSC' | 'HbSB0' | 'HbSB+' | 'Other';
  baselineHb: number; // baseline hemoglobin in g/dL
  baselineRetics: number; // baseline reticulocyte %
  gender: 'male' | 'female' | 'other';
  hasSplenomegaly: boolean;
}

export interface ClinicalTelemetry {
  painLevel: number; // 0 to 10
  temperatureCelsius: number; // body temperature
  bloodPressure: string; // e.g. "120/80"
  heartRate?: number; // e.g. 72
  oxygenSaturation?: number; // e.g. 98%
  emergencyButtonPressed: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  facility: string;
  doctorName?: string;
  purpose: string;
}

export enum BadgeStatus {
  GREEN_NORMAL = 'GREEN_NORMAL',
  ORANGE_WARN = 'ORANGE_WARN',
  RED_CRITICAL = 'RED_CRITICAL'
}

export enum UiNavigationRoute {
  DASHBOARD = '/dashboard',
  EMERGENCY = '/emergency',
  CALENDAR = '/calendar',
  LOCATOR = '/locator',
  KNOWLEDGE = '/knowledge',
  COMMUNITY = '/community',
  ADMIN = '/admin'
}

export interface VitalsInsightCard {
  badgeStatus: BadgeStatus;
  displaySummary: string;
}

export interface CalendarWidget {
  focusedEventSummary: string;
  hasPendingAction: boolean;
}

export interface LocationService {
  geoSearchQuery: string;
  mapInstructionText: string;
}

export interface TelemetryResponse {
  greetingText: string;
  uiNavigationRoute: string; // '/dashboard' | '/emergency' | '/calendar' | '/locator'
  globalEmergencyActive: boolean;
  vitalsInsightCard: VitalsInsightCard;
  calendarWidget: CalendarWidget;
  locationService: LocationService;
}
