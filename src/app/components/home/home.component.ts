import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string;
  public games: Array<Game>;
  private routeSub: Subscription;
  private gameSub: Subscription;

  constructor(
    // service we created
    private httpService: HttpService,

    //roter for going to description of the game
    private router: Router,

    // angular service
    private activatedRoute : ActivatedRoute) { }

    //ngOnInit runs first when we
    // run the components
  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params)=>{
      if(params['game-search']){
        this.searchGames('metacrit', params['game-search']);
      } 
      else{
        this.searchGames('metacrit');
      }
    });
  }

  //search is required -> search?
  searchGames(sort:string, search?: string): void{
    this.gameSub = this.httpService
    .getGameList(sort, search)
    .subscribe((gameList: APIResponse<Game>)=>{
      this.games = gameList.results;
      console.log(gameList);
    });
  }

  openGameDetails(id: string): void{
    this.router.navigate(['details', id]);
  }  
  ngOnDestroy():void{
    if(this.gameSub)
    {
      this.gameSub.unsubscribe();
    }
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
