/*
** EPITECH PROJECT, 2024
** daltonism-filter
** File description:
** daltonism.js
*/

// ----------------------------- Introduction ------------------------------
// This code is a template for a daltonism filter that can be applied to a website.
// The code is divided into sections, each with a specific purpose.

// It is recommended to read the comments to understand the different sections of the code and how to update them.
// The order in which the functions and constants are defined in the code is important, so it is recommended to follow the order of the sections.

// This code works by using SVG filters to apply the daltonism filter to the website by settins class names to the body element.
// The code also includes sliders to adjust the intensity and transparency of the filters
// Although, as of current, the transparency filter is not working for the "normal" mode and the filter intensity will have no effect in the "normal" mode because it calculates a difference between the "normal" mode and the one selected by the user.

// As long as this javascript is included in the website, the functionalities should work without a hitch.

// For legibility reasons, the code is not minified, so it is easier to read and understand.

// For ease of access, the functions and variables can be called under window.daltonismFilter.

// For the moment, this code does not track the changes made to the filters, so if the page is reloaded, the filters will be reset to their default values, but you are free to call the daltonismApplyFilter(<filter_name>) to change it once it is loaded.
// Tips: Add a document.addEventListener('DOMContentLoaded', <your_function>); to call your function when the page is loaded.

// ----------------------------- Credits ------------------------------
// This code was written by (c) Henry Letellier

// If you have any problems or questions, please contact me on the GitHub repository where this code is hosted, there are templates that can be used to report issues or ask questions.

// ----------------------------- Constants references ------------------------------

// id tags to update
// |- The id containing the name of the filter
const daltonismFilterName_name = "c-filter";

// |- The id of the slider for the intensity html value
const daltonismIntensitySlider_name = "intensity-slider";

// |- The id of the section where the value of the slider is updated
const daltonismIntensitySliderValue_name = "intensity-value";

// |- The id of the slider for the transparency html value
const daltonismTransparencySlider_name = "transparency-slider";

// |- The id of the section where the value of the slider is updated
const daltonismTransparencySliderValue_name = "transparency-value";

// filter state buttons
// |- The id of the button to set the filter to normal
const daltonismNormalButton_name = "normal";
// |- The id of the button to set the filter to protanopia
const daltonismProtanopiaButton_name = "protanopia";
// |- The id of the button to set the filter to tritanopia
const daltonismTritanopiaButton_name = "tritanopia";
// |- The id of the button to set the filter to deuteranopia
const daltonismDeuteranopiaButton_name = "deuteranopia";
// |- The id of the button to set the filter to monochromacy
const daltonismMonochromacyButton_name = "monochromacy";

// settings class name (please set this class in your code to prevent the automatic injection of the settings window)
// P.S.: also create a css class of the same name in your css code to prevent the injection of this file's class
const daltonismSettingsClassName = "daltonism-settings";

// Debug mode
let daltonismDebugLog = false;

// Use local storage for remembering the user data
let daltonismUseLocalStorage = false;

// Local storage variable name for the filter choice
const daltonismLocalStorageName = "daltonism-filter-choice";

// Local storage variable name for the intensity
const daltonismIntensityLocalStorageName = "daltonism-intensity";

// Local storage variable name for the transparency
const daltonismTransparencyLocalStorageName = "daltonism-transparency";


const daltonismUseLocalStorageName = "daltonism-use-local-storage";


// ----------------------------- Base functions in charge of simplifying certain processes during the declaration of the constants ------------------------------

function daltonismFlipKeysAndValues(obj) {
    const flippedObject = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            flippedObject[value] = key;
        }
    }

    return flippedObject;
}

