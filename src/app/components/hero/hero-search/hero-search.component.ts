import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {


  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // Envie um termo de pesquisa para o fluxo observável.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // aguarde 300ms após cada pressionamento de tecla antes de considerar o termo
      debounceTime(300),

      // ignore o novo termo se for igual ao termo anterior
      distinctUntilChanged(),

      // mude para nova pesquisa observável sempre que o termo for alterado
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}

