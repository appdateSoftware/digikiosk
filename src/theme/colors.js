// import config setting
import config from "../config";

// Color Themes
const themes = {
  jade: {
    // primary color
    primaryColor: "#00b970",
    primaryColorDark: "#00945a",
    primaryColorLight: "#00e78c",
    onPrimaryColor: "#fff",

    // accent color, triad
    accentColor: "#0069b9",
    onAccentColor: "#fff",

    // secondary color, primary color split
    secondaryColor: "#b90039",
    onSecondaryColor: "#fff",

    // tertiary color, secondary color intermediately related
    tertiaryColor: "#ffa400",
    onTertiaryColor: "#fff",

    soldOutColor: "#eb3434",

    // status bar color
    statusBarColor: "#fff",

    // gradient colors
    primaryGradientColor: "#00b970",
    secondaryGradinetColor: "#00b9a7",

    // overlay color
    overlayColor: "#b90039",

    // text color
    primaryText: "#010203",
    secondaryText: "#5d5d5d",
    disabledText: "rgba(0, 0, 0, 0.38)",

    // background, surface
    background: "#fff",
    onBackground: "#212121",
    surface: "#fff",
    onSurface: "#757575",
    error: "#cd040b",
    onError: "#fff",
    black: "#010203",
    white: "#fff"
  },
  redOrange: {
    // primary color
    primaryColor: "#e8500e",
    primaryColorDark: "#de4701",
    primaryColorLight: "#f35919",
    onPrimaryColor: "#fff",

    // accent color
    accentColor: "#0069b9",
    onAccentColor: "#fff",

    // secondary color
    secondaryColor: "blue", // '#239d19'
    onSecondaryColor: "#fff",

    // tertiary color, secondary color intermediately related
    tertiaryColor: "#66033c",
    onTertiaryColor: "#fff",

    // status bar color
    statusBarColor: "#fff",

    // gradient colors
    primaryGradientColor: "#e8500e",
    secondaryGradinetColor: "#e25822",

    // overlay color
    overlayColor: "#f35919",

    // text color
    primaryText: "#010203",
    secondaryText: "#5d5d5d",
    disabledText: "rgba(0, 0, 0, 0.38)",

    // background, surface
    background: "#fff",
    onBackground: "#212121",
    surface: "#fff",
    onSurface: "#757575",
    error: "#cd040b",
    onError: "#fff",
    black: "#010203",
    white: "#fff"
  },
  blueberry: {
    // primary color
    primaryColor: "#4f86f7",
    primaryColorDark: "#115bf4",
    primaryColorLight: "#9dbcfb",
    onPrimaryColor: "#fff",

    // accent color
    accentColor: "#01ad95",
    onAccentColor: "#fff",

    // secondary color, primary color split
    secondaryColor: "#83d076", // '#fac04c'
    onSecondaryColor: "#fff",

    // tertiary color, secondary color intermediately related
    tertiaryColor: "#de5246", // '#e0115f'
    onTertiaryColor: "#fff",

    // status bar color
    statusBarColor: "#eeeeee",

    // gradient colors
    primaryGradientColor: "#4f86f7",
    secondaryGradinetColor: "#47b8ff",

    // overlay color
    overlayColor: "#9dbcfb",

    // text color
    primaryText: "rgba(0, 0, 0, 0.87)",
    secondaryText: "rgba(0, 0, 0, 0.54)",
    disabledText: "rgba(0, 0, 0, 0.38)",

    // background, surface
    background: "#fff",
    onBackground: "#212121",
    surface: "#fff",
    onSurface: "#757575",
    error: "#cd040b",
    onError: "#fff",
    black: "#000",
    white: "#fff"
  },
  darkTheme: {
    // primary color
  //  primaryColor: "#4f86f7", //blue
    primaryColor: "rgb(0, 160, 227)",
    primaryColorDark: "#115bf4",
    primaryColorLight: "#9dbcfb",
    onPrimaryColor: "#fff",

    // accent color
    accentColor: "#01ad95", // -->turquize
    onAccentColor: "#fff",

    // secondary color, primary color split
    secondaryColor: "#83d076", // '#fac04c' --> light green
    onSecondaryColor: "#fff",

    // tertiary color, secondary color intermediately related
    tertiaryColor: "#e5625e", // '#e0115f' --> RED
    onTertiaryColor: "#fff",

    // status bar color
    statusBarColor: "#eeeeee", //--> blue

    // gradient colors
    primaryGradientColor: "#4f86f7",
    secondaryGradinetColor: "#47b8ff",

    // overlay color
    overlayColor: "#e5e059",// light yellow

    soldOutColor: "#eb3434",

    // text color
    primaryText: "rgba(0, 0, 0, 0.87)",
    secondaryText: "rgba(0, 0, 0, 0.54)",
    disabledText: "rgba(0, 0, 0, 0.38)",

    // background, surface
    background: "#fff",
    onBackground: "#212121",
    selection: "#ff8c42", // --> orange
    selectionNew: "#Ac7919",
    surface: "#fff", 
    onSurface: "#757575",
    error: "rgb(213, 33, 39)",
    onError: "#fff",
    black: "#000",
    white: "#fff",
    googleButton: "#e0210b",
    paid: "#A2C99B",
    completed: "#fe5f55", //--> red
    delivered: "rgb(50, 186, 50)", //--> green
    waiterDelivered: "#01baef", //--> blue,
    discount: "#ABA8B2", //-->French grey,

    keyboardButton: "rgb(67,66,66)",
    backspaceButton: "rgb(137, 137, 137)",
    itemBkgr: "rgb(235, 236, 236)",
    symbolBlack: "rgb(43, 42, 41)",
    greenButton: "rgb(0, 145, 75)",
    paginationDisabled: "rgb(157, 158, 158)",
    cashDisabled: "rgb(105, 199, 238)",
    tabIcon: "rgb(52, 81, 144)"

  }
};

const theme = themes[config.theme];

export default theme;