function daltonismReturnCorrectColourMatrixFilter(colour) {
    switch (colour) {
        case 'deuteranopia':
            return [
                [0.8, 0.2, 0, 0, 0],
                [0.258, 0.742, 0, 0, 0],
                [0, 0.142, 0.858, 0, 0],
                [0, 0, 0, 1, 0]
            ];
        case 'protanopia':
            return [
                [0.567, 0.433, 0, 0, 0],
                [0.558, 0.442, 0, 0, 0],
                [0, 0.242, 0.758, 0, 0],
                [0, 0, 0, 1, 0]
            ];
        case 'tritanopia':
            return [
                [1, 0, 0, 0, 0],
                [0, 0.9, 0.1, 0, 0],
                [0, 0.5, 0.5, 0, 0],
                [0, 0, 0, 1, 0]
            ];
        case 'monochromacy':
            return [
                [0.33, 0.33, 0.33, 0, 0],
                [0.33, 0.33, 0.33, 0, 0],
                [0.33, 0.33, 0.33, 0, 0],
                [0, 0, 0, 1, 0]
            ];
        case 'normal':
            return [
                [1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0]
            ];
        default:
            return null;
    }
}

// ----------------------------- Debugging functions ------------------------------
function daltonismLogDebug(...data) {
    const headerLogger = "[debug daltonism]";
    if (daltonismDebugLog) {
        console.debug(headerLogger, ...data);
    }
}

console.daltonismDebug = daltonismLogDebug;

// ----------------------------- Constants ------------------------------


// class names
const daltonismClassNameEquivalence = {
    normal: "daltonism-normal",
    deuteranopia: "daltonism-deuteranopia",
    protanopia: "daltonism-protanopia",
    tritanopia: "daltonism-tritanopia",
    monochromacy: "daltonism-monochromacy"
};

const daltonismClassNameEquivalenceFlipped = daltonismFlipKeysAndValues(daltonismClassNameEquivalence);

// filters
const daltonismFilters = Object.keys(daltonismClassNameEquivalence).reduce((acc, key) => {
    const response = daltonismReturnCorrectColourMatrixFilter(key);
    if (!response) {
        return acc;
    }
    acc[daltonismClassNameEquivalence[key]] = response;
    return acc;
}, {});

console.daltonismDebug("daltonismFilters: ", daltonismFilters);
console.daltonismDebug("daltonismClassNameEquivalence: ", daltonismClassNameEquivalence);

// svg class related definitions
const daltonismSVGArrayJoinCharacter = " ";

/* BEGIN DEBUG CHUNK , uncomment to see the values */
// console.daltonismDebug("normal equivalence", daltonismClassNameEquivalence["normal"]);
// console.daltonismDebug("deuteranopia equivalence", daltonismClassNameEquivalence["deuteranopia"]);
// console.daltonismDebug("protanopia equivalence", daltonismClassNameEquivalence["protanopia"]);
// console.daltonismDebug("tritanopia equivalence", daltonismClassNameEquivalence["tritanopia"]);
// console.daltonismDebug("monochromacy equivalence", daltonismClassNameEquivalence["monochromacy"]);

// console.daltonismDebug("deuteranopia", daltonismFilters[daltonismClassNameEquivalence["deuteranopia"]]);
// console.daltonismDebug("protanopia", daltonismFilters[daltonismClassNameEquivalence["protanopia"]]);
// console.daltonismDebug("tritanopia", daltonismFilters[daltonismClassNameEquivalence["tritanopia"]]);
// console.daltonismDebug("monochromacy", daltonismFilters[daltonismClassNameEquivalence["monochromacy"]]);
// console.daltonismDebug("normal", daltonismFilters[daltonismClassNameEquivalence["normal"]]);
/* END DEBUG CHUNK */

const daltonismSVGFileContent = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="true">
    <filter id="${daltonismClassNameEquivalence["deuteranopia"]}-filter">
        <feColorMatrix
            type="matrix"
            values="${(daltonismFilters[daltonismClassNameEquivalence["deuteranopia"]].flat()).join(daltonismSVGArrayJoinCharacter)}" />
    </filter>
    <filter id="${daltonismClassNameEquivalence["protanopia"]}-filter">
        <feColorMatrix
            type="matrix"
            values="${(daltonismFilters[daltonismClassNameEquivalence["protanopia"]].flat()).join(daltonismSVGArrayJoinCharacter)}" />
    </filter>
    <filter id="${daltonismClassNameEquivalence["tritanopia"]}-filter">
        <feColorMatrix
            type="matrix"
            values="${(daltonismFilters[daltonismClassNameEquivalence["tritanopia"]].flat()).join(daltonismSVGArrayJoinCharacter)}" />
    </filter>
    <filter id="${daltonismClassNameEquivalence["monochromacy"]}-filter">
        <feColorMatrix
            type="matrix"
            values="${(daltonismFilters[daltonismClassNameEquivalence["monochromacy"]].flat()).join(daltonismSVGArrayJoinCharacter)}" />
    </filter>
    <filter id="${daltonismClassNameEquivalence["normal"]}-filter">
        <feColorMatrix
            type="matrix"
            values="${(daltonismFilters[daltonismClassNameEquivalence["normal"]].flat()).join(daltonismSVGArrayJoinCharacter)}" />
    </filter>
