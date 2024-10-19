let currentGeneration = 0;
let prizePools = [];
let totalGenerations = 1;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to update the background color based on the selected world
function updateBackgroundColor() {
  const world = document.getElementById('world-select').value;
  const body = document.body;

  switch (world) {
    case '1':
      body.style.backgroundColor = '#5C4614'; // Brown
      break;
    case '2':
      body.style.backgroundColor = '#228B22'; // Green
      break;
    case '3':
      body.style.backgroundColor = '#d3b261'; // Beige
      break;
    case '4':
      body.style.backgroundColor = '#ADD8E6'; // Light Blue
      break;
    case '5':
      body.style.backgroundColor = '#960018'; // Carmin Red
      break;
    case '6':
      body.style.backgroundColor = '#808080'; // Grey
      break;
  }
}

document.getElementById('world-select').addEventListener('change', updateBackgroundColor);

// Function to generate all generations result as text
function generateAllGenerationsResult() {
  let result = "prizePools = [\n";
  
  prizePools.forEach((generation, index) => {
    result += `  ${index}: [`;

    generation.forEach((item, itemIndex) => {
      result += `"${item === 'Nothing' ? '' : item}"`;
      if (itemIndex < generation.length - 1) {
        result += ', ';
      }
    });

    result += `],\n`;
  });

  result += "]\n";
  return result;
}

// Function to generate prize pools
function generatePrizePools() {
  const stage = document.getElementById('stage-select').value;
  const prizePoolCount = parseInt(document.getElementById('prize-pool-number').value, 10);

  let totalHolesPerStage = 0;
  let columns = 0;

  // Define the number of holes and columns based on the stage
  switch (stage) {
    case '1':
      totalHolesPerStage = 8;
      columns = 2;
      break;
    case '2':
      totalHolesPerStage = 12;
      columns = 3;
      break;
    case '3':
      totalHolesPerStage = 16;
      columns = 4;
      break;
    case '4':
      totalHolesPerStage = 24;
      columns = 4;
      break;
  }

  const totalHoles = totalHolesPerStage * prizePoolCount; // Total holes based on prize pools and stage

  // Get the percentages for each item
  const nothingPercentage = parseFloat(document.getElementById('nothing-percentage').value) || 0;
  const bombPercentage = parseFloat(document.getElementById('bomb-percentage').value) || 0;
  const chestPercentage = parseFloat(document.getElementById('chest-percentage').value) || 0;
  const strangeObjectPercentage = parseFloat(document.getElementById('strange-object-percentage').value) || 0;
  const petPercentage = parseFloat(document.getElementById('pet-percentage').value) || 0;

  const bombCount = Math.ceil((bombPercentage / 100) * totalHoles);
  const chestCount = Math.ceil((chestPercentage / 100) * totalHoles);
  const strangeObjectCount = Math.ceil((strangeObjectPercentage / 100) * totalHoles);
  const petCount = Math.ceil((petPercentage / 100) * totalHoles);
  let nothingCount = Math.ceil((nothingPercentage / 100) * totalHoles);

  const assignedHoles = bombCount + chestCount + strangeObjectCount + petCount;

  if (nothingPercentage === 0) {
    nothingCount = totalHoles - assignedHoles; // Fill the remaining holes with Nothing
  }

  // Get the selected world
  const world = document.getElementById('world-select').value;

  let allItems = [];
  allItems = allItems.concat(Array(bombCount).fill('Bomb'));
  allItems = allItems.concat(Array(chestCount).fill('Chest'));
  allItems = allItems.concat(Array(strangeObjectCount).fill('Strange Object'));
  
  // Update pet name dynamically based on the selected world
  allItems = allItems.concat(Array(petCount).fill(`Pet${world}`));
  
  allItems = allItems.concat(Array(nothingCount).fill('Nothing'));

  allItems = shuffleArray(allItems);

  prizePools = [];
  for (let i = 0; i < prizePoolCount; i++) {
    let start = i * totalHolesPerStage;
    let end = start + totalHolesPerStage;
    prizePools.push(allItems.slice(start, end));
  }

  totalGenerations = prizePoolCount;
  currentGeneration = 0;
  displayGeneration(currentGeneration, columns);

  const itemCountsContainer = document.getElementById('item-counts');
  itemCountsContainer.innerHTML = `
    <p>Total Nothing: ${nothingCount}</p>
    <p>Total Bomb: ${bombCount}</p>
    <p>Total Chest: ${chestCount}</p>
    <p>Total Strange Object: ${strangeObjectCount}</p>
    <p>Total Pet: ${petCount}</p>
  `;

  // Populate the all generations textbox
  const allGenerationsResult = generateAllGenerationsResult();
  document.getElementById('all-generations-result').value = allGenerationsResult;
}


// Function to generate result for a single generation
function generateGenerationResult(generationIndex, items) {
  let result = `${generationIndex}: [`;

  items.forEach((item, index) => {
    result += `"${item === 'Nothing' ? '' : item}"`;
    if (index < items.length - 1) {
      result += ', ';
    }
  });

  result += ']';
  return result;
}

// Function to display a specific generation of prize pools
function displayGeneration(generationIndex, columns) {
  const holesContainer = document.getElementById('holes-container');
  holesContainer.innerHTML = ''; // Clear the holes

  const generation = prizePools[generationIndex];
  holesContainer.style.gridTemplateColumns = `repeat(${columns}, 60px)`;

  generation.forEach((item) => {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    const img = document.createElement('img');
    
    // Check if the item is a pet, and set the image source accordingly
    if (item.startsWith("Pet")) {
      img.src = 'images/Pet.png';  // Always use Pet.png for the image
    } else {
      img.src = `images/${item}.png`;  // Use the respective image for other items
    }
    
    hole.appendChild(img);
    holesContainer.appendChild(hole);
  });

  document.getElementById('generation-counter').textContent = `Generation ${generationIndex + 1}/${totalGenerations}`;

  const generationResult = generateGenerationResult(generationIndex, generation);
  document.getElementById('generation-result').value = generationResult;
}


// Function to copy a single generation result to clipboard
function copyToClipboard() {
  const textArea = document.getElementById('generation-result');
  textArea.select();
  document.execCommand('copy');
  alert('Text copied to clipboard');
}

// Function to copy all generations result to clipboard
function copyAllToClipboard() {
  const textArea = document.getElementById('all-generations-result');
  textArea.select();
  document.execCommand('copy');
  alert('All prize pools copied to clipboard');
}

// Navigate to previous generation
function prevGeneration() {
  if (currentGeneration > 0) {
    currentGeneration--;
    const stage = document.getElementById('stage-select').value;
    let columns = 0;
    switch (stage) {
      case '1':
        columns = 2;
        break;
      case '2':
        columns = 3;
        break;
      case '3':
        columns = 4;
        break;
      case '4':
        columns = 4;
        break;
    }
    displayGeneration(currentGeneration, columns);
  }
}

// Navigate to next generation
function nextGeneration() {
  if (currentGeneration < totalGenerations - 1) {
    currentGeneration++;
    const stage = document.getElementById('stage-select').value;
    let columns = 0;
    switch (stage) {
      case '1':
        columns = 2;
        break;
      case '2':
        columns = 3;
        break;
      case '3':
        columns = 4;
        break;
      case '4':
        columns = 4;
        break;
    }
    displayGeneration(currentGeneration, columns);
  }
}
