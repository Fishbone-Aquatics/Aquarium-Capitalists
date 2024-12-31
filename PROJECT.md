# Aquarium Capitalists
A game about owning an aquarium shop.

## What is currently being developed:
- We need a universal way to select & change "tasks" or "activites", it needs to be addressed and redone prior to expanding or it will become a nightmare later. 
  - IE. Status changes, ensuring background activities stay proper and in the background.

- Creating a boiler plate page/slice/feature ie. one fishing could just change variable names to get started with. 
  - The page should have an if prod check for displaying. ("This is an example widget/extension")

- Developing an "offline" solution.
  - A basic implementation exists at 5 minutes, it does not function or calculate anything in its current state. Last action tracking is working and happens at every save interval.
  - When the "page refreshes" is triggered a check happens from the last "action" (which could be hitting start, since hitting menu items doesn't update "last action", should clicks update it?)

- The home page and designing the basic functionality of your "shop" and primary "goal".
- aquirums should have "size limits" and expeditions could give "gold fish" rarely for now (or fishing if you want to implement that early, though i don't think it's necessary)



### Known bugs:
- [Inventory eats multiple equiped items](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/issues/55)

## Table of Contents
- [Introduction](#introduction)
- [The Basics](#the-basics)
  - [Aquarium Shop](#aquarium-shop)
    - [Status](#status)
      - [Progression](#progression)
      - [Offline Progression](#offline-progression)
      - [Shop Decay](#shop-decay)
    - [Currencies](#currencies)
    - [Level](#level)
      - [Experience](#experience)
      - [Skill Experience](#skill-experience)
    - [Skills](#skills)
      - [Expeditions](#expeditions)
      - [Gathering](#gathering)
  - [Inventory](#inventory)
      - [Stats & Equipment](#stats-and-equipment)
      - [Resources](#resources)
- [Currently Planned Features](#currently-planned-features)
  - [Fishing](#fishing)
  - [Crafting](#crafting)
  - [Shop System](#shop-system)
  - [Chat](#chat)
  - [Cloud Saves](#cloud-saves)
  - [Breeding](#breeding)
  - [Group Content](#group-content)
  - [Items and Market](#items-and-market)
  - [Quests](#quests)
- [Potential Planned Features](#potential-planned-features)
  - [Minigames](#minigames)
    - [Euchre](#euchre)
    - [Underwater Battles](#underwater-battles)
    - [Memory](#memory)
  - [Archetypes / Starting Bonuses](#archetypes--starting-bonuses)
  - [Monetization](#monetization)
  - [Expanded Backpack](#expanded-backpack)
  - [Extended Shop](#extended-shop)
- [Wiki](#wiki)

---

## Introduction
Aquarium Capitalists is a game about owning and managing an aquarium shop. Players will breed aquatic life, go on expeditions, complete quests, gather resources, and build a thriving aquarium empire.

## The Basics

### Aquarium Shop
- Manage your shop, sell aquatic life, and earn revenue.

#### Status
- **Progression:** Level up your shop by growing over time, gaining a loyal customer base, out living other active shops, completing expeditions for additional crafting resources and competing in clan battles for valueable loot.
- **Offline Progression:** Gain rewards while away from the game, up to 12 hours to start.
- **Shop Decay:** Login to maintain shop profits, over 3 days you will start to lose your active customers and begin to degrade in shop status until you become inactive, completly losing customers within 3 days and slowly shop stars over time.

#### Currencies
- **Premium Currency:** Pearls.
- **Normal Currency:** Shells. Earn through sales and expeditions.

#### Level
- **Experience:** Earn XP by completing tasks.
- **Skill Experience:** Specialize in areas like genetics, crafting, or sales.

#### Skills
- **Expeditions:** Explore locations like coral reefs and shipwrecks. Gain rewards and special items.
- **Gathering:** Harvest resources such as wood and sand to craft items or sell for profit.

### Inventory
- **Stats & Equipment:** Manage gear to boost stats and shop efficiency.
- **Resources:** Collect and store materials for crafting and upgrades.

## Currently Planned Features

### Fishing
- A dynamic fishing system to collect rare species and resources as well as decor.

### Shop System
- Fully customizable shops with layout options and level-locked features.

### Crafting
- Create items and equipment to enhance your shop and expeditions.

### Chat
- Interact with other players and coordinate group activities.

### Cloud Saves
- Seamless saving and syncing across devices.

### Breeding
- Genetic traits and rare variants to create unique aquatic life.

### Group Content
- Guilds or "Schools/Shoals" for collaborative gameplay, resource pooling, and competitive quests.

### Items and Market
- A dynamic marketplace to trade and auction rare items.

### Quests
- Engage in daily tasks, story-driven missions, and guild-based objectives.

## Potential Planned Features

### Minigames
- **Euchre:** A strategic card game.
- **Underwater Battles:** Clan-based combat system.
- **Memory:** A matching game for rewards.

### Archetypes / Starting Bonuses
- Choose from roles like Tycoon, Geneticist, Conservationist, and more, each with unique benefits.

### Monetization
- Optional skins, premium currency, and customizations.

### Expanded Backpack
- Increase inventory capacity for more efficient gameplay.

### Extended Shop
- Additional customization options and advanced features for shop management.

## Implementation Plan

### Phase 1: Core Gameplay Mechanics - Alpha
- Create a basic shop owning system.
- ~~Establish player stats and inventory systems.~~
- ~~Launch initial expeditions.~~
- ~~Design resource gathering.~~
- Implement some form of crafting
- Work in a basic shop mechanic
- Have a basic working logging system/websocket.

### Phase 2: Advanced Features - Beta
- Refine player stats/inventory/crafting systems
- Add Fishing.
- Expand expeditions/fishing zones/crafting. 
- Showcase breeding/genetics.
- Launch chat system.
- Decide on and build guild functionality.
- Bring in quests
- Introduce cloud saves

### Phase 3: Testing and Refinement - Release discussions
- Monetization features discussions.
- Conduct thorough gameplay testing.
- Collect player feedback.
- Refine UI/UX and balance mechanics.

### Phase 4: Out of Beta - Release
- Introduce minigames.
- Implement dynamic market system.

---

## Wiki
If this page doesn't answer your question, and its not technical or found within the [README](https://github.com/Fishbone-Aquatics/Aquarium-Capitalists/blob/development/README.md) perhaps you could visit the [Aquarium Capitalist Wiki](https://probsjustin.notion.site/Aquarium-Capitalist-Wiki-7791bdfec9534b94a74e4a820125c1fe?pvs=4).