</svg>
`;

// css class related definitions

const daltonismCSSClasses = [
    {
        name: ".daltonism-svg",
        content: `position: absolute;\nwidth: 0;\nheight: 0;\noverflow: hidden;`
    },
    {
        name: ":root",
        content: `--daltonism-view-mode-deuteranopia: url(#${daltonismClassNameEquivalence["deuteranopia"]}-filter);\n--daltonism-view-mode-protanopia: url(#${daltonismClassNameEquivalence["protanopia"]}-filter);\n--daltonism-view-mode-tritanopia: url(#${daltonismClassNameEquivalence["tritanopia"]}-filter);\n--daltonism-view-mode-monochromacy: url(#${daltonismClassNameEquivalence["monochromacy"]}-filter);\n--daltonism-view-mode-normal: url(#${daltonismClassNameEquivalence["normal"]}-filter);`
    },
    {
        name: `.${daltonismClassNameEquivalence["normal"]}`,
        content: `-webkit-filter: var(--daltonism-view-mode-normal);\n-moz-filter: var(--daltonism-view-mode-normal);\n-ms-filter: var(--daltonism-view-mode-normal);\n-o-filter: var(--daltonism-view-mode-normal);\nfilter: var(--daltonism-view-mode-normal);`
    },
    {
        name: `.${daltonismClassNameEquivalence["deuteranopia"]}`,
        content: `-webkit-filter: var(--daltonism-view-mode-deuteranopia);\n-moz-filter: var(--daltonism-view-mode-deuteranopia);\n-ms-filter: var(--daltonism-view-mode-deuteranopia);\n-o-filter: var(--daltonism-view-mode-deuteranopia);\nfilter: var(--daltonism-view-mode-deuteranopia);`
    },
    {
        name: `.${daltonismClassNameEquivalence["protanopia"]}`,
        content: `-webkit-filter: var(--daltonism-view-mode-protanopia);\n-moz-filter: var(--daltonism-view-mode-protanopia);\n-ms-filter: var(--daltonism-view-mode-protanopia);\n-o-filter: var(--daltonism-view-mode-protanopia);\nfilter: var(--daltonism-view-mode-protanopia);`
    },
    {
        name: `.${daltonismClassNameEquivalence["tritanopia"]}`,
        content: `-webkit-filter: var(--daltonism-view-mode-tritanopia);\n-moz-filter: var(--daltonism-view-mode-tritanopia);\n-ms-filter: var(--daltonism-view-mode-tritanopia);\n-o-filter: var(--daltonism-view-mode-tritanopia);\nfilter: var(--daltonism-view-mode-tritanopia);`
    },
    {
        name: `.${daltonismClassNameEquivalence["monochromacy"]}`,
        content: `-webkit-filter: var(--daltonism-view-mode-monochromacy);\n-moz-filter: var(--daltonism-view-mode-monochromacy);\n-ms-filter: var(--daltonism-view-mode-monochromacy);\n-o-filter: var(--daltonism-view-mode-monochromacy);\nfilter: var(--daltonism-view-mode-monochromacy);`
    }
];

