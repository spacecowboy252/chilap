import { useAuth } from '../context/AuthContext';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: Array<{ email: string }>;
}

const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3';

export const useGoogleCalendar = () => {
  const { accessToken } = useAuth();

  const authHeader = accessToken
    ? { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
    : null;

  const listUpcomingEvents = async (maxResults = 10): Promise<CalendarEvent[]> => {
    if (!authHeader) return [];
    const now = new Date().toISOString();
    const url = `${CALENDAR_BASE}/calendars/primary/events?timeMin=${now}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url, { headers: authHeader });
    if (!res.ok) throw new Error('Failed to fetch events');
    const json = await res.json();
    return json.items || [];
  };

  const createEvent = async (event: CalendarEvent): Promise<string | null> => {
    if (!authHeader) throw new Error('Not authenticated');
    const url = `${CALENDAR_BASE}/calendars/primary/events`;
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error('Failed to create event');
    const json = await res.json();
    return json.id;
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    if (!authHeader) throw new Error('Not authenticated');
    const url = `${CALENDAR_BASE}/calendars/primary/events/${eventId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update event');
    return await res.json();
  };

  const deleteEvent = async (eventId: string) => {
    if (!authHeader) throw new Error('Not authenticated');
    const url = `${CALENDAR_BASE}/calendars/primary/events/${eventId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeader,
    });
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete event');
    return true;
  };

  return {
    authenticated: !!authHeader,
    listUpcomingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}; 