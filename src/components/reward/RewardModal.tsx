import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RewardType, RewardCategory } from '../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    type: RewardType;
    pointsCost: number;
    category: RewardCategory;
    estimatedTime?: number;
  }) => void;
}

const REWARD_TYPES: Array<{ value: RewardType; label: string }> = [
  { value: 'virtual', label: 'Virtual Gift' },
  { value: 'experience', label: 'Experience' },
  { value: 'privilege', label: 'Privilege' },
  { value: 'activity', label: 'Activity' },
];

const REWARD_CATEGORIES: Array<{ value: RewardCategory; label: string }> = [
  { value: 'fun', label: 'Fun' },
  { value: 'educational', label: 'Educational' },
  { value: 'physical', label: 'Physical' },
  { value: 'social', label: 'Social' },
  { value: 'creative', label: 'Creative' },
];

export const RewardModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RewardType>('virtual');
  const [category, setCategory] = useState<RewardCategory>('fun');
  const [pointsCost, setPointsCost] = useState(50);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);

  const reset = () => {
    setTitle('');
    setDescription('');
    setType('virtual');
    setCategory('fun');
    setPointsCost(50);
    setEstimatedTime(undefined);
  };

  const handleSave = () => {
    if (!title.trim()) {
      // TODO: Show error
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      pointsCost,
      estimatedTime,
    });
    reset();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Create New Reward</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Reward title"
            style={styles.input}
            maxLength={30}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this reward?"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            maxLength={100}
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={type} onValueChange={(v) => setType(v)}>
              {REWARD_TYPES.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={category} onValueChange={(v) => setCategory(v)}>
              {REWARD_CATEGORIES.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Points Cost: {pointsCost}</Text>
          <View style={styles.pointsContainer}>
            {[25, 50, 75, 100, 150, 200].map((points) => (
              <TouchableOpacity
                key={points}
                style={[
                  styles.pointsButton,
                  pointsCost === points && styles.pointsButtonActive,
                ]}
                onPress={() => setPointsCost(points)}
              >
                <Text style={[
                  styles.pointsButtonText,
                  pointsCost === points && styles.pointsButtonTextActive,
                ]}>
                  {points}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {type === 'experience' && (
            <>
              <Text style={styles.label}>Estimated Time (minutes)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={estimatedTime || 30}
                  onValueChange={(v) => setEstimatedTime(v)}
                >
                  {[15, 30, 45, 60, 90, 120].map((minutes) => (
                    <Picker.Item key={minutes} label={`${minutes} min`} value={minutes} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Create Reward</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pointsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pointsButton: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  pointsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pointsButtonTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 16,
  },
}); 