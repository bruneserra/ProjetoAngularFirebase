import { Component } from '@angular/core';
import { AdminCrudService } from '../services/admin-crud.service';
import { AuthenticateService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private crudService: AdminCrudService,
    private authService: AuthenticateService
  ) { }
    fazerLogin(dados: any)  {
      this.authService.login(dados.email, dados.senha);
    }

    criarConta(dados: any){
    this.authService.register(dados.email, dados.senha)
    }

    inserirAluno(dados: any){
      this.crudService.insert(dados, 'alunos')
    }

    removerAluno(){
      this.crudService.remove('1','alunos');
    }
}