// Control settings sections
const settingsWidget = `
    <h2>Daltonism Settings</h2>
    <p>Current filter in use: <span id="${daltonismFilterName_name}">None</span></p>
    <button id="${daltonismNormalButton_name}">Normal</button>
    <button id="${daltonismProtanopiaButton_name}">Protanopia</button>
    <button id="${daltonismTritanopiaButton_name}">Tritanopia</button>
    <button id="${daltonismDeuteranopiaButton_name}">Deuteranopia</button>
    <button id="${daltonismMonochromacyButton_name}">Monochromacy</button>
    <br>
    <aside>
        <label for="intensity">Filter Intensity: </label>
        <input type="range" id="${daltonismIntensitySlider_name}" name="intensity" min="0" max="100" value="100">
        <span id="${daltonismIntensitySliderValue_name}">...</span>
    </aside>
    <br>
    <aside>
        <label for="transparency">Filter Transparency: </label>
        <input type="range" id="${daltonismTransparencySlider_name}" name="transparency" min="20" max="100" value="100">
        <span id="${daltonismTransparencySliderValue_name}">...</span>
    </aside>
`;

// The css classes for the settings window
const settingsWidgetCss = [
    {
        name: `.${daltonismSettingsClassName}`,
        content: `position: fixed;\nright: 0;\ntop: 0;\nbackground-color: white;\npadding: 1rem;\nz-index: 1000;\nborder: 1px solid black;`
    },
    {
        name: `.${daltonismSettingsClassName} h2`,
        content: `margin-top: 0;`
    },
    {
        name: `.${daltonismSettingsClassName} button`,
        content: `margin: 0.5rem 0;`
    },
    {
        name: `.${daltonismSettingsClassName} aside`,
        content: `margin: 1rem 0;`
    },
    {
        name: `.${daltonismSettingsClassName} input`,
        content: `margin-left: 0.5rem;`
    }
];

// class names
const daltonismClassNames = Object.keys(daltonismFilters);

// matrix for the transparency
const daltonismIdentityMatrix = [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0]
];

// current status of the matrix in use
let daltonismBaseMatrix = null;

// ----------------------------- Functions to manage the local storage for persistency -------------

function daltonismCheckLocalStorage(key) {
    const useLocalStorage = localStorage.getItem(daltonismUseLocalStorageName);
    if (useLocalStorage == null) {
        localStorage.setItem(daltonismUseLocalStorageName, `${daltonismUseLocalStorage}`);
    } else {
        daltonismUseLocalStorage = useLocalStorage === 'true';
    }
    if (!daltonismUseLocalStorage) {
        return null;
    }
    const choice = localStorage.getItem(key);
    if (choice) {
        return choice;
    }
    return null;
}

function daltonismSetLocalStorage(key, choice) {
    if (!daltonismUseLocalStorage) {
        return;
    }
    localStorage.setItem(key, choice);
}

// ----------------------------- Functions to make sure the id's are present ------------------------------

async function daltonismEnsureElementExists(elementId, maxRetries = 200, delay = 100) {
    let retries = 0;

    while (retries < maxRetries) {
        const element = document.getElementById(elementId);
        if (element) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
    }

    return false;
}

// ----------------------------- Functions for displaying the slider values ------------------------------
function daltonismUpdateTransparencySliderDisplayValue() {
    const data = document.getElementById(daltonismTransparencySlider_name).value;
    daltonismSetLocalStorage(daltonismTransparencyLocalStorageName, data);
    console.daltonismDebug("(daltonismUpdateTransparencySliderDisplayValue) value: ", data);
    document.getElementById(daltonismTransparencySliderValue_name).innerText = data;
}

function daltonismUpdateIntensitySliderDisplayValue() {
    const data = document.getElementById(daltonismIntensitySlider_name).value;
    daltonismSetLocalStorage(daltonismIntensityLocalStorageName, data);
    console.daltonismDebug("(daltonismUpdateIntensitySliderDisplayValue) value: ", data);
    document.getElementById(daltonismIntensitySliderValue_name).innerText = data;
}

// ----------------------------- Functions for managing the filters ------------------------------
function daltonismApplyFilter(filterClass) {
    document.body.className = '';
    daltonismSetLocalStorage(daltonismLocalStorageName, filterClass);
    console.daltonismDebug("(daltonismApplyFilter) filterClass: ", filterClass);
    const currentFilter = daltonismClassNameEquivalence[`${filterClass}`];
    console.daltonismDebug("(daltonismApplyFilter) currentFilter: ", currentFilter);
    document.getElementById(daltonismFilterName_name).innerText = filterClass;
    document.body.classList.add(`${currentFilter}`);
    const chosenMatrix = daltonismFilters[`${currentFilter}`];
    console.daltonismDebug("(daltonismApplyFilter) chosenMatrix: ", chosenMatrix);
    daltonismBaseMatrix = chosenMatrix;
    daltonismUpdateFilter();
}

