import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';

import { MessageService } from '../messages/service/message.service';
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** GET heróis do servidor */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('heróis buscados')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** GET herói por id. Será 404 se o ID não for encontrado */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`herói buscado com a id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: atualize o herói no servidor */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`herói id=${hero.id} atualizado`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: adicione um novo herói ao servidor */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`herói id=${newHero.id} adicionado`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: excluir o herói do servidor */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`herói id=${id} excluído`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heróis cujo nome contém termo de pesquisa */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // se não pesquisar o termo, retorne uma matriz de heróis vazia.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }



  /** Registrar uma mensagem HeroService com o MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Lidar com a operação Http que falhou.
   * Deixe o aplicativo continuar.
   * @param operation - nome da operação que falhou
   * @param result - valor opcional a ser retornado como resultado observável
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: envie o erro para a infraestrutura de log remoto
      console.error(error); // faça log no console

      // TODO: melhor trabalho de transformação de erro para consumo do usuário
      this.log(`${operation} Erro: ${error.message}`);

      // Deixe o aplicativo continuar em execução retornando um resultado vazio.
      return of(result as T);
    };
  }


  textFormatDefault(str) {
    //pega apenas as palavras e tira todos os espaços em branco.
    return str.replace(/\w\S*/g, function(str) {
      //passa o primeiro caractere para maiusculo, e adiciona o todo resto minusculo
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    })/* .trim() */;
   }

}
