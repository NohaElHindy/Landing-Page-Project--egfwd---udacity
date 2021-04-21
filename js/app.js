/*** Define Global Variables**/

// created a list of all sections to use it in different functions
let sectionList = document.querySelectorAll('section');
// used it to drop all 'li' in the 'ul' using a specified id 'navbar__list'
let navbarList = document.getElementById('navbar__list');
// created to loop over navbar-anchors, to add/remove active-style to section when near top of viewport
let menuLinks = document.getElementsByClassName('menu__link');
// declared here, but initialize in the scroll function
// to detect the section.id
// to use it as an argument to add active-style
let viewedSectionId;

/*** End Global Variables**/



/*** Start Helper Functions**/

//////////////////// build the nav////////////////////

function navbarSections() {
    // used createDocumentFragment() to avoid reflow
    const sectionListFragment = document.createDocumentFragment();
    // looping over every section
    sectionList.forEach(function (section) {
        // to collect all 'li'
        let firstLevel = document.createElement("li");
        // to collect all 'a'
        let secondLevel = document.createElement("a");
        // add menu__link style to the classes of <a>
        // in this specific case, it is the only class
        secondLevel.classList.add("menu__link");
        // used the value of data-nav in every section
        // to fulfill the text that will appear on navBar
        secondLevel.textContent = section.attributes.getNamedItem("data-nav").value;
        // used the value of each section.id
        // to fulfill the value of data-link attribute in <a>
        secondLevel.setAttribute("data-link", section.attributes.getNamedItem("id").value);
        // drop each anchor element, in a 'li'
        firstLevel.appendChild(secondLevel);
        // drop each 'li' in documentFragment
        sectionListFragment.appendChild(firstLevel);
    });
    // drop documentFragment in the navbar at once
    navbarList.appendChild(sectionListFragment);
};

////////////////////  Scroll to anchor ID using scrollTO event ////////////////////

// used to detect the top of each section
// to view it on screen if we clicked on it's related navbarAnchor
// used a function, so I can use it to get whatever which navbarAnchor I clicked
function getElementOffsets(element) {
    // the only step I need to do, is to use getBoundingClientRect()
    // so I can use it's prop later
    const elementPossition = element.getBoundingClientRect();
    // needed the store the function's returned value to use it
    // in this case, the topRect is the only needed Rect
    return {
        // added the scroll y-coord to assure a better view of the target section 
        top: elementPossition.top + window.scrollY,
    };
};

///////////////  Add class 'active' to section when near top of viewport ///////////////

// used to remove all active-styles from all sections & all anchors, while scrolling
function removeScrollStyles() {
    // looping over each section
    for (section of sectionList) {
        // removing the 'your-active-class' style from the class attribute
        section.classList.remove('your-active-class');
    };
    // looping over each anchor
    for (menuLink of menuLinks) {
        // removing the 'menu__link__hover' style from the class attribute
        menuLink.classList.remove('menu__link__hover');
    };
};
// used to add active-style
// only on the nearest to viewport section, while scrolling
// passing section.id as an argument,
// to make sure that it is the only section applying the changes on
function addActiveStyle(id) {
    // passing the id that will be given later
    // to use it to collect the element that is using that id
    // to add the active-style to it's class list
    document.getElementById(id).classList.add('your-active-class');
};

// used to add active-style
// only on the anchor related to the nearest-to-viewportsection, while scrolling
// passing the content of data-link as an argument
// to make sure that it is the only anchors applying the changes on
function addHover(id) {
    // looping over anchors
    for (menuLink of menuLinks) {
        // comparing the content of data-link with section.id
        // to collect the element that is using that id value
        // Note: while building navbar, I gave data-link the same value of section.id
        if (menuLink.attributes.getNamedItem("data-link").value === id) {
            // to add the active-style to it's class list
            // I created this style, gave it the same specification as anchor:hover
            // to make it clear, which anchor is related to the currently-viewed section
            menuLink.classList.add('menu__link__hover');
        };
    };
};
/*** End Helper Functions**/



/*** Begin Main Functions**/

//////////////////// build the nav////////////////////

// called the navbarSections function to draw the navbarList with all anchor's details
navbarSections();


///////////////  Add class 'active' to section when near top of viewport ///////////////

// used a scroll eventListener, to be updated automatically while scrolling
// needed to specify the current position of the scroll bar,
// then, looping over sections,
// to compare the scroll bar position with each section's offset,
// using the top of the section as a start point,
// and its height, to determine the full element size,
// by looping and comparing, now we know the currently-viewed section,
// get its id,
// then, remove all styles from the all document,
// then specify the related anchor & section element, using the section.id, to add active-style to them
// Note: I used (- 300) just to havea  better comparing dimensions
window.addEventListener('scroll', function () {
    //specifing the scroll bar position
    let scrollBarPosition = document.documentElement.scrollTop;
    // looping over section
    for (section of sectionList) {
        // compare the scroll bar position with each section's top, height-offsets
        // Note: I used (- 300) just to havea  better comparing dimensions with screen view
        if (scrollBarPosition >= section.offsetTop - 300 &&
            scrollBarPosition < section.offsetTop + section.offsetHeight - 380) {
            // get the value of section id
            viewedSectionId = section.attributes.id.value;
            // removing all styles from the all document,
            removeScrollStyles();
            // add active-style to related section element
            addActiveStyle(viewedSectionId);
            // add active-style to related anchor
            addHover(viewedSectionId);
        };
    };
});


////////////////////  Scroll to anchor ID using scrollTO event ////////////////////

// first, added an click-eventListener on each navbar anchor
// ev-parameter allowed me to get to the MouseEvent function
// from the MouseEvent function, got the path property
// path-prop, provided a full punch of DOM-tree ascending from my clicked element
// path-prop: [a.menu__link.menu__link__hover, li, ul#navbar__list, nav.navbar__menu, header.page__header, body, html, document, Window]
// used it to get to the 'li' element, that contains the clicked anchor
// this 'li', is the second item in the path-prop array => (arr[1])
// then, got the <a>, and the value of the data-link attribute
// which equals the section.id
// so used querySelector to target this specified #id
// then, used the scrollTO event to get to that targeted-section, using the getElementOffsets function
// specifing the top-prop and the scroll behavior,
// became able to get to the target section by clicking on its related anchor
navbarList.addEventListener('click', function (ev) {
    // Now, from the begining :)
    // first, used ev to got to the path "composedPath()"
    // pointed directly to its second place "[1]"
    let getLiTag = ev.composedPath()[1];
    // selected its first <a> element
    let getAnchorTag = getLiTag.querySelector('a');
    // aimed the value of its data-link attribute
    // to get its value
    // Note : this value, I got it form section.id in the first place, while drawing navbar
    let getDataLink = getAnchorTag.attributes.getNamedItem("data-link").value;
    // used the value of the data-link as an #id
    // used querySelector to get to #id
    let targetSection = document.querySelector("#" + getDataLink);
    //scrollTO event
    window.scrollTo({
        // used getElementOffsets function
        // got to its top-prop
        // (-50) is used to view section element from the h2 tag containing the section's title @md-sm view
        top: getElementOffsets(targetSection).top -50,
        // chose a scroll behavior
        behavior: "smooth",
    });
});

/*** End Main Functions**/