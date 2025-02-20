# Whiskey Wizardry Project

## Overview
Whiskey Wizardry is an interactive application designed for whiskey enthusiasts to rate and provide feedback on various whiskey samples. The application features an Admin Panel for administrators to manage sample data and game settings.

## Features
- **User Interface**: A user-friendly interface for interacting with whiskey samples.
- **Admin Panel**: Secure login for administrators, with functionalities to update sample data and manage game settings.
- **Sample Rating**: Users can rate whiskey samples and provide feedback.
- **Quarterly Management**: Administrators can activate or deactivate the current quarter's game.

## Components
- **AdminPanel**: Main interface for administrators, including secure login and sample management.
- **GameInterface**: Allows users to interact with whiskey samples and submit ratings.
- **Login**: Handles secure login for administrators.
- **SampleForm**: Form for inputting and updating sample data.
- **ToggleQuarter**: Component for activating or deactivating the current quarter's game.

## Styles
The project includes centralized styling management to ensure a consistent look and feel across all components. Each component has its own CSS file for specific styles.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd whiskey-wizardry
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables.
5. Start the application:
   ```
   npm start
   ```

## Usage
- Access the Admin Panel for administrative tasks.
- Use the Game Interface to interact with whiskey samples.
- Log in using administrator credentials to manage sample data and game settings.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.