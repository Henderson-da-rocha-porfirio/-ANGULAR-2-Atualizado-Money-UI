import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  pt: any;
  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos = [];
  @ViewChild('tabela') grid;

  constructor(
    private lancamentoService: LancamentoService,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title
    ) { }

  ngOnInit() {

    this.pt = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      // tslint:disable-next-line: max-line-length
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    };

    this.title.setTitle('Pesquisa de lançamentos');
  }
  pesquisar(pagina = 0) {

    this.filtro.pagina = pagina;
    // Correção para a pesquisar forçar o retorno para a primeira página.
    // if (this.filtro.pagina === 0) {
    //   this.grid.first = 0;
    // }

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
}

aoMudarPagina(event: LazyLoadEvent) {
  const pagina = event.first / event.rows;
  this.pesquisar(pagina);
}

confirmarExclusao(lancamento: any) {
  this.confirmation.confirm({
    message: 'Tem certeza que deseja excluir?',
    accept: () => {
      this.excluir(lancamento);
    }
  });

}

excluir(lancamento: any) {
  this.lancamentoService.excluir(lancamento.codigo)
    .then(() => {
      if (this.grid.first === 0) {
        this.pesquisar();
      } else {
      this.grid.first = 0;
      }

      this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
    })
    .catch(erro => this.errorHandler.handle(erro));
}


}
