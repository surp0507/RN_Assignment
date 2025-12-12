

## Step 1: Start Metro
First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

### Folderstructure


AWESOMEPROJECT
├── android/ # Native Android project
├── ios/ # Native iOS project
├── node_modules/ # Dependencies
│
├── src/ # Main source code
│ ├── api/ # API & network modules
│ │
│ ├── Screens/ # Screens (UI pages)
│ │ ├── Screen1.tsx
│ │ └── Screen2.tsx
│ │
│ ├── slices/ # Redux Toolkit slices
│ │ └── index.ts
│ │
│ ├── store/ # Redux store config
│ │ └── index.ts
│ │
│ ├── types/ # Type definitions
│ │ └── index.ts
│ │
│ ├── utils/ # Helper functions (NetInfo, Storage, etc.)
│ │ ├── netInfo.ts
│ │ └── storage.js
│ │
│ └── App.tsx # App entry point
│
├── .eslintrc.js # ESLint config
├── .prettierrc.js # Prettier config
├── .gitignore
├── babel.config.js # Babel compiler config
├── metro.config.js # Metro bundler config
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript config
└── README.md # Project documentation