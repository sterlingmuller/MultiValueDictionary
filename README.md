# Multi-Value Dictionary

This interactive command-line application allows you to manage a multi-value dictionary in memory. It supports the following commands:

- **KEYS:** Lists all keys in the dictionary.
- **MEMBERS &lt;key>:** Lists all members for a given key.
- **ADD &lt;key> &lt;member>:** Adds a member to a key.
- **REMOVE &lt;key> &lt;member>:** Removes a specific member from a key.
- **REMOVEALL &lt;key>:** Removes all members from a key.
- **KEYEXISTS &lt;key>:** Checks if a key exists in the dictionary.
- **ALLMEMBERS:** Returns all the members in the dictionary, regardless of key.
- **ITEMS:** Returns a numbered list of keys with their members.
- **CLEAR:** Clears all data from the dictionary.
- **HELP:** Displays a list of available commands.
- **IMPORT &lt;filepath>.json:** Imports data from a JSON file.
- **EXPORT &lt;filepath>.json:** Exports data to a JSON file.
- **EXIT:** Exits the application.

## Installation

**Prerequisites:**

   - Node.js: Ensure you have Node.js installed on your system. You can download it from the official website: [https://nodejs.org/](https://nodejs.org/)
   - Git: Ensure you have Git installed on your system if you wish to clone the repository. You can download it from the official website: [https://git-scm.com/](https://git-scm.com/) 

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/sterlingmuller/MultiValueDictionary.git
   cd MultiValueDictionary
   ```

2. **Install Dependencies:**
      ```bash
      npm install
   ```

3. **Build and run the project:**
   There are two ways to run the project:

   - **Standard Mode:**
     ```bash
     npm start
     ```
     This mode runs the application with the default formatting provided in the work sample

   - **Experimental Mode:**
     ```bash
     npm run start:experimental
     ```
     This mode provides a more stylized formatting

## Testing

This project uses Jest for unit testing. To run the tests, use the following command:

```bash
npm test
```

To view a coverage report, you can run:

```bash
npm run test:coverage
```

Example dictionary files for testing the `IMPORT` command can be found in the `test/assets` folder.