function daltonismApplyMatrixToFilter(matrix) {
    const currentFilter = document.getElementById(daltonismFilterName_name).innerText;
    console.daltonismDebug("(daltonismApplyMatrixToFilter) currentFilter: ", currentFilter);
    const currentFilterEquivalent = daltonismClassNameEquivalence[`${currentFilter}`];
    console.daltonismDebug("(daltonismApplyMatrixToFilter) currentFilterEquivalent: ", currentFilterEquivalent);
    const filterElement = document.querySelector(`#${currentFilterEquivalent}-filter feColorMatrix`);
    if (filterElement) {
        console.daltonismDebug("(daltonismApplyMatrixToFilter) filterElement: ", filterElement);
        console.daltonismDebug("(daltonismApplyMatrixToFilter) matrix: ", matrix);
        filterElement.setAttribute('values', matrix.flat().join(' '));
    }
}

function daltonismUpdateFilterTransparency() {
    daltonismUpdateTransparencySliderDisplayValue();
    console.daltonismDebug("(daltonismUpdateFilterTransparency) daltonismUpdateFilterTransparency called");
    const transparency = document.getElementById(daltonismTransparencySlider_name).value / 100;
    if (daltonismBaseMatrix) {
        console.daltonismDebug("(daltonismUpdateFilterTransparency) intensity: ", intensity);
        const transparentMatrix = daltonismBaseMatrix.map(row =>
            row.map(val => val * transparency)
        );
        console.daltonismDebug("(daltonismUpdateFilterTransparency) transparentMatrix: ", transparentMatrix);
        daltonismApplyMatrixToFilter(transparentMatrix);
    }
}

function daltonismUpdateFilterIntensity() {
    daltonismUpdateIntensitySliderDisplayValue();
    console.daltonismDebug("(daltonismUpdateFilterIntensity) daltonismUpdateFilterIntensity called");
    const intensity = document.getElementById(daltonismIntensitySlider_name).value / 100;
    if (daltonismBaseMatrix) {
        console.daltonismDebug("(daltonismUpdateFilterIntensity) intensity: ", intensity);
        const intenseMatrix = daltonismBaseMatrix.map((row, i) =>
            row.map((val, j) => val * intensity + daltonismIdentityMatrix[i][j] * (1 - intensity))
        );
        console.daltonismDebug("(daltonismUpdateFilterIntensity) intenseMatrix: ", intenseMatrix);
        daltonismBaseMatrix = intenseMatrix;
        daltonismApplyMatrixToFilter(intenseMatrix);
    }
}

function daltonismUpdateFilter() {
    console.daltonismDebug("(daltonismUpdateFilter) daltonismUpdateFilter called");
    daltonismUpdateTransparencySliderDisplayValue();
    daltonismUpdateIntensitySliderDisplayValue();
    const intensity = document.getElementById(daltonismIntensitySlider_name).value / 100;
    const transparency = document.getElementById(daltonismTransparencySlider_name).value / 100;

    console.daltonismDebug('(daltonismUpdateFilter) intensity: ', intensity);
    console.daltonismDebug('(daltonismUpdateFilter) transparency: ', transparency);

    let currentMatrix = daltonismBaseMatrix ? daltonismBaseMatrix : daltonismIdentityMatrix;

    console.daltonismDebug('(daltonismUpdateFilter) currentMatrix: ', currentMatrix);

    // Apply intensity adjustment
    const intenseMatrix = currentMatrix.map((row, i) =>
        row.map((val, j) => val * intensity + daltonismIdentityMatrix[i][j] * (1 - intensity))
    );
    console.daltonismDebug('(daltonismUpdateFilter) intenseMatrix: ', intenseMatrix);

    // Apply transparency adjustment
    const finalMatrix = intenseMatrix.map(row =>
        row.map(val => val * transparency)
    );
    console.daltonismDebug('(daltonismUpdateFilter) finalMatrix: ', finalMatrix);

    daltonismApplyMatrixToFilter(finalMatrix);
}

