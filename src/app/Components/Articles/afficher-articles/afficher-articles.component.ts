import { Component, OnInit } from '@angular/core';
import {SupprimerArticleComponent} from "../supprimer-article/supprimer-article.component";
import {ModifierArticleComponent} from "../modifier-article/modifier-article.component";
import {map} from "rxjs";
import {Article} from "../../../Entity/Article";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticleService} from "../../../Services/article-service.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ImageService} from "../../../Services/image.service";
import {UserAuthentificationService} from "../../../Services/user-authentification.service";

@Component({
  selector: 'app-afficher-articles',
  templateUrl: './afficher-articles.component.html',
  styleUrls: ['./afficher-articles.component.css']
})
export class AfficherArticlesComponent implements OnInit {
  disabled = false;
  articles:Article[]=[];
  public article: Article = {
    id: 0,
    titre: "",
    date_creation: "",
    description: "",
    sous_titre1: "",
    description1: "",
    sous_titre2: "",
    description2: "",
    sous_titre3: "",
    description3: "",
    sous_titre4: "",
    description4: "",
    sous_titre5: "",
    description5: "",
    image: {
      file: new File([], ""),
      url: ""
    },
  }
  role="";
  constructor(private articleService:ArticleService,
              private  router:Router,
              public dialog: MatDialog,
              private imageService: ImageService,
              private userAuthentificationService:UserAuthentificationService) { }

  ngOnInit(): void {
    this.getAllArticle();
    this.role = this.userAuthentificationService.getRole();
  }

  public getDetails(id: number) {
    this.router.navigate(['/detail-article'],{ queryParams: { id:id} });
    setTimeout(function(){
      window.location.reload();
    }, 1);
  }


  public validerSuppression(idArticle: number){
    this.dialog.open(SupprimerArticleComponent, {
      data:{
        id: idArticle
      },
    })
  }

  public modifier(idArticle: number){
    this.dialog.open(ModifierArticleComponent, {
      width: "800",
      height: "90vh",
      data:{
        id: idArticle
      },
    })
  }

  public getAllArticle() {
    this.articleService.getAllArticle()
        .pipe(
            map((x: any[], i) => x.map((article: Article) => this.imageService.createImage(article)))
        ).subscribe(
        (response: Article[]) => {
          this.articles =response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
    );
  }
}
