
async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    
    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Usage example:
fetchData().then(data => {
  if (data) {
    console.log(data);
  }
});


