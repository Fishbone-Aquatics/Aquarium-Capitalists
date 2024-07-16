## Come test & play
[http://dev.fishboneaquatics.com/](http://dev.fishboneaquatics.com/)

## TODO:
- offline progression. (We can start with 5 minutes for testing, up to 24 hours but with the consideration that there will be ways to increase it via in game currency later)
- button to reset account until there is a sign in.

## Screenshots
[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingGridExample.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingGridExample.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingInventory.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/WorkingInventory.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/ExpeditionsWorkWithDrops.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/ExpeditionsWorkWithDrops.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/CoolProfiler.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/CoolProfiler.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/GatheringWorking.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/GatheringWorking.gif)

[<img src="https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/ExpeditionStats.gif">](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/main/screenshots/ExpeditionStats.gif)


## file layout example
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

## Useful docs for me
https://github.com/SobieskiCodes/Codefolio/blob/websocket/.github/workflows/CONVENTIONAL_COMMITS.md
https://github.com/SobieskiCodes/Codefolio/blob/websocket/.github/workflows/PROPERLY_SCOPED_BRANCH.MD
https://docs.google.com/document/d/1_K5F1I7iJGMqax2JdnS1ja4mLUppdm_f7yZoA6i8TqA/edit


# nice to know commands
git commit --allow-empty -m "chore: trigger release-please"
testing
<p>

## commands for ec2

### pm2
`pm2 start npm --name "react-app" -- run dev`

### git

do the below when actions errors / locks up with conflicts.
<p>

```
cd /Aquarium-Capitalists
git clone https://github.com/Fishbone-Aquatics/Aquarium-Capitalists.git
cd Aquarium-Capitalists

Pull the latest changes (usually this one)
git pull origin development
# or
git pull --rebase origin development
```

## commands for ec2

# pm2
`pm2 start npm --name "react-app" -- run dev`

# git 
# do the below when actions errors / locks up with conflicts.
```cd /Aquarium-Capitalists
git clone https://github.com/Fishbone-Aquatics/Aquarium-Capitalists.git
cd Aquarium-Capitalists

# Pull the latest changes (usually this one)
git pull origin development
# or
git pull --rebase origin development
```

