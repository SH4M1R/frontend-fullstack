// Mock API para desarrollo
export const productAPI = {
  getAll: () => Promise.resolve({ data: [] }),
  create: (product) => Promise.resolve({ data: product }),
  update: (id, product) => Promise.resolve({ data: product }),
  delete: (id) => Promise.resolve({ data: { id } })
};

export const authAPI = {
  verify: () => Promise.resolve({ data: null }),
  login: (credentials) => Promise.resolve({ 
    data: { user: { name: 'Admin' }, token: 'mock-token' } 
  }),
  logout: () => Promise.resolve({ data: {} })
};