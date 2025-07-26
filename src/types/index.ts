// Core data models for multi-child family support
export interface Child {
  id: string;
  name: string;
  age: number; // 6-12 years
  avatar?: string;
  preferences: ChildPreferences;
  stats: ChildStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildPreferences {
  favoriteColors: string[];
  preferredRewards: RewardType[];
  difficultyLevel: 'easy' | 'medium' | 'hard';
  aiVoiceEnabled: boolean;
  uiTheme: 'animals' | 'space' | 'nature' | 'sports';
}

export interface ChildStats {
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  obtainedAt: Date;
}

export interface Task {
  id: string;
  childId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  dueDate?: Date;
  completedAt?: Date;
  aiDetected?: boolean; // For future AI integration
  parentApproved: boolean;
  createdAt: Date;
  icon?: string; // Emoji or icon name for visual cue
  color?: string; // Optional custom color
  calendarEventId?: string; // Google Calendar event link
  status: TaskStatus;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: RewardType;
  pointsCost: number;
  isAvailable: boolean;
  category: RewardCategory;
  estimatedTime?: number; // For experience rewards
  calendarEventId?: string; // Google Calendar integration
}

// Redemption record – a child requests a reward, parent approves/rejects
export interface Redemption {
  id: string;
  rewardId: string;
  childId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string; // parentId
}

export type RewardType = 'virtual' | 'experience' | 'privilege' | 'activity';
export type RewardCategory = 'fun' | 'educational' | 'physical' | 'social' | 'creative';
export type TaskCategory = 'chores' | 'homework' | 'behavior' | 'selfcare' | 'social';
export type TaskStatus = 'new' | 'in_progress' | 'done';

export interface Family {
  id: string;
  name: string;
  children: Child[];
  parents: Parent[];
  settings: FamilySettings;
  subscription: SubscriptionTier;
  createdAt: Date;
  redemptions?: Redemption[];
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  role: 'primary' | 'secondary' | 'caregiver';
  permissions: ParentPermissions;
}

export interface ParentPermissions {
  canAddChild: boolean;
  canRemoveChild: boolean;
  canManageTasks: boolean;
  canManageRewards: boolean;
  canViewAI: boolean;
}

export interface FamilySettings {
  timezone: string;
  language: string;
  aiEnabled: boolean;
  calendarIntegration: boolean;
  classroomMode: boolean;
  maxChildren: number; // 3-10 for families, 100+ for classrooms
}

// AI Behavior Detection Types (Future Integration)
export interface BehaviorEvent {
  id: string;
  childId: string;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  aiConfidence?: number;
  context: BehaviorContext;
  timestamp: Date;
  parentVerified: boolean;
}

export interface BehaviorContext {
  location?: string;
  activity?: string;
  mood?: string;
  triggers?: string[];
  environmentalFactors?: EnvironmentalFactors;
}

export interface EnvironmentalFactors {
  timeOfDay: string;
  dayOfWeek: string;
  weather?: string;
  peoplePresent: string[];
  noiseLevel?: 'quiet' | 'moderate' | 'loud';
}

// AI Analysis Types
export interface AIAnalysis {
  childId: string;
  behaviorPatterns: BehaviorPattern[];
  recommendations: AIRecommendation[];
  predictions: BehaviorPrediction[];
  lastAnalyzed: Date;
}

export interface BehaviorPattern {
  pattern: string;
  frequency: number;
  confidence: number;
  triggers: string[];
  suggestedInterventions: string[];
}

export interface AIRecommendation {
  type: 'reward' | 'intervention' | 'schedule' | 'activity';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  expectedOutcome: string;
}

export interface BehaviorPrediction {
  pattern: string;
  probability: number;
  timeframe: string;
}

export type SubscriptionTier = 'free' | 'family' | 'classroom' | 'enterprise'; 