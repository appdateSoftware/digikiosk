// import dependencies
import { Dimensions, Platform, StatusBar } from "react-native";

// Layout Config
const android = Platform.OS === "android";
const screen = Dimensions.get("window");
const statusBarHeight = android ? StatusBar.currentHeight : 0;

const SCREEN_WIDTH = screen.width;
const SCREEN_HEIGHT = android ? screen.height - statusBarHeight : screen.height;
const SMALL_MARGIN = 16;
const SMALL_PADDING = 16;

// console.log(screen.width + " x " + screen.height, StatusBar.currentHeight);
// console.log(SCREEN_WIDTH + " x " + SCREEN_HEIGHT);

const layout = {
  SCREEN_WIDTH: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,
  SCREEN_HEIGHT: SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH,
  SMALL_MARGIN,
  SMALL_PADDING
};

export default layout;
