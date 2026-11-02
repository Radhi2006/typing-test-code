export interface EditorTheme {
  id: string;
  name: string;
  colors: {
    // Editor
    editorBg: string;
    editorFg: string;
    lineHighlight: string;
    selection: string;
    cursor: string;
    // Gutter
    gutterBg: string;
    gutterFg: string;
    gutterActiveFg: string;
    // UI Chrome
    titleBarBg: string;
    titleBarFg: string;
    activityBarBg: string;
    activityBarFg: string;
    activityBarActiveFg: string;
    activityBarBorder: string;
    sidebarBg: string;
    sidebarFg: string;
    sidebarBorder: string;
    statusBarBg: string;
    statusBarFg: string;
    tabBarBg: string;
    tabActiveBg: string;
    tabActiveFg: string;
    tabInactiveFg: string;
    tabBorder: string;
    // Syntax Colors
    keyword: string;
    string: string;
    number: string;
    comment: string;
    function: string;
    variable: string;
    type: string;
    operator: string;
    punctuation: string;
    tag: string;
    attribute: string;
    property: string;
    className: string;
    regexp: string;
    // Typing States
    correct: string;
    incorrect: string;
    incorrectBg: string;
    pending: string;
    pendingBg: string;
    // Minimap
    minimapBg: string;
    minimapSlider: string;
    // Scrollbar
    scrollbarBg: string;
    scrollbarThumb: string;
    // Misc
    border: string;
    focusBorder: string;
    badgeBg: string;
    badgeFg: string;
    buttonBg: string;
    buttonFg: string;
    buttonHoverBg: string;
    inputBg: string;
    inputFg: string;
    inputBorder: string;
    dropdownBg: string;
    dropdownFg: string;
    tooltipBg: string;
    tooltipFg: string;
  };
}

