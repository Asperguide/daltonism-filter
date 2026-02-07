/*
** EPITECH PROJECT, 2024
** daltonism-filter
** File description:
** script.js
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
// |- The id of the section that is draggable and the actionable menus
const daltonismDraggableMenu_name = "c-draggable-menu";

// |- The id containing the name of the filter
const daltonismFilterName_name = "c-filter";

// |- The id of the section where the buttons to change the filter are located
const daltonismFilterButtonsContainer_name = "c-button-container";

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

// Debug mode
const daltonismDebugLog = false;


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
        name: ".c-control-menu",
        content: `position: fixed;\nwidth:auto;\nmax-width: 425px;\nheight:auto;\nz-index: 1000;\npadding: 10px;\nbackground-color: rgba(255, 255, 255, 0.54);\nborder-radius: 5px;\nbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\ncursor: move;`
    },
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

// // class names
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

// ----------------------------- Functions for displaying the slider values ------------------------------
function daltonismUpdateTransparencySliderDisplayValue() {
    const data = document.getElementById(daltonismTransparencySlider_name).value;
    console.daltonismDebug("(daltonismUpdateTransparencySliderDisplayValue) value: ", data);
    document.getElementById(daltonismTransparencySliderValue_name).innerText = data;
}

function daltonismUpdateIntensitySliderDisplayValue() {
    const data = document.getElementById(daltonismIntensitySlider_name).value;
    console.daltonismDebug("(daltonismUpdateIntensitySliderDisplayValue) value: ", data);
    document.getElementById(daltonismIntensitySliderValue_name).innerText = data;
}

// ----------------------------- Functions for managing the filters ------------------------------
function daltonismApplyFilter(filterClass) {
    document.body.className = '';
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

// ----------------------------- Section to add the theme togglers ------------------------------
document.getElementById(`${daltonismNormalButton_name}`).addEventListener('click', function () {
    daltonismApplyFilter('normal');
});

document.getElementById(`${daltonismDeuteranopiaButton_name}`).addEventListener('click', function () {
    daltonismApplyFilter('deuteranopia');
});

document.getElementById(`${daltonismProtanopiaButton_name}`).addEventListener('click', function () {
    daltonismApplyFilter('protanopia');
});

document.getElementById(`${daltonismTritanopiaButton_name}`).addEventListener('click', function () {
    daltonismApplyFilter('tritanopia');
});

document.getElementById(`${daltonismMonochromacyButton_name}`).addEventListener('click', function () {
    daltonismApplyFilter('monochromacy');
});

// ----------------------------- Section to add a listener to the sliders ------------------------------
document.getElementById(daltonismTransparencySlider_name).addEventListener('input', daltonismUpdateFilter);

document.getElementById(daltonismIntensitySlider_name).addEventListener('input', daltonismUpdateFilter);

// Prevent dragging when interacting with sliders
document.getElementById(daltonismTransparencySlider_name).addEventListener('mousedown', (e) => e.stopPropagation());
document.getElementById(daltonismIntensitySlider_name).addEventListener('mousedown', (e) => e.stopPropagation());

// ----------------------------- Section in charge of initialising the desired theme on the page ------------------------------
function daltonismBootUP() {
    daltonismApplyFilter('normal');
    daltonismUpdateTransparencySliderDisplayValue();
    daltonismUpdateIntensitySliderDisplayValue();
}

document.addEventListener('DOMContentLoaded', daltonismBootUP);

// ----------------------------- Section in charge of making the menu draggable ------------------------------
// Value to track the dragging state and the offset of the mouse from the top left corner of the menu
let daltonismIsDragging = false;
let daltonismOffsetX, daltonismOffsetY;
const daltonismDraggable = document.getElementById(daltonismDraggableMenu_name) || document.querySelector(`.${daltonismDraggableMenu_name}`) || null; // Try to find the element by id first, then by class name

// functions to update the position of the menu based on the mouse movement and to stop the dragging when the mouse button is released
function daltonismInitiateDragging(event) {
    if (daltonismDraggable == null || !(daltonismDraggable instanceof HTMLElement) || daltonismDraggable == undefined) {
        console.daltonismDebug("(daltonismInitiateDragging) draggable element not found");
        return;
    }
    daltonismIsDragging = true;
    daltonismOffsetX = event.clientX - daltonismDraggable.offsetLeft;
    daltonismOffsetY = event.clientY - daltonismDraggable.offsetTop;
}

function daltonismUpdateDraggablePosition(event) {
    if (daltonismIsDragging) {
        daltonismDraggable.style.left = (event.clientX - daltonismOffsetX) + 'px';
        daltonismDraggable.style.top = (event.clientY - daltonismOffsetY) + 'px';
    }
}

function daltonismStopDragging() {
    daltonismIsDragging = false;
}

function daltonismSetDraggableMenuStyle(element) {
    // Set initial style
    element.style.gap = '5px';
    element.style.top = '10px';
    element.style.right = '10px';
    element.style.display = 'flex';
    element.style.flexWrap = 'wrap';
    element.style.position = 'absolute';
}

function daltonismMakeMenuDraggable() {
    if (daltonismDraggable == null || !(daltonismDraggable instanceof HTMLElement) || daltonismDraggable == undefined) {
        console.daltonismDebug("(daltonismMakeMenuDraggable) draggable element not found");
        return;
    }
    daltonismSetDraggableMenuStyle(daltonismDraggable);
    daltonismDraggable.addEventListener('mousedown', daltonismInitiateDragging);
    document.addEventListener('mousemove', daltonismUpdateDraggablePosition);
    document.addEventListener('mouseup', daltonismStopDragging);
}

document.addEventListener('DOMContentLoaded', daltonismMakeMenuDraggable);
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

// Example usage
function daltonismInjectCSSCode() {
    daltonismCSSClasses.forEach(({ name, content }) => {
        daltonismEnsureCSSComponentExists(name, content);
    });
}

document.addEventListener('DOMContentLoaded', daltonismInjectCSSCode);

// ----------------------------- Exporting the functions and variables to a daltonismFilter namespace ------------------------------

// The content here, is arranged by type and length, however, it might not appear the same way when you try to access it in the browser console.

const daltonismFilter = [
    daltonismFilters,
    daltonismOffsetX,
    daltonismOffsetY,
    daltonismDraggable,
    daltonismBaseMatrix,
    daltonismCSSClasses,
    daltonismClassNames,
    daltonismIsDragging,
    daltonismIdentityMatrix,
    daltonismSVGFileContent,
    daltonismFilterName_name,
    daltonismNormalButton_name,
    daltonismDraggableMenu_name,
    daltonismIntensitySlider_name,
    daltonismClassNameEquivalence,
    daltonismProtanopiaButton_name,
    daltonismTritanopiaButton_name,
    daltonismSVGArrayJoinCharacter,
    daltonismTransparencySlider_name,
    daltonismDeuteranopiaButton_name,
    daltonismMonochromacyButton_name,
    daltonismIntensitySliderValue_name,
    daltonismTransparencySliderValue_name,
    daltonismClassNameEquivalenceFlipped,
    daltonismBootUP,
    daltonismInjectSVG,
    daltonismApplyFilter,
    daltonismUpdateFilter,
    daltonismStopDragging,
    daltonismInjectCSSCode,
    daltonismInitiateDragging,
    daltonismFlipKeysAndValues,
    daltonismMakeMenuDraggable,
    daltonismApplyMatrixToFilter,
    daltonismUpdateFilterIntensity,
    daltonismSetDraggableMenuStyle,
    daltonismUpdateDraggablePosition,
    daltonismUpdateFilterTransparency,
    daltonismEnsureCSSComponentExists,
    daltonismReturnCorrectColourMatrixFilter,
    daltonismUpdateIntensitySliderDisplayValue,
    daltonismUpdateTransparencySliderDisplayValue
]



window.daltonismFilter = daltonismFilter;
document.daltonismFilter = daltonismFilter;

// ----------------------------- End of the code ------------------------------
