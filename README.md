# AwesomeProject

A modern **React Native** application structured for scalability, maintainability, and clean code. This project follows a modular folder architecture including screens, API layer, Redux Toolkit slices, utilities, and TypeScript types.




https://github.com/user-attachments/assets/08429a9c-0ebf-4fdf-91a6-95e1a42cdc67





## 📁 Project Structure

```
AwesomeProject
│
├── __tests__/              # Test files
├── android/                # Native Android project
├── ios/                    # Native iOS project
├── node_modules/           # Dependencies
├── src/
│   ├── api/                # API functions and axios setup
│   ├── Screens/            # All screens/components
│   ├── slices/             # Redux Toolkit slices
│   ├── store/              # Redux store setup
│   ├── types/              # Global TypeScript types
│   └── utils/              # Utility/helper functions
│
├── .eslintrc.js            # Linting configuration
├── .gitignore              # Git ignore rules
├── .prettierrc.js          # Prettier formatting config
├── .watchmanconfig         # Watchman configuration
├── App.tsx                 # Root App Component
├── app.json                # App configuration
├── babel.config.js         # Babel configuration
├── index.js                # Entry point
├── jest.config.js          # Jest test configuration
├── metro.config.js         # Metro bundler config
├── package.json            # App metadata and dependencies
├── tsconfig.json           # TypeScript config
├── yarn.lock               # Dependency lock file
└── README.md               # Project documentation
```

---

## 🚀 Features

* 📱 Built with **React Native**
* ⚡ State management using **Redux Toolkit**
* 🧪 Configured with **Jest** for testing
* 🧩 Modular and scalable folder structure
* 🛠 API abstraction layer with clean utilities
* 🔒 Type safety using **TypeScript**

---

## 🔧 Installation

```sh
yarn install
# or
npm install
```

---

## ▶️ Running the App

### Start Metro Bundler

```sh
yarn start
```

### Run on Android

```sh
yarn android
```

### Run on iOS

```sh
yarn ios
```

---

## 🧪 Running Tests

```sh
yarn test
```

---

## 🏗 Build Structure Overview

### **src/api/**

Contains all API-related code, axios configurations, and request functions.

### **src/Screens/**

Includes all app screens, separated into feature folders.

### **src/slices/**

Redux Toolkit slices for state management.

### **src/store/**

The central Redux store configuration.

### **src/types/**

TypeScript types/interfaces used throughout the project.

### **src/utils/**

Helper and utility functions.

---

## 📦 Scripts

Common commands available:

```json
"scripts": {
  "start": "react-native start",
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "test": "jest"
}
```

---

## 🤝 Contributing

Feel free to contribute! Fork the repo, create a feature branch, and open a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.
