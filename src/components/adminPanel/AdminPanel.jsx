import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryMessage, setCategoryMessage] = useState('');
  const [productMessage, setProductMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  // Category creation states
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  // Product states
  const [productTitle, setProductTitle] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productSalePrice, setProductSalePrice] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/product-category');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryMessage('Failed to load categories');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/product?page=${currentPage}&limit=${productsPerPage}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        if (Array.isArray(data.products)) {
          setProducts(data.products); 
          setTotalProducts(data.total);
        } else {
          console.error('Expected products array but got:', data);
          setProductMessage('Unexpected product data format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductMessage('Failed to load products');
      }
    };

    fetchCategories();
    fetchProducts();
  }, [currentPage, productsPerPage]);

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        const base64WithoutPrefix = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        resolve(base64WithoutPrefix); 
      };
      reader.onerror = (error) => reject('Error converting image to Base64');
      reader.readAsDataURL(file); 
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!productImage) {
      setProductMessage('Please provide a product image.');
      return;
    }

    try {
      const base64Image = await convertImageToBase64(productImage);

      const productData = {
        title: productTitle,
        category_name: productCategory,
        description: productDescription,
        image: base64Image, 
        price: Number(productPrice),
        sale_price: productSalePrice ? Number(productSalePrice) : null,
      };

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found.');
        setProductMessage('No access token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:3000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setProductMessage(`Error: ${JSON.stringify(errorData) || 'An unknown error occurred.'}`);
        return;
      }

      setProductMessage('Product created successfully!');
      setProductTitle('');
      setProductCategory('');
      setProductDescription('');
      setProductImage('');
      setProductPrice('');
      setProductSalePrice('');
    } catch (error) {
      console.error('Error submitting product:', error);
      setProductMessage('An error occurred while submitting the product.');
    }
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found.');
        setProductMessage('No access token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:3000/product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ids: [productId],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setProductMessage(`Error: ${JSON.stringify(errorData) || 'An unknown error occurred.'}`);
        return;
      }

      const data = await response.json();
      if (data.message === 'Products deleted successfully.') {
        setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
        setProductMessage('Product deleted successfully');
      } else {
        setProductMessage('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setProductMessage('Failed to delete product');
    }
    setLoading(false);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setCategoryMessage('Please provide a category name.');
      return;
    }

    try {
      const categoryData = {
        name: categoryName,
        image: categoryImage ? await convertImageToBase64(categoryImage) : '', // Optional image
      };

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found.');
        setCategoryMessage('No access token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:3000/product-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setCategoryMessage(`Error: ${JSON.stringify(errorData) || 'An unknown error occurred.'}`);
        return;
      }

      setCategoryMessage('Category created successfully!');
      setCategoryName('');
      setCategoryImage(null);
      // Re-fetch categories after creation
      const categoriesResponse = await fetch('http://localhost:3000/product-category');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error creating category:', error);
      setCategoryMessage('An error occurred while creating the category.');
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found.');
        setCategoryMessage('No access token found. Please log in.');
        return;
      }
  
      const response = await fetch(`http://localhost:3000/product-category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setCategoryMessage(`Error: ${errorData.message || 'An unknown error occurred.'}`);
        return;
      }
  
      // Successful deletion
      setCategories((prevCategories) => prevCategories.filter(category => category.id !== categoryId));
      setCategoryMessage('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      setCategoryMessage('Failed to delete category');
    }
  };
  

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="admin-panel-container p-6 bg-gray-100 min-h-screen">
      {/* Create Category Form */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8 flex">
        <div className="w-1/2 pr-8">
          <h2 className="text-2xl font-bold mb-4">შექმენი კატეგორია</h2>
          <form onSubmit={handleCategorySubmit}>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="კატეგორიის სახელი"
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <input
              type="file"
              onChange={(e) => setCategoryImage(e.target.files[0])}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg"
            >
              შექმნა
            </button>
          </form>
          {categoryMessage && (
            <p className="mt-4 text-green-500 font-semibold">{categoryMessage}</p>
          )}
        </div>

        {/* List of Categories */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">კატეგორიები</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="mb-4">
                <div className="flex items-center">
                  {category.image && (
                    <img
                      src={`data:image/jpeg;base64,${category.image}`}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-full mr-4"
                    />
                  )}
                  <span className="font-semibold">{category.name}</span>
                  <button
                    onClick={() => handleCategoryDelete(category.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Create Product Form */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">შექმნი პროდუქტი</h2>
        <form onSubmit={handleProductSubmit}>
          <input
            type="text"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            placeholder="პროდუქტის სახელი"
            className="w-full p-3 mb-4 border rounded-lg"
            required
          />
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"
            required
          >
            <option value="">აირჩიე კატეგორია</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="პროდუქტის აღწერა"
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <input
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
          />
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="ფასი"
            className="w-full p-3 mb-4 border rounded-lg"
            required
          />
          <input
            type="number"
            value={productSalePrice}
            onChange={(e) => setProductSalePrice(e.target.value)}
            placeholder="ფასდაკლებული ფასი (Optional)"
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            შექმნა
          </button>
        </form>
        {productMessage && (
          <p className="mt-4 text-green-500 font-semibold">{productMessage}</p>
        )}
      </div>

      {/* Existing Products */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">პროდუქტები</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white">
              <img src={`${product.image}`} alt={product.title} className="w-full h-48 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-2">{product.category_name}</p>
              <p className="text-gray-500 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
          >
            Prev
          </button>
          <span className="self-center text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
