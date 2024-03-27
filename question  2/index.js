const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 9876;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Configuration
const windowSize = 10;
let numberWindow = [];




//this   is not working http://20.244.56.144/test/$ 

// const fetchNumbersFromTestServer = async (numberId) => {
//     try {
//       const response = await axios.get(`http://20.244.56.144/test/${numberId}`, { timeout: 500 });
//       return response.data.numbers;
//     } catch (error) {
//       console.error(`Error fetching numbers for ${numberId}:`, error);
//       return [];
//     }
//   };

// Helper function to generate random numbers based on numberId
const generateRandomNumbers = (numberId) => {
  switch (numberId) {
    case 'p': 
      return generatePrimes(windowSize);
    case 'f': 
      return generateFibonacci(windowSize);
    case 'e': 
      return generateEven(windowSize);
    case 'r': 
      return generateRandom(windowSize);
    default:
      return [];
  }
};

// Function to generate prime numbers
const generatePrimes = (count) => {
  const primes = [];
  let num = 2;
  while (primes.length < count) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  return primes;
};


const isPrime = (num) => {
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return num > 1;
};


const generateFibonacci = (count) => {
  const fibonacci = [0, 1];
  for (let i = 2; i < count; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
  }
  return fibonacci;
};


const generateEven = (count) => {
  const even = [];
  let num = 2;
  while (even.length < count) {
    even.push(num);
    num += 2;
  }
  return even;
};


const generateRandom = (count) => {
  const random = [];
  for (let i = 0; i < count; i++) {
    random.push(Math.floor(Math.random() * 100) + 1); 
  }
  return random;
};

// Middleware to validate numberId
app.use('/numbers/:numberId', (req, res, next) => {
  const { numberId } = req.params;
  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).send({ error: 'Invalid numberId' });
  }
  next();
});

// Endpoint to fetch numbers based on numberId, update window, and respond with the required data
app.get('/numbers/:numberId', (req, res) => {
  const { numberId } = req.params;

  // Generate random numbers based on numberId
  const numbers = generateRandomNumbers(numberId);

  // Remove duplicates and limit to window size
  const uniqueNumbers = [...new Set(numbers)];
  const windowPrevState = [...numberWindow];
  numberWindow = [...new Set([...numberWindow, ...uniqueNumbers].slice(-windowSize))];

  // Calculate average of numbers in the window
  const avg = numberWindow.reduce((acc, curr) => acc + curr, 0) / numberWindow.length;

  // Respond with the required data
  res.json({
    numbers,
    windowPrevState,
    windowCurrState: numberWindow,
    avg: avg.toFixed(2)
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Average Calculator microservice running at http://localhost:${port}`);
});
