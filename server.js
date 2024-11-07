<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MongoDB Frontend</title>
</head>
<body>
  <h1>Item Management</h1>
  
  <form id="itemForm">
    <input type="text" id="name" placeholder="Name" required />
    <input type="text" id="description" placeholder="Description" required />
    <button type="submit" id="submitButton">Add Item</button>
  </form>
  
  <h2>Items</h2>
  <ul id="itemList"></ul>

  <script>
    const API_URL = 'http://localhost:5000/api/items';
    let editingItemId = null;

    async function fetchItems() {
      const response = await fetch(API_URL);
      const items = await response.json();
      const itemList = document.getElementById('itemList');
      itemList.innerHTML = '';
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name}: ${item.description}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => startEditItem(item);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(item._id);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        itemList.appendChild(li);
      });
    }

    async function addItem(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;

      const itemData = { name, description };
      let response;

      if (editingItemId) {
        // Update item
        response = await fetch(`${API_URL}/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        editingItemId = null;
        document.getElementById('submitButton').textContent = 'Add Item';
      } else {
        // Create new item
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
      }

      if (response.ok) {
        document.getElementById('itemForm').reset();
        fetchItems();
      }
    }

    function startEditItem(item) {
      document.getElementById('name').value = item.name;
      document.getElementById('description').value = item.description;
      editingItemId = item._id;
      document.getElementById('submitButton').textContent = 'Update Item';
    }

    async function deleteItem(id) {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchItems();
      }
    }

    document.getElementById('itemForm').addEventListener('submit', addItem);
    fetchItems();
  </script>
</body>
</html>
