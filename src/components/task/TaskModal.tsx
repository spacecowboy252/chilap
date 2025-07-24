import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
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
  }) => void;
  childrenOptions: Child[];
}

export const TaskModal: React.FC<Props> = ({ visible, onClose, onSave, childrenOptions }) => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [icon, setIcon] = useState('⭐️');
  const [childId, setChildId] = useState(childrenOptions[0]?.id || '');

  const reset = () => {
    setTitle('');
    setPoints(10);
    setDifficulty('easy');
    setIcon('⭐️');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, points, difficulty, icon, childId });
    reset();
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
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

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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