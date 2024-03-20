import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [isFormEditing, setIsFormEditing] = useState(false);

  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleClearItems() {
    if (!items.length) {
      alert("there is no item to clear");
    } else {
      const confirmed = window.confirm("Are you sure ?");
      if (confirmed) setItems([]);
    }
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleEditItem(id) {
    const updateItems = items.find((item) => item.id === id);
    setDescription(updateItems.description);
    setIsEditing(id);
    setIsFormEditing(true);
  }
  function handleSaveItem(id, newQuantity, newDescription) {
    setItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, description: newDescription, quantity: newQuantity }
          : item
      )
    );
    setIsFormEditing(false);
  }
  return (
    <div className="app">
      <Logo />
      <Form
        onAddItems={handleAddItem}
        description={description}
        setDescription={setDescription}
        onSaveEdit={handleSaveItem}
        isEditing={isEditing}
        onEdit={isFormEditing}
      />
      <PackingList
        items={items}
        onClear={handleClearItems}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onEditItem={handleEditItem}
      />
      <Stats items={items} />
    </div>
  );
}
function Logo() {
  return (
    <div>
      <h1 className="logo"> TODO-PACKING List</h1>
    </div>
  );
}
function Form({
  onAddItems,
  description,
  setDescription,
  onSaveEdit,
  isEditing,
  onEdit,
}) {
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    if (!isEditing) {
      const newItem = { description, quantity, packed: false, id: Date.now() };
      onAddItems(newItem);
    } else {
      onSaveEdit(isEditing, quantity, description);
    }

    setQuantity(1);
    setDescription("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3 className="form-header"> what do you need for your trip</h3>
      <div className="form">
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="items..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {onEdit ? <button>SAVE</button> : <button>ADD</button>}
      </div>
    </form>
  );
}

function PackingList({
  items,
  onClear,
  onDeleteItem,
  onToggleItem,
  onEditItem,
}) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            items={item}
            key={item.id}
            onCLear={onClear}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
            onEditItem={onEditItem}
          />
        ))}
      </ul>
      <button onClick={onClear}> CLEAR ITEMS</button>
    </div>
  );
}

function Item({ items, onDeleteItem, onToggleItem, onEditItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={items.packed}
        onChange={() => onToggleItem(items.id)}
      />
      <span style={items.packed ? { textDecoration: "line-through" } : {}}>
        {items.quantity} {items.description}
      </span>
      {!items.packed && (
        <>
          <button onClick={() => onEditItem(items.id)}>✍🏻</button>
          <button onClick={() => onDeleteItem(items.id)}> ❌</button>
        </>
      )}
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <div className="stats">
        <p>Please add an item to your packing list</p>
      </div>
    );
  const numItem = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItem) * 100);
  return (
    <footer className="stats">
      {percentage === 100
        ? " you're ready "
        : `you have ${numItem} items on your list, and you  already packed ${numPacked}
        (${percentage} %)`}
    </footer>
  );
}
