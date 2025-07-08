import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TransacaoBancaria} from "../../models/transacao-bancaria.model";


@Injectable({
  providedIn: 'root'
})
export class TransacaoBancariaService {

  private apiUrl = environment.apiUrl;


  constructor(
    private httpClient: HttpClient,
  ) {}

  cadastrar(transacaoBancaria : TransacaoBancaria){
    return this.httpClient.post(this.apiUrl + '/transacao-bancaria/inserir', transacaoBancaria);
  }

  editar(transacaoBancaria: TransacaoBancaria) {
    const id = transacaoBancaria.id;
    return this.httpClient.put(this.apiUrl + `/transacao-bancaria/editar/${id}`, transacaoBancaria);
  }

  excluir(transacaoBancaria: TransacaoBancaria) {
    const id = transacaoBancaria.id;
    return this.httpClient.delete(this.apiUrl + `/transacao-bancaria/excluir/${id}`);
  }

  buscarTodos() {
    return this.httpClient.get<TransacaoBancaria[]>(this.apiUrl + '/transacao-bancaria');
  }

  getUrlServicoUploadTransacaoBancaria(){
    return this.apiUrl + '/transacao-bancaria/importar-dados-bancarios';
  }

  buscarSaldoPorCompetencia(competencia: string) {
    return this.httpClient.get(this.apiUrl + `/transacao-bancaria/buscar-saldo-competencia/${competencia}`);
  }

}
