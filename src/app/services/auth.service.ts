import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})

export class AuthenticateService {
    duration: number = 2000;
    message: string = 'Erro inesperado';

    private forbidAccess: boolean = false;
    
    private _isLoading = false;
    public get isLoading() {
        return this._isLoading;
    }
    public set isLoading(value) {
        this._isLoading = value;
    }

    constructor( 
        public auth: Auth,
        private _message: MessageService,
        private _router: Router,
    ) { }
    
    /*
    * @description: Register a new user
    * @param email: string
    * @param password: string
    * @return: Promise<any>
    * */
    public async register(email: string, password: string): Promise<boolean> {
        this.isLoading = true;
        createUserWithEmailAndPassword(this.auth, email, password)
        .then(() => {
            this.redirectTo('/login');
        })
        .catch((_: any) => {
            this.showErro(_, email, password);
        })
        .finally(() => {
            this.isLoading = false;
        });

        return;
    };

    /*
    * @description: Login a user
    * @param email: string
    * @param password: string
    * @return: Promise<any>
    * */
    public async login(email: string, password: string): Promise<boolean>{
        this.isLoading = true;

        signInWithEmailAndPassword(this.auth, email, password)
        .then((response: any) => {
            this.storeUserData(response.user);
            setTimeout(() => {
                this.forbidAccess = true;
                this.storeUserData(response.user);
                this.redirectUserToBoard(response.user);
            }, 1000);
        })
        .catch((_: any) => {
            this.showErro(_, email, password);
        })
        .finally(() => {
            this.isLoading = false;
        });

        return;
    }

    isUserAuthenticated(){
        return this.forbidAccess;
    }

    /*
    * @description: Redirect to page
    * @param page: string
    * */
    redirectTo(page: string){
        this._router.navigate([page]);
    }

    /*
    * @description: Store user data
    * @param user: any response from firebase
    * */
    storeUserData(user: any){
        localStorage.setItem('user', JSON.stringify(user));
    }

    /*
    * @description: Show error message
    * @param error: any response from firebase
    * @param email: string
    */
    showErro(_: any, email: string, password: string){
        if (_.code == 'auth/too-many-requests') this.message = 'VocÃª realizou muitas tentativas de login. Tente novamente mais tarde.';
        if (_.code == 'auth/user-not-found') this.message = 'UsuÃ¡rio nÃ£o encontrado.';
        if (_.code == 'auth/wrong-password') this.message = 'Senha incorreta.';
        if (_.code == 'auth/weak-password') this.message = 'A senha deve conter no mÃ­nimo 6 caracteres.';
        if (_.code == 'auth/email-already-in-use') this.message = 'Este e-mail jÃ¡ estÃ¡ em uso.';
        if (_.code == 'auth/missing-email') this.message = 'E-mail nÃ£o informado.';
        if (!!!email) this.message = 'Preencha o e-mail.';
        if (!!!password) this.message = 'Preencha a senha com 6 caracteres.';
        this._message.show(this.message, this.duration);
    }

    /*
    * @description: Redirect user to own board
    * */
    redirectUserToBoard(user){
        if (user.uid == 'CRrIjNoMrcVjpfcArWBrAxtac603') {
            this.redirectTo('/admin-home');
            return;
        }

        this._router.navigate(['../user-home', {uid: user.uid}]);
    }

    /*
    * @description: Check if user is admin
    * */
    isAdmin() {
        const user = this.getUserData();
        if (user.uid != 'DAsIA1GcgqcEO1QEXIJraV5y1c33') {
            // this.redirectTo('/login');
            return false;
        }
        return true;
    }

    /*
    * @description: Get storaged user data
    * @param error: false
    */
    getUserData(): any {
        if (localStorage.getItem('user')) return JSON.parse(localStorage.getItem('user'));
        this.redirectTo('/login');
    }

}