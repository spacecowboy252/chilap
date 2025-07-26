import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { difficultyColors } from '../../constants/theme';
import { Child } from '../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
    icon: string;
    childId: string;
    dueDate?: Date;
  }) => void;
  childrenOptions: Child[];
}

export const TaskModal: React.FC<Props> = ({ visible, onClose, onSave, childrenOptions }) => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [icon, setIcon] = useState('⭐️');
  const [childId, setChildId] = useState(childrenOptions[0]?.id || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);

  const reset = () => {
    setTitle('');
    setPoints(10);
    setDifficulty('easy');
    setIcon('⭐️');
    setDueDate(undefined);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, points, difficulty, icon, childId, dueDate });
    reset();
    onClose();
  };

  // Use Modal on native, fallback to inline overlay on web to avoid RN Web findDOMNode issues
  const Content = (
    <View style={styles.overlay}>
      <View style={styles.container}>
          <Text style={styles.header}>Create Task</Text>

          <Text style={styles.label}>Child</Text>
          <Picker selectedValue={childId} onValueChange={(v) => setChildId(v)}>
            {childrenOptions.map((child) => (
              <Picker.Item key={child.id} label={child.name} value={child.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            style={styles.input}
          />

          <Text style={styles.label}>Points: {points}</Text>
          <Slider
            minimumValue={5}
            maximumValue={100}
            step={5}
            value={points}
            onValueChange={setPoints}
            minimumTrackTintColor="#007bff"
            style={{ width: '100%' }}
          />

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.diffRow}>
            {(['easy', 'medium', 'hard'] as const).map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.diffButton,
                  { backgroundColor: difficultyColors[lvl] },
                  difficulty === lvl && styles.diffButtonActive,
                ]}
                onPress={() => setDifficulty(lvl)}
              >
                <Text style={styles.diffText}>{lvl.charAt(0).toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Due Date */}
          <Text style={styles.label}>Due Date</Text>
          {Platform.OS === 'web' ? (
            <View style={{ width: '100%' }}>
              {/* @ts-ignore raw HTML for web */}
              <input
                type="datetime-local"
                value={dueDate ? new Date(dueDate.getTime() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,16) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setDueDate(val ? new Date(val) : undefined);
                }}
                style={{
                  width: '100%',
                  padding: 10,
                  border: '1px solid #dee2e6',
                  borderRadius: 12,
                  fontSize: 16,
                }}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowPicker(true)}
              >
                <Text>{dueDate ? dueDate.toLocaleString() : 'Select date & time'}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, date) => {
                    if (Platform.OS !== 'ios') setShowPicker(false);
                    if (date) setDueDate(date);
                  }}
                />
              )}
            </>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return visible ? Content : null;
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      {Content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    marginTop: 4,
  },
  diffRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  diffButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffButtonActive: { borderWidth: 3, borderColor: '#212529' },
  diffText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
  cancelText: { color: '#dc3545', fontSize: 16 },
}); 