// ----------------------------- Inject the css file into the html page ------------------------------

function daltonismEnsureCSSComponentExists(componentName, styles, identifier = 'daltonism-styles') {
    // Check if a style element with the identifier exists
    let styleElement = document.querySelector(`style[data-identifier="${identifier}"]`);
    console.daltonismDebug(`(daltonismEnsureCSSComponentExists) styleElement: `, styleElement);

    if (!styleElement) {
        // Create a new style element if it doesn't exist
        styleElement = document.createElement('style');
        styleElement.setAttribute('data-identifier', identifier);
        document.head.appendChild(styleElement);
        console.daltonismDebug(`CSS component with identifier "${identifier}" created.`);
    } else {
        console.daltonismDebug(`CSS component with identifier "${identifier}" already exists.`);
    }

    // Check if the class already exists in the style element
    const classExists = styleElement.innerHTML.includes(`${componentName} {`);
    console.daltonismDebug(`(daltonismEnsureCSSComponentExists) classExists: `, classExists);

    if (!classExists) {
        // Append the new class to the existing style element
        styleElement.innerHTML += `\n${componentName} {\n ${styles}\n }`;
        console.daltonismDebug(`CSS class "${componentName}" added to the existing style component.`);
    } else {
        console.daltonismDebug(`CSS class "${componentName}" already exists in the style component.`);
    }
}

// ----------------------------- Check if a css class is defined and not empty ------------------------------

function daltonismClassExistsAndHasElements(className) {
    // Check if any elements have this class
    const elements = document.getElementsByClassName(className);

    // If elements with this class exist, then the class exists and is in use
    if (elements.length > 0) {
        return {
            exists: true,
            hasElements: true
        };
    }

    // If no elements have this class, check if the class is defined in stylesheets
    const styleSheets = document.styleSheets;

    for (let i = 0; i < styleSheets.length; i++) {
        let styleSheet = styleSheets[i];

        try {
            const cssRules = styleSheet.cssRules || styleSheet.rules;

            for (let j = 0; j < cssRules.length; j++) {
                if (cssRules[j].selectorText && cssRules[j].selectorText.includes('.' + className)) {
                    return {
                        exists: true,
                        hasElements: false
                    };
                }
            }
        } catch (e) {
            // Skip inaccessible stylesheets
            continue;
        }
    }

    // If we get here, the class doesn't exist or isn't used
    return {
        exists: false,
        hasElements: false
    };
}

// ----------------------------- Allow an html element to be dragable ------------------------------

// Get the draggable div element
const draggableDiv = document.getElementById('draggable-div');

// Initialize variables to store the offset of the mouse pointer relative to the div
let offsetX, offsetY;

