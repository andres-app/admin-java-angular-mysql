import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id?: number;
  name: string;
  username: string;
  role: string;
  active: boolean;
}

interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  loggedIn = localStorage.getItem('demo_session') === '1';
  currentView: 'dashboard' | 'users' | 'products' = 'dashboard';
  username = 'admin';
  password = '123123';
  message = '';
  loading = false;
  mobileMenu = false;

  users: User[] = [];
  products: Product[] = [];
  userSearch = '';
  productSearch = '';

  userModal = false;
  productModal = false;
  editingUser: User | null = null;
  editingProduct: Product | null = null;

  userForm: User = { name: '', username: '', role: 'OPERADOR', active: true };
  productForm: Product = { name: '', category: 'General', price: 0, stock: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.loggedIn) this.loadAll();
  }

  login(): void {
    this.loading = true;
    this.message = '';
    this.http.post<any>('/api/auth/login', { username: this.username, password: this.password })
      .subscribe({
        next: () => {
          localStorage.setItem('demo_session', '1');
          this.loggedIn = true;
          this.loading = false;
          this.loadAll();
        },
        error: () => {
          this.loading = false;
          this.message = 'Usuario o contraseña incorrectos.';
        }
      });
  }

  logout(): void {
    localStorage.removeItem('demo_session');
    this.loggedIn = false;
    this.currentView = 'dashboard';
  }

  navigate(view: 'dashboard' | 'users' | 'products'): void {
    this.currentView = view;
    this.mobileMenu = false;
  }

  loadAll(): void {
    this.loadUsers();
    this.loadProducts();
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe(data => this.users = data);
  }

  loadProducts(): void {
    this.http.get<Product[]>('/api/products').subscribe(data => this.products = data);
  }

  get filteredUsers(): User[] {
    const q = this.userSearch.toLowerCase().trim();
    return this.users.filter(u => `${u.name} ${u.username} ${u.role}`.toLowerCase().includes(q));
  }

  get filteredProducts(): Product[] {
    const q = this.productSearch.toLowerCase().trim();
    return this.products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q));
  }

  get totalStock(): number {
    return this.products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  }

  get inventoryValue(): number {
    return this.products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);
  }

  openUser(user?: User): void {
    this.editingUser = user || null;
    this.userForm = user ? { ...user } : { name: '', username: '', role: 'OPERADOR', active: true };
    this.userModal = true;
  }

  saveUser(): void {
    const request = this.editingUser?.id
      ? this.http.put<User>(`/api/users/${this.editingUser.id}`, this.userForm)
      : this.http.post<User>('/api/users', this.userForm);
    request.subscribe(() => {
      this.userModal = false;
      this.loadUsers();
    });
  }

  deleteUser(user: User): void {
    if (!user.id || !confirm(`¿Eliminar a ${user.name}?`)) return;
    this.http.delete(`/api/users/${user.id}`).subscribe(() => this.loadUsers());
  }

  openProduct(product?: Product): void {
    this.editingProduct = product || null;
    this.productForm = product ? { ...product } : { name: '', category: 'General', price: 0, stock: 0 };
    this.productModal = true;
  }

  saveProduct(): void {
    const request = this.editingProduct?.id
      ? this.http.put<Product>(`/api/products/${this.editingProduct.id}`, this.productForm)
      : this.http.post<Product>('/api/products', this.productForm);
    request.subscribe(() => {
      this.productModal = false;
      this.loadProducts();
    });
  }

  deleteProduct(product: Product): void {
    if (!product.id || !confirm(`¿Eliminar ${product.name}?`)) return;
    this.http.delete(`/api/products/${product.id}`).subscribe(() => this.loadProducts());
  }
}
