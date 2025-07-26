import React, { useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { CalendarList, Agenda, DateData } from 'react-native-calendars';
import { useFamily } from '../context/FamilyContext';
import { useGoogleCalendar } from '../services/GoogleCalendarService';
import { Task } from '../types';
import { format } from 'date-fns';

interface AgendaItem {
  name: string;
  time?: string;
  points?: number;
  isGoogle?: boolean;
}

export const CalendarScreen: React.FC = () => {
  const { tasks } = useFamily();
  const { listUpcomingEvents, authenticated } = useGoogleCalendar();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Record<string, AgendaItem[]>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const agenda: Record<string, AgendaItem[]> = {};

      // 1. Local tasks with dueDate
      tasks.forEach((task: Task) => {
        if (!task.dueDate) return;
        const day = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!agenda[day]) agenda[day] = [];
        agenda[day].push({
          name: `📋 ${task.title}`,
          time: format(new Date(task.dueDate), 'HH:mm'),
          points: task.points,
        });
      });

      // 2. Google Calendar events (next 30)
      if (authenticated) {
        try {
          const events = await listUpcomingEvents(30);
          events.forEach((ev) => {
            if (!ev.start?.dateTime) return;
            const day = format(new Date(ev.start.dateTime), 'yyyy-MM-dd');
            if (!agenda[day]) agenda[day] = [];
            agenda[day].push({
              name: `📅 ${ev.summary}`,
              time: format(new Date(ev.start.dateTime), 'HH:mm'),
              isGoogle: true,
            });
          });
        } catch (e) {
          console.log('Failed to load Google events', e);
        }
      }

      setItems(agenda);
      setLoading(false);
    };

    load();
  }, [tasks, authenticated]);

  const renderItem = (item: AgendaItem) => (
    <View style={styles.agendaItem}>
      <Text style={styles.agendaText}>{item.time ? item.time + ' – ' : ''}{item.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}> 
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Agenda
      items={items}
      selected={format(new Date(), 'yyyy-MM-dd')}
      renderItem={renderItem}
      theme={{
        agendaDayTextColor: '#007bff',
        agendaTodayColor: '#dc3545',
      }}
    />
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  agendaItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  agendaText: { fontSize: 16 },
}); 