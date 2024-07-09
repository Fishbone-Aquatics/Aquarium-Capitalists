## Screenshots
[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingGridExample.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingGridExample.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingInventory.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingInventory.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/ExpeditionsWorkWithDrops.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/ExpeditionsWorkWithDrops.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/CoolProfiler.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/CoolProfiler.gif)

## TODO:
Add tooltips/hover for item stats/descriptions etc.
Turn right side into a tabbed "settings" thing
one for equipment, settings and something else - stats should be a pop out button / details thing.'


## file layout
```
/src
|-- /components
|   |-- /common
|   |   |-- Button.jsx
|   |   |-- Modal.jsx
|   |   `-- etc.
|   |-- /inventory
|   |   |-- InventoryGrid.jsx
|   |   `-- InventorySelection.jsx
|   `-- /equipment
|       |-- EquipmentGrid.jsx
|       `-- EquipmentItem.jsx
|-- /features
|   |-- /player
|   |   |-- playerSlice.js
|   |   `-- playerHooks.js  # Custom hooks if needed
|-- /app
|   |-- store.js
|   `-- rootReducer.js  # If you have multiple reducers
|-- /pages
|   |-- Home.jsx
|   |-- Battle.jsx
|   `-- Breeding.jsx
|-- App.jsx
`-- index.jsx
```

## Commit docs
https://github.com/SobieskiCodes/Codefolio/blob/websocket/.github/workflows/CONVENTIONAL_COMMITS.md
https://github.com/SobieskiCodes/Codefolio/blob/websocket/.github/workflows/PROPERLY_SCOPED_BRANCH.MD



