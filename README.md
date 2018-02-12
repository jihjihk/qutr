# qutr

## BleManager
An attempt to use Bluetooth Low Energy to send messages between two phones. As of right now, the implementaiton succeeds in scanning and connecting to a peripheral device, but for our purposes fulfill only half of the requirements, as our devices need to both send and receive messages. Will attempt to finish this if we are able to meet our deadline.

## Firechat
An alternative to the BLE solution - using WiFi. This implementation uses React Native and Redux, with Firebase as the backend, allowing any user who connects to the database to be able to send messages to one another. This is adapted from the example given [here](https://github.com/rubygarage/react-native-firebase-chat). Next steps are to identify specific users to connect to.

### How to run
Clone the repo: `git clone`. Run `npm install`. In order to run two simulators on a Mac, follow these steps:
1. `cd /Applications/Xcode.app/Contents/Developer/Applications`
2. `open -n Simulator.app`
3. Wait for the simulator to start, and then on the menu bar on the very top of the screen, choose Hardware > Device, and then choose the device you wish.
4. `cd` back into Firechat/
5. `react-native run-ios --simulator "iPhone SE"`. Replace "iPhone SE" with whatever device you chose in step 3.
6. Repeat steps 1-5 to open another device.

### Useful References
#### Building with Firebase
* https://medium.com/react-native-development/tutorial-build-a-chat-app-with-firebase-and-redux-ca76a910fab7
* https://school.shoutem.com/lectures/chat-app-firebase-redux-react-native/
* https://www.firebase.com/docs/web/guide/understanding-data.html
#### What is Redux?
* http://www.youhavetolearncomputers.com/blog/2015/9/15/a-conceptual-overview-of-redux-or-how-i-fell-in-love-with-a-javascript-state-container
* https://daveceddia.com/how-does-redux-work/
* https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6
* https://egghead.io/lessons/react-redux-the-single-immutable-state-tree
