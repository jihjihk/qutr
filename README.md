# qutr

## QuTr
Our application uses `node 9.3.0` and `npm 5.6.0`, since `npm 5.5.x` may cause bugs in `node 9.3.0`. `node 9.3.0` comes with `npm 5.5.x` by default, so you would have to run `npm i -g npm` in order to update the npm version. If you need to keep other versions of node, checkout [nvm](https://github.com/creationix/nvm), the Node Version Manager. Please ensure that you have these versions installed before running `npm install`.

### Running on iOS
react-native-camera is recently making the change from RCTCamera to RNCamera (see [react-native-camera repo](https://github.com/react-native-community/react-native-camera)). Because of this, the app will not build properly. In order to make this work:
1. Follow the steps detailed in react-native-camera to install. One important thing to note is that, since we do not have to use Face Detection in our app, follow the **Post install steps** to delete the **FaceDetector** folder in Xcode.
2. In your Finder, navigate to `ios/` and open the Xcode project
3. Click on **QuTR** with the blue icon next to it on the top left corner
4. Go to **Build Phases** and expand **Link Binary With Libraries**, then find libRCTCamera.a and remove it by clicking on the - button at the bottom.
5. Do the same with libRNSVG-tvOS.a
6. react-native-vector-icons currently has a bug, so follow [this solution](https://github.com/oblador/react-native-vector-icons/issues/626#issuecomment-362386341) to resolve it.
7. You should be ready to go now. Run `react-native run-ios` to start the project.


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
* https://stackoverflow.com/questions/47879031/firebase-database-structure-for-chat-application
* https://discuss.reactjs.org/t/building-both-chatroom-one-to-one-chat-app-in-react-native-with-firebase/9447
#### What is Redux?
* http://www.youhavetolearncomputers.com/blog/2015/9/15/a-conceptual-overview-of-redux-or-how-i-fell-in-love-with-a-javascript-state-container
* https://daveceddia.com/how-does-redux-work/
* https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6
* https://egghead.io/lessons/react-redux-the-single-immutable-state-tree
