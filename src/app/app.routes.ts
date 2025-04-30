import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { SearchComponent } from './pages/search/search.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/profile/settings/settings.component';
import { EditComponent } from './pages/profile/edit/edit.component';
import { DocumentsComponent } from './pages/profile/documents/documents.component';
import { FilesComponent } from './pages/profile/documents/files/files.component';
import { PaymentComponent } from './pages/wallet/payment/payment.component';
import { OrderComponent } from './pages/wallet/order/order.component';
import { LoginComponent } from './auth/login/login.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { EspecialistaComponent } from './pages/especialista/especialista.component';
import { AuthGuard } from './guards/auth.guard';
import { PaymentmethodComponent } from './pages/profile/paymentmethod/paymentmethod.component';
import { BannerComponent } from './pages/admin/banner/banner.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    
    {path: 'favorites', component: FavoritesComponent},
    {path: 'search', component: SearchComponent},

    {path: 'especialidades', component: CategoriaComponent},
    {path: 'especialidad/:id', component: CategoriaComponent},
    {path: 'especialista/:id', component: EspecialistaComponent},
    
    {path: 'chat/:id', component: ChatComponent},
    
    //user
    {path: 'profile', component: ProfileComponent},
    {path: 'profile/settings', component: SettingsComponent},
    {path: 'profile/edit/:id', component: EditComponent},
    {path: 'profile/documents', component: DocumentsComponent},
    {path: 'profile/documents/file/:id', component: FilesComponent},
    
    {path: 'profile/paymentmethods', component: PaymentmethodComponent},
    
    {path: 'admin/banners', component: BannerComponent},

    //wallet
    {path: 'wallet', component: WalletComponent},
    {path: 'wallet-payment', component: PaymentComponent},
    {path: 'orders', component: OrderComponent},

    {path: '**', redirectTo: '', pathMatch: 'full'},
];
