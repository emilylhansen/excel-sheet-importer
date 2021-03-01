# Excel Sheet Importer

The Excel Sheet Importer displays data in a more aesthetic way for the user. This app imports a json file of data per column and lets you choose which columns to display and in what order, edit data cells, select the data header row range, and the first data point row.

# Get Started

Use `yarn start` to run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Technologies

This app was created using react-create-app and is written in TypeScript, React, and Redux. It utilizes react-virtualized to render the grid, fp-ts, styled components, and the Material UI design system.

# Features

- The data header row range input takes a string and is parsed to check for a valid row. The first data point row input will change according to the data header row range result.
- Empty data cells will be marked as an error. Each column will display the total number of errors for the visible set.
- The data displayed in each column can be set, reset, and reordered. Only unselected columns appear in the dropdown.

![excel sheet importer](https://github.com/emilylhansen/excel-sheet-importer/blob/main/src/excel_sheet_importer.gif)
