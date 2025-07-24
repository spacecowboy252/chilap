import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: Array<{ email: string }>;
}

class GoogleCalendarService {
  private accessToken: string | null = null;
  private calendarId = 'primary';

  async initialize(): Promise<boolean> {
    const stored = await AsyncStorage.getItem('google_access_token');
    if (stored) {
      this.accessToken = stored;
      return true;
    }
    return false;
  }

  async authenticateWithGoogle(): Promise<boolean> {
    // TODO implement Expo AuthSession flow
    console.log('Auth with Google – placeholder');
    return false;
  }

  async createEvent(event: CalendarEvent): Promise<string | null> {
    if (!this.accessToken) throw new Error('Not authenticated');
    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
      if (res.ok) {
        const json = await res.json();
        return json.id;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

export const googleCalendarService = new GoogleCalendarService(); 