const socket = io();

const productList = document.getElementById('productList');
const addForm = document.getElementById('addForm');
const deleteForm = document.getElementById('deleteForm');


socket.on('update-products', (products) => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `ID: ${p.id} - ${p.title} - ${p.price}`;
    productList.appendChild(li);
  });
});


addForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = addForm.elements['title'].value;
  const price = addForm.elements['price'].value;
  const id = crypto.randomUUID();
  socket.emit('new-product', { id, title, price });
  addForm.reset();
});


deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = deleteForm.elements['id'].value;
  socket.emit('delete-product', id);
  deleteForm.reset();
});