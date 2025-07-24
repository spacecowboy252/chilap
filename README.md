# Children Behavior Tracking App (Starter)

This is a Phase-1 starter codebase for a multi-child behavior tracking application targeting ages 6-12. It is built with **React Native (Expo)** and **TypeScript** and is prepared for future AI modules and classroom extension.

## Getting Started

```bash
npm install
npm start # or npx expo start
```

## Tech Stack

- Expo SDK (latest)
- React Navigation 6+
- React Context + AsyncStorage
- Prepared for Google Auth & Calendar, TensorFlow.js

## Folder Structure

```
src/
  components/parent
  context
  navigation
  screens
  services
  types
  constants
  hooks
```

## Next Steps

1. Implement Google Sign-In and Calendar in `AuthContext` and `GoogleCalendarService`.
2. Flesh out task and reward management UIs.
3. Integrate AI detection models in `AIContext`. 