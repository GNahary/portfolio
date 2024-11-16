# Portfolio Tracker Application

## Overview

This project is an implementation of a Portfolio Tracker application. It is designed to showcase modern development practices, reusable components, and effective integration of libraries and frameworks. The application is tailored to display dynamic stock market data, calculate key financial statistics, and visually present data using interactive charts.

The data for the calculations is taken from Alpha Vantage. Since usage of the free API tier is limited, local storage is used to cache results. If you are using an already running version of it, you might encounter data fetching issues imposed by these restrictions.

The project is structured to be clean, modular, and extendable, adhering to best practices.

---

## Features and Highlights

### Technologies and Libraries
- **Angular 17**: Leveraging the latest features of Angular for robust frontend development.
- **Plotly.js**: Interactive, high-performance charts to visualize stock market trends.
- **Angular Material**: Modern and responsive UI components for enhanced user experience.
- **Font Awesome**: Scalable vector icons and social logos for visual consistency.
- **Standalone Components**: Modular design using Angular's standalone component architecture.
- **Responsive Design**: Optimized layouts for various screen sizes using CSS Grid and Flexbox.

### Key Functionalities
1. **Dynamic Stock List**:
   - Allows users to manage and view stocks with dynamic data inputs.
   - Handles varying lengths of stock data efficiently.

2. **Local Storage Usage**:
   - Allows caching API call results to reduce number of API calls.
   - Cache service makes sure that the data is not stale.

3. **Interactive Charts**:
   - Uses Plotly.js for real-time stock performance visualization.
   - Implements scatter plots with line modes for a clear and detailed trend representation.

4. **Financial Statistics**:
   - Calculates performance metrics like profit percentage and total profit dynamically.
   - Identifies the highest and lowest stock prices and their corresponding dates.

5. **Component-Based Architecture**:
   - Decoupled, reusable components such as:
     - **Stock Chart Component**: Manages stock data visualization.
     - **Statistics Component**: Performs financial computations and displays results.
     - **Results Component**: Integrates and displays charts and statistics in a cohesive layout.

6. **Input Binding and Change Detection**:
   - Leverages Angular's two-way data binding to dynamically update charts and statistics based on user inputs.

7. **Type Safety and Validation**:
   - Implements TypeScript for robust type safety and reliable development.

8. **Clean and Maintainable Code**:
   - Modular folder structure for easy navigation and scalability.
   - Comments and meaningful naming conventions for better code readability.

---

## Project Structure
    src/
    ├── app/
    ├── dashboard/
    │   │   ├── dashboard.component.ts
    │   │   ├── dashboard.component.html
    │   │   ├── dashboard.component.css
    ├── results/
    │   │   ├── results.component.ts
    │   │   ├── results.component.html
    │   │   ├── results.component.css
    │   ├── stock-chart/
    │   │   ├── stock-chart.component.ts
    │   │   ├── stock-chart.component.html
    │   │   ├── stock-chart.component.css
    │   ├── statistics/
    │   │   ├── statistics.component.ts
    │   │   ├── statistics.component.html
    │   │   ├── statistics.component.css
    ├── stock-cache.service.ts   
    ├── stock-trade.service.ts
    ...


---

## How to Run

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
2. **Install Dependencies: Ensure you have Node.js and Angular CLI installed. Then run**:
    ```bash
    npm install
3. **Install Material: Ensure you have Node.js and Angular CLI installed. Then run**:
    ```bash
   ng add @angular/material
4. **Install Font Awesome**:
   Instructions can be found here: https://www.npmjs.com/package/@fortawesome/angular-fontawesome
5. **Start the Development Server**:
   ```bash
   ng serve
6. **Build for Production**:
   ```bash
   ng build --prod

The output files will be available in the dist/ directory.

