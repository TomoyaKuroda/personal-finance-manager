# Personal Finance Manager

Personal Finance Manager is a web application designed to help users track and manage their personal finances. The application leverages MongoDB for data storage and provides features such as expense tracking, budget management, and financial reporting.

## Features

- **Expense Tracking:** Log and categorize your daily expenses.
- **Budget Management:** Set and monitor budgets for different categories.
- **Financial Reports:** Generate reports to visualize your spending habits.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TomoyaKuroda/personal-finance-manager.git
   cd personal-finance-manager
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```plaintext
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
```

- `MONGODB_URI`: Your MongoDB connection string.
- `DB_NAME`: The name of the database you want to use.

### Running the Application

To start the application, use the following command:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.