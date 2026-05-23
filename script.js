const container = document.getElementById("array-container");
const selectMenu = document.getElementById("algo-select");
const generateBtn = document.getElementById("generate-btn");
const startBtn = document.getElementById("start-btn");
const statusText = document.getElementById("status-text");
const speedSlider = document.getElementById("speed-slider");
const customInput = document.getElementById("custom-array-input");
const applyInputBtn = document.getElementById("apply-input-btn");

let array = [];
let isVisualizing = false;

const sleep = () => {
    return new Promise(resolve => {
        let currentDelay = (101 - speedSlider.value) * 10;
        setTimeout(resolve, currentDelay);
    });
};

function generateData() {
    if (isVisualizing) return;
    container.innerHTML = "";
    array = [];
    const algo = selectMenu.value;

    if (algo === "stackOps") {
        container.classList.add("stack-mode");
        statusText.innerText = "Stack is currently empty. Click visualize to Push/Pop.";
        return; 
    } else {
        container.classList.remove("stack-mode");
    }

    let size = 20; 
    for (let i = 0; i < size; i++) {
        let value = Math.floor(Math.random() * 90) + 10;
        if (algo === "moveZeroes" && Math.random() > 0.7) value = 0; 
        if (algo === "palindromeArray") {
            if (i >= size / 2) value = array[size - 1 - i]; 
        }
        array.push(value);
    }

    if (algo === "binarySearch" || algo === "twoPointerSum") {
        array.sort((a, b) => a - b);
    }

    renderArray();
    statusText.innerText = `Random data generated for: ${selectMenu.options[selectMenu.selectedIndex].text}`;
    statusText.style.color = "#f39c12";
}

function applyCustomArray() {
    if (isVisualizing) return;
    
    const inputText = customInput.value.trim();
    if (!inputText) {
        statusText.innerText = "Please enter some numbers first!";
        statusText.style.color = "#e74c3c";
        return;
    }

    const newArray = inputText.split(",")
        .map(numStr => parseInt(numStr.trim()))
        .filter(num => !isNaN(num));

    if (newArray.length === 0) {
        statusText.innerText = "Invalid format. Use numbers separated by commas.";
        return;
    }

    array = newArray;
    const algo = selectMenu.value;
    
    if (algo === "binarySearch" || algo === "twoPointerSum") {
        array.sort((a, b) => a - b);
        statusText.innerText = "User array applied (Auto-sorted for this algorithm)";
    } else {
        statusText.innerText = "User array applied successfully! Ready to visualize.";
    }
    statusText.style.color = "#f39c12";

    if (algo === "stackOps") {
        container.classList.add("stack-mode");
        container.innerHTML = "";
    } else {
        container.classList.remove("stack-mode");
        renderArray();
    }
}

function renderArray() {
    container.innerHTML = "";
    let maxVal = Math.max(...array, 1); 
    
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        let scaledHeight = (value / maxVal) * 300;
        bar.style.height = value === 0 ? "10px" : `${Math.max(scaledHeight, 15)}px`; 
        bar.innerText = value; 
        container.appendChild(bar);
    });
}

function lockControls(lock) {
    isVisualizing = lock;
    generateBtn.disabled = lock;
    startBtn.disabled = lock;
    applyInputBtn.disabled = lock;
    selectMenu.disabled = lock;
}

function updateBarHeights(bars) {
    let maxVal = Math.max(...array, 1); 
    for(let i = 0; i < array.length; i++) {
        let scaledHeight = (array[i] / maxVal) * 300;
        bars[i].style.height = array[i] === 0 ? "10px" : `${Math.max(scaledHeight, 15)}px`;
    }
}

// --- ALGORITHMS ---

async function bubbleSort(bars) {
    statusText.innerText = "Bubble Sort: Comparing adjacent elements & bubbling largest to end.";
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = "#e74c3c"; 
            bars[j+1].style.backgroundColor = "#e74c3c";
            await sleep();

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateBarHeights(bars);
            }
            bars[j].style.backgroundColor = "#3498db"; 
            bars[j+1].style.backgroundColor = "#3498db";
        }
        bars[array.length - 1 - i].style.backgroundColor = "#2ecc71"; 
    }
    bars[0].style.backgroundColor = "#2ecc71";
}

