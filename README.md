# Portfolio Tracker Application

## Overview

This project demonstrates the **frontend capabilities of Angular** through the implementation of a Portfolio Tracker application. It is designed to showcase modern development practices, reusable components, and effective integration of libraries and frameworks. The application is tailored to display dynamic stock market data, calculate key financial statistics, and visually present data using interactive charts.

The primary goal of this project is to demonstrate proficiency in Angular for professional opportunities. It is structured to be clean, modular, and extendable, adhering to best practices that technical leads, developers, and recruiters will appreciate.

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

2. **Interactive Charts**:
   - Uses Plotly.js for real-time stock performance visualization.
   - Implements scatter plots with line modes for a clear and detailed trend representation.

3. **Financial Statistics**:
   - Calculates performance metrics like profit percentage and total profit dynamically.
   - Identifies the highest and lowest stock prices and their corresponding dates.

4. **Component-Based Architecture**:
   - Decoupled, reusable components such as:
     - **Stock Chart Component**: Manages stock data visualization.
     - **Statistics Component**: Performs financial computations and displays results.
     - **Results Component**: Integrates and displays charts and statistics in a cohesive layout.

5. **Input Binding and Change Detection**:
   - Leverages Angular's two-way data binding to dynamically update charts and statistics based on user inputs.

6. **Type Safety and Validation**:
   - Implements TypeScript for robust type safety and reliable development.

7. **Clean and Maintainable Code**:
   - Modular folder structure for easy navigation and scalability.
   - Comments and meaningful naming conventions for better code readability.

---

## Project Structure

src/ ├── app/ │ ├── results/ │ │ ├── results.component.ts │ │ ├── results.component.html │ │ └── results.component.css │ ├── stock-chart/ │ │ ├── stock-chart.component.ts │ │ ├── stock-chart.component.html │ │ └── stock-chart.component.css │ ├── statistics/ │ │ ├── statistics.component.ts │ │ ├── statistics.component.html │ │ └── statistics.component.css ├── assets/ // Static assets such as images or external files ├── environments/ // Environment configurations for dev and prod


---

## How to Run

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
2. **Install Dependencies: Ensure you have Node.js and Angular CLI installed. Then run**:
npm install
3. **Start the Development Server**:
ng serve
4. **Build for Production**:
ng build --prod

The output files will be available in the dist/ directory.

