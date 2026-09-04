import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

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
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
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
  sidebarCollapsed = false;

  users: User[] = [];
  products: Product[] = [];
  userSearch = '';
  productSearch = '';

  userModal = false;
  productModal = false;
  editingUser: User | null = null;
  editingProduct: Product | null = null;

  roles = ['ADMIN', 'OPERADOR', 'CONSULTA'];
  statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  userForm: User = { name: '', username: '', role: 'OPERADOR', active: true };
  productForm: Product = { name: '', category: 'General', price: 0, stock: 0 };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (this.loggedIn) this.loadAll();
  }

  get pageTitle(): string {
    if (this.currentView === 'users') return 'Usuarios';
    if (this.currentView === 'products') return 'Productos';
    return 'Dashboard';
  }

  get pageSubtitle(): string {
    if (this.currentView === 'users') return 'Administración de usuarios y accesos';
    if (this.currentView === 'products') return 'Gestión del catálogo e inventario';
    return 'Resumen general de la plataforma';
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

  get activeUsers(): number {
    return this.users.filter(u => u.active).length;
  }

  get lowStockProducts(): number {
    return this.products.filter(p => Number(p.stock) <= 10).length;
  }

  get lowStockList(): Product[] {
    return [...this.products].sort((a, b) => Number(a.stock) - Number(b.stock)).slice(0, 5);
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

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadAll(): void {
    this.loadUsers();
    this.loadProducts();
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: data => this.users = data,
      error: () => this.notify('error', 'Error', 'No se pudieron cargar los usuarios.')
    });
  }

  loadProducts(): void {
    this.http.get<Product[]>('/api/products').subscribe({
      next: data => this.products = data,
      error: () => this.notify('error', 'Error', 'No se pudieron cargar los productos.')
    });
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

    request.subscribe({
      next: () => {
        const edited = !!this.editingUser;
        this.userModal = false;
        this.loadUsers();
        this.notify('success', 'Guardado', edited ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.');
      },
      error: () => this.notify('error', 'Error', 'No se pudo guardar el usuario.')
    });
  }

  deleteUser(user: User): void {
    if (!user.id) return;
    this.confirmationService.confirm({
      header: 'Eliminar usuario',
      message: `¿Deseas eliminar a ${user.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.http.delete(`/api/users/${user.id}`).subscribe({
          next: () => {
            this.loadUsers();
            this.notify('success', 'Eliminado', 'Usuario eliminado correctamente.');
          },
          error: () => this.notify('error', 'Error', 'No se pudo eliminar el usuario.')
        });
      }
    });
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

    request.subscribe({
      next: () => {
        const edited = !!this.editingProduct;
        this.productModal = false;
        this.loadProducts();
        this.notify('success', 'Guardado', edited ? 'Producto actualizado correctamente.' : 'Producto registrado correctamente.');
      },
      error: () => this.notify('error', 'Error', 'No se pudo guardar el producto.')
    });
  }

  deleteProduct(product: Product): void {
    if (!product.id) return;
    this.confirmationService.confirm({
      header: 'Eliminar producto',
      message: `¿Deseas eliminar ${product.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.http.delete(`/api/products/${product.id}`).subscribe({
          next: () => {
            this.loadProducts();
            this.notify('success', 'Eliminado', 'Producto eliminado correctamente.');
          },
          error: () => this.notify('error', 'Error', 'No se pudo eliminar el producto.')
        });
      }
    });
  }

  private notify(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
