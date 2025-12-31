import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Inventory.css';

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    price: '',
    reorderLevel: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5005/api/inventory/${user.roleId}`); // Use roleId
        setItems(res.data);
      } catch (err) {
        setError('Failed to fetch inventory items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user]);

  const handleAddFormChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...addForm,
        quantity: Number(addForm.quantity),
        reorderLevel: Number(addForm.reorderLevel),
        wholesalerId: user.roleId // Use roleId
      };
      const res = await axios.post('http://localhost:5005/api/inventory/add', payload);
      setItems((prev) => [...prev, res.data.item]);
      setAddForm({ name: '', category: '', quantity: '', unit: '', price: '', reorderLevel: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wholesaler-inventory">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <p>Welcome, {user?.email}!</p>
        <button className="primary-btn" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Close Form' : 'Add New Item'}
          </button>
      </div>
      {showAddForm && (
        <form className="add-item-form" onSubmit={handleAddFormSubmit}>
          <input name="name" value={addForm.name} onChange={handleAddFormChange} placeholder="Name" required />
          <input name="category" value={addForm.category} onChange={handleAddFormChange} placeholder="Category" required />
          <input name="quantity" value={addForm.quantity} onChange={handleAddFormChange} placeholder="Quantity" type="number" required />
          <input name="unit" value={addForm.unit} onChange={handleAddFormChange} placeholder="Unit (e.g. kg)" required />
          <input name="price" value={addForm.price} onChange={handleAddFormChange} placeholder="Price (e.g. ₹100/kg)" required />
          <input name="reorderLevel" value={addForm.reorderLevel} onChange={handleAddFormChange} placeholder="Reorder Level" type="number" required />
          <button type="submit" className="primary-btn">Add</button>
        </form>
      )}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Reorder Level</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.price}</td>
              <td>{item.reorderLevel}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
