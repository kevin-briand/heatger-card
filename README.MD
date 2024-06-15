# Heatger card

This repository contains the card for home assistant, it's used for manage and control [heatger integration](https://github.com/kevin-briand/heatger).

This card has English/French translation

---
### table of contents
- **[custom card for home assistant](#heatger-card)**
    - **[Install](#install)**
    - **[use](#use)**

# heatger card
![card.png](img/card.png)
## Install
### With HACS
- Go to the HACS panel
- select 3 dots in the top right corner > Custom repositories
- paste https://github.com/kevin-briand/heatger-card and select integration category
- find the massa_node integration in the list and download it
- go to Settings > Devices & services > add integration
- select Massa Node
- fill out the form

### Manual
To install this integration, follow these steps.
- add the custom_components folder into the home assistant config folder
- go to Settings > Devices & services > add integration
- select Massa Node
- fill out the form

## use
### toggle state/mode
You can click on the mode/state buttons to change the mode/state(mode: auto<>manual, state: comfort<>eco).
### activate/deactivate frost-free
To activate frost-free, select the end date and click Activate.
when the frost-free is activated, the remaining time to the end is displayed and you can click on the stop button to stop the frost-free.