// Function to handle the mousedown event
function daltonismDragStart(e) {
    // Calculate the offset of the mouse pointer relative to the div
    offsetX = e.clientX - draggableDiv.offsetLeft;
    offsetY = e.clientY - draggableDiv.offsetTop;

    // Add event listeners for mousemove and mouseup events
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

// Function to handle the mousemove event
function daltonismDragMove(e) {
    // Move the div to the new position based on the mouse pointer's position
    draggableDiv.style.left = e.clientX - offsetX + 'px';
    draggableDiv.style.top = e.clientY - offsetY + 'px';
}

// Function to handle the mouseup event
function daltonismDragEnd() {
    // Remove the event listeners for mousemove and mouseup events
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
}

// Add the mousedown event listener to the draggable div
draggableDiv.addEventListener('mousedown', dragStart);

// ----------------------------- Inject the controls if not already present ------------------------------

function daltonismInjectControls() {
    if (document.querySelector(`.${daltonismSettingsClassName}`)) {
        console.daltonismDebug(`(daltonismInjectControls) Controls already exist.`);
        return;
    }
    const settings = document.createElement('section');
    settings.innerHTML = settingsWidget;
    settings.classList.add(`${daltonismSettingsClassName}`);
    document.body.prepend(settings);
    console.daltonismDebug(`(daltonismInjectControls) Controls injected.`);
}

document.addEventListener('DOMContentLoaded', daltonismInjectControls);

// ----------------------------- Inject the css design for the settings window ------------------------------

function daltonismInjectCSSSettingsDesign() {
    if (document)
        settingsWidgetCss.forEach(({ name, content }) => {
            if (daltonismClassExistsAndHasElements(name).hasElements) {
                console.daltonismDebug(`(daltonismInjectCSSSettingsDesign) Class "${name}" already exists and has elements.`);
                return;
            }
            daltonismEnsureCSSComponentExists(name, content);
        });
}

document.addEventListener('DOMContentLoaded', daltonismInjectCSSSettingsDesign);

// ----------------------------- Inject the svg file into the html page ------------------------------

function daltonismInjectSVG() {
    const svg_container = document.createElement('div');
    console.daltonismDebug("(daltonismInjectSVG) svg_container: ", svg_container);
    svg_container.innerHTML = daltonismSVGFileContent;
    svg_container.classList.add("daltonism-svg");
    document.body.appendChild(svg_container);
}

document.addEventListener('DOMContentLoaded', daltonismInjectSVG);

// ----------------------------- Inject the css file into the html page ------------------------------
function daltonismInjectCSSCode() {
    daltonismCSSClasses.forEach(({ name, content }) => {
        daltonismEnsureCSSComponentExists(name, content);
    });
}

document.addEventListener('DOMContentLoaded', daltonismInjectCSSCode);

// ----------------------------- Section to add the theme togglers ------------------------------
async function daltonismInjectButtonControls() {
    console.daltonismDebug("(inject_button_controls) inject_button_controls called");

    const normalButton = await daltonismEnsureElementExists(daltonismNormalButton_name);
    const deuteranopiaButton = await daltonismEnsureElementExists(daltonismDeuteranopiaButton_name);
    const protanopiaButton = await daltonismEnsureElementExists(daltonismProtanopiaButton_name);
    const tritanopiaButton = await daltonismEnsureElementExists(daltonismTritanopiaButton_name);
    const monochromacyButton = await daltonismEnsureElementExists(daltonismMonochromacyButton_name);

    if (normalButton) {
        document.getElementById(`${daltonismNormalButton_name}`).addEventListener('click', function () {
            daltonismApplyFilter('normal');
        });
    } else {
        console.error(`Element with id "${daltonismNormalButton_name}" not found.`);
    }

    if (deuteranopiaButton) {
        document.getElementById(`${daltonismDeuteranopiaButton_name}`).addEventListener('click', function () {
            daltonismApplyFilter('deuteranopia');
        });
    } else {
        console.error(`Element with id "${daltonismDeuteranopiaButton_name}" not found.`);
    }

    if (protanopiaButton) {
        document.getElementById(`${daltonismProtanopiaButton_name}`).addEventListener('click', function () {
            daltonismApplyFilter('protanopia');
        });
    } else {
        console.error(`Element with id "${daltonismProtanopiaButton_name}" not found.`);
    }

    if (tritanopiaButton) {
        document.getElementById(`${daltonismTritanopiaButton_name}`).addEventListener('click', function () {
            daltonismApplyFilter('tritanopia');
        });
    } else {
        console.error(`Element with id "${daltonismTritanopiaButton_name}" not found.`);
    }

    if (monochromacyButton) {
        document.getElementById(`${daltonismMonochromacyButton_name}`).addEventListener('click', function () {
            daltonismApplyFilter('monochromacy');
        });
    } else {
        console.error(`Element with id "${daltonismMonochromacyButton_name}" not found.`);
    }

    console.daltonismDebug("(inject_button_controls) inject_button_controls finished");
};

document.addEventListener('DOMContentLoaded', daltonismInjectButtonControls);

// ----------------------------- Section to add a listener to the sliders ------------------------------
async function daltonismInjectSliderControls() {
    console.daltonismDebug("(inject_slider_controls) inject_slider_controls called");

    const intensitySlider = await daltonismEnsureElementExists(daltonismIntensitySlider_name);
    const transparencySlider = await daltonismEnsureElementExists(daltonismTransparencySlider_name);

    if (intensitySlider) {
        document.getElementById(daltonismTransparencySlider_name).addEventListener('input', daltonismUpdateFilter);
    } else {
        console.error(`Element with id "${daltonismTransparencySlider_name}" not found.`);
    }

    if (transparencySlider) {
        document.getElementById(daltonismIntensitySlider_name).addEventListener('input', daltonismUpdateFilter);
    } else {
        console.error(`Element with id "${daltonismIntensitySlider_name}" not found.`);
    }
}

document.addEventListener('DOMContentLoaded', injectSliderControls);

// ----------------------------- Section to add a draggability option to the window of the filter settings ------------------------------

async function daltonismInjectDragability() {

    const settingsWindow = await daltonismEnsureElementExists(daltonismIntensitySlider_name);
}

document.addEventListener('DOMContentLoaded', daltonismInjectDragability);

// ----------------------------- Section in charge of initialising the desired theme on the page ------------------------------
function daltonismBootUP() {
    const response = daltonismCheckLocalStorage(daltonismLocalStorageName);
    if (response) {
        daltonismApplyFilter(response);
    } else {
        daltonismApplyFilter("normal");
    }
    const intensity = daltonismCheckLocalStorage(daltonismIntensityLocalStorageName);
    const transparency = daltonismCheckLocalStorage(daltonismTransparencyLocalStorageName);
    document.getElementById(daltonismIntensitySlider_name).value = intensity ? intensity : 100;
    document.getElementById(daltonismTransparencySlider_name).value = transparency ? transparency : 100;
    daltonismUpdateTransparencySliderDisplayValue();
    daltonismUpdateIntensitySliderDisplayValue();
}

document.addEventListener('DOMContentLoaded', daltonismBootUP);

// ----------------------------- Exporting the functions and variables to a daltonismFilter namespace ------------------------------

// The content here, is arranged by type and length, however, it might not appear the same way when you try to access it in the browser console.

const daltonismFilterContent = {
    /* editable variables */
    daltonismDebugLog,
    daltonismBaseMatrix,
    daltonismUseLocalStorage,
    /* constants */
    settingsWidget,
    daltonismFilters,
    settingsWidgetCss,
    daltonismClassNames,
    daltonismCSSClasses,
    daltonismIdentityMatrix,
    daltonismSVGFileContent,
    daltonismFilterName_name,
    daltonismLocalStorageName,
    daltonismNormalButton_name,
    daltonismSettingsClassName,
    daltonismUseLocalStorageName,
    daltonismClassNameEquivalence,
    daltonismIntensitySlider_name,
    daltonismProtanopiaButton_name,
    daltonismTritanopiaButton_name,
    daltonismSVGArrayJoinCharacter,
    daltonismDeuteranopiaButton_name,
    daltonismMonochromacyButton_name,
    daltonismTransparencySlider_name,
    daltonismIntensitySliderValue_name,
    daltonismIntensityLocalStorageName,
    daltonismTransparencySliderValue_name,
    daltonismTransparencyLocalStorageName,
    daltonismClassNameEquivalenceFlipped,
    /* functions */
    daltonismBootUP,
    daltonismLogDebug,
    daltonismInjectSVG,
    daltonismApplyFilter,
    daltonismUpdateFilter,
    daltonismInjectCSSCode,
    daltonismInjectControls,
    daltonismSetLocalStorage,
    daltonismFlipKeysAndValues,
    daltonismCheckLocalStorage,
    daltonismEnsureElementExists,
    daltonismApplyMatrixToFilter,
    daltonismUpdateFilterIntensity,
    daltonismInjectCSSSettingsDesign,
    daltonismUpdateFilterTransparency,
    daltonismEnsureCSSComponentExists,
    daltonismClassExistsAndHasElements,
    daltonismReturnCorrectColourMatrixFilter,
    daltonismUpdateIntensitySliderDisplayValue,
    daltonismUpdateTransparencySliderDisplayValue,
    /* asynchronous functions */
    daltonismInjectDragability,
    daltonismInjectButtonControls,
    daltonismInjectSliderControls,
};

window.daltonismFilter = daltonismFilterContent;
document.daltonismFilter = daltonismFilterContent;

// ----------------------------- End of the code ------------------------------