async function selectionSort(bars) {
    statusText.innerText = "Selection Sort: Finding the minimum element and swapping it to the front.";
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        bars[minIdx].style.backgroundColor = "#f1c40f"; 

        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = "#e74c3c"; 
            await sleep();
            
            if (array[j] < array[minIdx]) {
                bars[minIdx].style.backgroundColor = "#3498db";
                minIdx = j;
                bars[minIdx].style.backgroundColor = "#f1c40f"; 
            } else {
                bars[j].style.backgroundColor = "#3498db";
            }
        }
        
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            updateBarHeights(bars);
        }
        bars[i].style.backgroundColor = "#2ecc71"; 
    }
}

async function linearSearch(bars) {
    let target = array[Math.floor(Math.random() * array.length)];
    statusText.innerText = `Linear Search: Looking for target value ${target}`;
    
    for (let i = 0; i < array.length; i++) {
        bars[i].style.backgroundColor = "#e74c3c";
        await sleep();
        
        if (array[i] === target) {
            bars[i].style.backgroundColor = "#2ecc71";
            statusText.innerText = `Found ${target} at index ${i}!`;
            return;
        }
        bars[i].style.backgroundColor = "#555"; 
    }
}

async function binarySearch(bars) {
    let target = array[Math.floor(Math.random() * array.length)];
    statusText.innerText = `Binary Search: Looking for target value ${target} in O(log n)`;
    
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
        for(let i=0; i<array.length; i++) {
            if(i < left || i > right) bars[i].style.backgroundColor = "#555";
            else bars[i].style.backgroundColor = "#3498db";
        }
        
        let mid = Math.floor((left + right) / 2);
        bars[mid].style.backgroundColor = "#f1c40f"; 
        await sleep();
        await sleep(); 
        
        if (array[mid] === target) {
            bars[mid].style.backgroundColor = "#2ecc71";
            statusText.innerText = `Found ${target} at index ${mid}!`;
            return;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
}

async function stackOps() {
    statusText.innerText = "Stack: Pushing elements... Last In, First Out (LIFO)";
    let valuesToPush = array.length > 0 ? array : [10, 20, 30, 40, 50]; 
    
    for (let val of valuesToPush) {
        await sleep();
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.innerText = `Pushed: ${val}`;
        bar.style.backgroundColor = "#e67e22"; 
        container.appendChild(bar); 
    }

    statusText.innerText = "Stack: Popping elements...";
    await sleep();
    await sleep();

    let pops = Math.ceil(valuesToPush.length / 2);
    for (let i = 0; i < pops; i++) {
        await sleep();
        if (container.lastChild) {
            container.lastChild.style.backgroundColor = "#e74c3c"; 
            await sleep();
            container.removeChild(container.lastChild);
        }
    }
    statusText.innerText = "Stack Visualization Complete";
}

async function reverseArray(bars) {
    statusText.innerText = "Two Pointers: Swapping left and right ends moving inwards.";
    let left = 0, right = array.length - 1;
    
    while (left < right) {
        bars[left].style.backgroundColor = "#e74c3c";
        bars[right].style.backgroundColor = "#e74c3c";
        await sleep();
        
        [array[left], array[right]] = [array[right], array[left]];
        updateBarHeights(bars);
        
        bars[left].style.backgroundColor = "#2ecc71";
        bars[right].style.backgroundColor = "#2ecc71";
        left++;
        right--;
    }
    if (left === right) bars[left].style.backgroundColor = "#2ecc71"; 
    statusText.innerText = "Array Reversed!";
}

async function findMax(bars) {
    statusText.innerText = "Linear Scan: Finding maximum element.";
    let maxVal = -1;
    let maxIdx = -1;
    
    for (let i = 0; i < array.length; i++) {
        bars[i].style.backgroundColor = "#e74c3c"; 
        await sleep();
        
        if (array[i] > maxVal) {
            if (maxIdx !== -1) bars[maxIdx].style.backgroundColor = "#555"; 
            maxVal = array[i];
            maxIdx = i;
            bars[maxIdx].style.backgroundColor = "#f1c40f"; 
        } else {
            bars[i].style.backgroundColor = "#555"; 
        }
    }
    statusText.innerText = `Maximum Value Found: ${maxVal}`;
}

async function moveZeroes(bars) {
    statusText.innerText = "Two Pointers: Pushing all zeroes to the end.";
    let nonZeroIdx = 0;
    
    for(let i=0; i<array.length; i++) {
        if(array[i]===0) bars[i].style.backgroundColor = "#8e44ad"; 
    }
    
    for (let i = 0; i < array.length; i++) {
        bars[i].style.transform = "scale(1.1)";
        await sleep();
        
        if (array[i] !== 0) {
            [array[nonZeroIdx], array[i]] = [array[i], array[nonZeroIdx]];
            updateBarHeights(bars);
            
            bars[nonZeroIdx].style.backgroundColor = "#2ecc71";
            if (i !== nonZeroIdx) bars[i].style.backgroundColor = "#8e44ad"; 
            nonZeroIdx++;
        }
        bars[i].style.transform = "scale(1)";
    }
    statusText.innerText = "All zeroes moved to the end!";
}

async function twoPointerSum(bars) {
    let idx1 = Math.floor(Math.random() * array.length);
    let idx2 = Math.floor(Math.random() * array.length);
    while (idx1 === idx2) idx2 = Math.floor(Math.random() * array.length);
    let target = array[idx1] + array[idx2];
    
    statusText.innerText = `Two Pointers: Looking for a pair that sums to ${target}`;
    
    let left = 0;
    let right = array.length - 1;
    
    while (left < right) {
        bars[left].style.backgroundColor = "#e74c3c";
        bars[right].style.backgroundColor = "#e74c3c";
        await sleep();
        
        let sum = array[left] + array[right];
        if (sum === target) {
            bars[left].style.backgroundColor = "#2ecc71";
            bars[right].style.backgroundColor = "#2ecc71";
            statusText.innerText = `Found pair: ${array[left]} + ${array[right]} = ${target}`;
            return;
        } else if (sum < target) {
            bars[left].style.backgroundColor = "#555";
            left++;
        } else {
            bars[right].style.backgroundColor = "#555";
            right--;
        }
    }
}

async function palindromeArray(bars) {
    statusText.innerText = "Two Pointers: Checking if array is symmetric (Palindrome).";
    let left = 0, right = array.length - 1;
    let isPal = true;
    
    while (left < right) {
        bars[left].style.backgroundColor = "#f1c40f";
        bars[right].style.backgroundColor = "#f1c40f";
        await sleep();
        
        if (array[left] !== array[right]) {
            bars[left].style.backgroundColor = "#e74c3c";
            bars[right].style.backgroundColor = "#e74c3c";
            isPal = false;
            break;
        } else {
            bars[left].style.backgroundColor = "#2ecc71";
            bars[right].style.backgroundColor = "#2ecc71";
        }
        left++;
        right--;
    }
    if (isPal && left === right) bars[left].style.backgroundColor = "#2ecc71";
    statusText.innerText = isPal ? "Array IS a Palindrome!" : "Array is NOT a Palindrome.";
}

// --- MAIN ROUTER ---

async function runVisualizer() {
    const bars = document.querySelectorAll(".bar");
    const algo = selectMenu.value;
    
    if (algo !== "stackOps" && array.length === 0) {
        statusText.innerText = "Please generate data first!";
        return;
    }
    
    lockControls(true);

    switch (algo) {
        case "bubbleSort": await bubbleSort(bars); break;
        case "selectionSort": await selectionSort(bars); break;
        case "linearSearch": await linearSearch(bars); break;
        case "binarySearch": await binarySearch(bars); break;
        case "stackOps": await stackOps(); break;
        case "reverseArray": await reverseArray(bars); break;
        case "findMax": await findMax(bars); break;
        case "moveZeroes": await moveZeroes(bars); break;
        case "twoPointerSum": await twoPointerSum(bars); break;
        case "palindromeArray": await palindromeArray(bars); break;
    }

    lockControls(false);
}

// Event Listeners
selectMenu.addEventListener("change", generateData);
generateBtn.addEventListener("click", generateData);
applyInputBtn.addEventListener("click", applyCustomArray);
startBtn.addEventListener("click", runVisualizer);

// Initialize on load
generateData();