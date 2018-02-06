# qutr

## BleManager
An attempt to use Bluetooth Low Energy to send messages between two phones. As of right now, the implementaiton succeeds in scanning and connecting to a peripheral device, but for our purposes fulfill only half of the requirements, as our devices need to both send and receive messages. Will attempt to finish this if we are able to meet our deadline.

## Firechat
An alternative to the BLE solution - using WiFi. This implementation uses React Native and Redux, with Firebase as the backend, allowing any user who connects to the database to be able to send messages to one another. This is adapted from the example given [here](https://github.com/rubygarage/react-native-firebase-chat). Next steps are to identify specific users to connect to.