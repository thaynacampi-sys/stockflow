import { useMemo, useState } from 'react'
import './App.css'

interface Product {
  id: number
  name: string
  category: string
  quantity: number
  minimumStock: number
  price: number
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Teclado Mecânico',
    category: 'Periféricos',
    quantity: 35,
    minimumStock: 10,
    price: 189.9,
  },
  {
    id: 2,
    name: 'Mouse sem fio',
    category: 'Periféricos',
    quantity: 7,
    minimumStock: 15,
    price: 89.9,
  },
  {
    id: 3,
    name: 'Monitor 24"',
    category: 'Monitores',
    quantity: 12,
    minimumStock: 5,
    price: 899.9,
  },
  {
    id: 4,
    name: 'Notebook',
    category: 'Computadores',
    quantity: 8,
    minimumStock: 3,
    price: 3500,
  },
]

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')

  const [showForm, setShowForm] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: '',
    minimumStock: '',
    price: '',
  })

  const categories = [
    'Todas',
    ...Array.from(new Set(products.map((product) => product.category))),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'Todas' || product.category === category

    return matchesSearch && matchesCategory
  })

  const totalProducts = products.length

  const productsInStock = products.filter(
    (product) => product.quantity > product.minimumStock
  ).length

  const productsLowStock = products.filter(
    (product) => product.quantity <= product.minimumStock
  ).length

  const totalStockValue = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    )
  }, [products])

  function handleAddProduct(event: React.FormEvent) {
    event.preventDefault()

    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.quantity ||
      !newProduct.minimumStock ||
      !newProduct.price
    ) {
      alert('Preencha todos os campos.')
      return
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      quantity: Number(newProduct.quantity),
      minimumStock: Number(newProduct.minimumStock),
      price: Number(newProduct.price),
    }

    setProducts((currentProducts) => [
      ...currentProducts,
      product,
    ])

    setNewProduct({
      name: '',
      category: '',
      quantity: '',
      minimumStock: '',
      price: '',
    })

    setShowForm(false)
  }

  function handleDeleteProduct(id: number) {
    const confirmed = window.confirm(
      'Deseja realmente excluir este produto?'
    )

    if (!confirmed) {
      return
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span>📦</span>
          <h1>StockFlow</h1>
        </div>

        <nav>
          <button className="menu-item active">
            📊 Dashboard
          </button>

          <button className="menu-item">
            📦 Produtos
          </button>

          <button className="menu-item">
            🔄 Movimentações
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item">
            ⚙️ Configurações
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <p className="welcome">
              Olá, Thayná! 👋
            </p>

            <h2>Dashboard</h2>
          </div>

          <div className="user">
            <div className="avatar">
              T
            </div>

            <div>
              <strong>Thayná</strong>
              <span>Administradora</span>
            </div>
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <span className="card-icon">📦</span>

            <p>Total de produtos</p>

            <h3>{totalProducts}</h3>
          </div>

          <div className="card">
            <span className="card-icon">✅</span>

            <p>Em estoque</p>

            <h3>{productsInStock}</h3>
          </div>

          <div className="card">
            <span className="card-icon">⚠️</span>

            <p>Estoque baixo</p>

            <h3>{productsLowStock}</h3>
          </div>

          <div className="card">
            <span className="card-icon">💰</span>

            <p>Valor do estoque</p>

            <h3>
              R${' '}
              {totalStockValue
                .toFixed(2)
                .replace('.', ',')}
            </h3>
          </div>
        </section>

        <section className="products-section">
          <div className="section-header">
            <div>
              <h2>Produtos</h2>

              <p>
                Gerencie os produtos cadastrados no estoque.
              </p>
            </div>

            <button
              className="add-button"
              onClick={() => setShowForm(true)}
            >
              + Novo produto
            </button>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="🔎 Buscar produto..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Mínimo</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="empty"
                    >
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock =
                      product.quantity <=
                      product.minimumStock

                    return (
                      <tr key={product.id}>
                        <td>
                          <strong>
                            {product.name}
                          </strong>
                        </td>

                        <td>
                          {product.category}
                        </td>

                        <td>
                          {product.quantity}
                        </td>

                        <td>
                          {product.minimumStock}
                        </td>

                        <td>
                          R${' '}
                          {product.price
                            .toFixed(2)
                            .replace('.', ',')}
                        </td>

                        <td>
                          {isLowStock ? (
                            <span className="status low">
                              Estoque baixo
                            </span>
                          ) : (
                            <span className="status normal">
                              Normal
                            </span>
                          )}
                        </td>

                        <td>
                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Novo produto</h2>

                <p>
                  Cadastre um novo produto no estoque.
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <label>
                Nome do produto
                <input
                  type="text"
                  placeholder="Ex.: Teclado Gamer"
                  value={newProduct.name}
                  onChange={(event) =>
                    setNewProduct({
                      ...newProduct,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Categoria
                <input
                  type="text"
                  placeholder="Ex.: Periféricos"
                  value={newProduct.category}
                  onChange={(event) =>
                    setNewProduct({
                      ...newProduct,
                      category: event.target.value,
                    })
                  }
                />
              </label>

              <div className="form-row">
                <label>
                  Quantidade
                  <input
                    type="number"
                    min="0"
                    value={newProduct.quantity}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        quantity:
                          event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Estoque mínimo
                  <input
                    type="number"
                    min="0"
                    value={newProduct.minimumStock}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        minimumStock:
                          event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Preço
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex.: 199.90"
                  value={newProduct.price}
                  onChange={(event) =>
                    setNewProduct({
                      ...newProduct,
                      price: event.target.value,
                    })
                  }
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  Salvar produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App