# Add Language Rules

To add a new language to the frontend application, follow these steps:

1.  **Add Flag Icon**:
    *   Ensure the corresponding flag icon SVG exists in `src/frontend/web/public/assets/images/flags/`.
    *   The file name should be the uppercase language code (e.g., `ZH.svg` for Chinese).

2.  **Create Localization File**:
    *   Create a new JSON file in `src/frontend/web/public/locales/` named with the language code (e.g., `zh.json`).
    *   Populate it with key-value pairs. You can copy `en.json` as a starting point.

3.  **Register Locale**:
    *   Open `src/frontend/web/i18n.ts`.
    *   Import the new JSON file: `import zh from './public/locales/zh.json'`.
    *   Add it to the `langObj` object: `const langObj: any = { en, ur, zh }`.

4.  **Update Configuration**:
    *   Open `src/frontend/web/store/slices/themeConfigSlice.tsx`.
    *   Add the new language to the `languageList` array in `initialState`:
        ```typescript
        languageList: [
            { code: 'en', name: 'English' },
            { code: 'ur', name: 'Urdu' },
            { code: 'zh', name: 'Chinese' },
        ],
        ```

5.  **Verify**:
    *   Run the application and check the language dropdown.
    *   Ensure text updates when the language is selected.
