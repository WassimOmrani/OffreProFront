import { Component, OnInit } from '@angular/core';
import {UserAuthentificationService} from "../../Services/user-authentification.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../Services/image.service";
import {Notification} from "../../Entity/Notification";
import {NotificationService} from "../../Services/notification.service";
import {Recruteur} from "../../Entity/Recruteur";
import {Offres} from "../../Entity/Offres";
import {RecruteurService} from "../../Services/recruteur.service";
import {OffreService} from "../../Services/offre.service";
import {OffrePublicService} from "../../Services/offre-public.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    formatter = (result: string) => result.toUpperCase();


    public titre= "";
    public offresTitres:string[]=[];
    searchbytitre: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((term) =>
                term === '' ? [] : this.offresTitres.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
            ),
        );

  constructor(private userAuthentificationService:UserAuthentificationService,
              private router: Router,
              public dialog: MatDialog,
              private imageService:ImageService,
              private notificationService: NotificationService,
              private recruteurService: RecruteurService,
              private offreService:OffreService,
              private offrePublicService:OffrePublicService) { }

  public Offres = new Map<Offres,Recruteur>;
    public OffresRechercher = new Map<any,any>;
  public OffresVu = new Map<Offres,Recruteur>;

  public user: any={
    nom: "",
    prenom: "",
    mdp: "",
    mail: "",
    adresse: "",
    date_naissance: "",
    image: {
      file : new File([],""),
      url : ""
    },
    role: "",
    id: 0,
    offres: [],
    num_tel: 0,
    fonction: "",
    cv: {
      file : new File([],""),
      url : ""
    },
    lettre_motivation: {
      file : new File([],""),
      url : ""
    },
    competances: [],
    formations: [],
    notification: []

  }
  private idUser: number = 0;
  public role: string = "";
  public notifs: Notification[] = [];
  ngOnInit(): void {
    if (this.isLogedIn() && this.userAuthentificationService.getRole() != 'Admin'){
      this.getUser();
    }
    this.role= this.userAuthentificationService.getRole();

  }

  openDialog() {
    this.dialog.open(LoginComponent);
  }


  public isLogedIn(){
    return this.userAuthentificationService.isLoggedIn();
  }

  public afficherOffre(){
    this.router.navigate(['/offres']);
    setTimeout(function(){
      window.location.reload();
    }, 1);
  }

  public logout(){
    this.userAuthentificationService.clear();
    this.router.navigate(['/']);
    setTimeout(function(){
      window.location.reload();
    }, 1);
  }

  public afficherProfile() {
    this.idUser = this.userAuthentificationService.getUserId();
    this.router.navigate(['/profile'], { queryParams: { id: this.idUser }});
    setTimeout(function(){
      window.location.reload();
    }, 1);
  }

  public getUser(): void{
    this.userAuthentificationService.findUserById(this.userAuthentificationService.getUserId())
        .pipe(map(p => this.imageService.createImage(p)))
        .subscribe(
            (responce:any) => {
              this.user = responce;
              if (this.user.role == 'Condidat'){
                this.notificationService.findNotificationByIdCandidat(this.user.id)
                    .subscribe(
                        (responce:any[]) => {
                            console.log(responce)
                          for (let n of responce){
                            if (!n.vu){
                              this.notifs.push(n);
                              if (Number(n.offres)){
                                this.recruteurService.findRecruteurByIdOffre(n.offres)
                                    .pipe(map(p => this.imageService.createImage(p)))
                                    .subscribe(
                                        (responce:Recruteur) => {
                                          this.Offres.set(n.offres, responce);
                                        },
                                        (error: HttpErrorResponse) => {
                                          alert(error.message);
                                        }
                                    );
                              }else {
                                this.recruteurService.findRecruteurByIdOffre(n.offres.id)
                                    .pipe(map(p => this.imageService.createImage(p)))
                                    .subscribe(
                                        (responce:Recruteur) => {
                                          this.Offres.set(n.offres, responce);
                                        },
                                        (error: HttpErrorResponse) => {
                                          alert(error.message);
                                        }
                                    );

                              }

                            }
                            else {
                              if (Number(n.offres)){
                                this.recruteurService.findRecruteurByIdOffre(n.offres)
                                    .pipe(map(p => this.imageService.createImage(p)))
                                    .subscribe(
                                        (responce:Recruteur) => {
                                          this.OffresVu.set(n.offres, responce);
                                        },
                                        (error: HttpErrorResponse) => {
                                          alert(error.message);
                                        }
                                    );
                              }else {
                                this.recruteurService.findRecruteurByIdOffre(n.offres.id)
                                    .pipe(map(p => this.imageService.createImage(p)))
                                    .subscribe(
                                        (responce:Recruteur) => {
                                          this.OffresVu.set(n.offres, responce);
                                        },
                                        (error: HttpErrorResponse) => {
                                          alert(error.message);
                                        }
                                    );

                              }

                            }
                          }
                        },
                        (error: HttpErrorResponse) => {
                          alert(error.message);
                        }
                    );
              }
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
        );
  }

  public getDetails(idO: number, idR: number,notifications: Notification[]) {
    for (let notification of notifications){
      this.notificationService.notificationVu(notification.id)
          .subscribe(
              (responce:any) => {
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              }
          );
    }
    this.router.navigate(['/detailOffre'], { queryParams: { idO: idO , idR: idR} });
    setTimeout(function(){
      window.location.reload();
    }, 1);
  }


  public notification_verif(n: Notification[]){
    if (n.length==0)
      return true;
    return false;
  }


    public getRecruteurs(): void{
        this.recruteurService.getRecruteurs()
            .pipe(
                map((x: any[], i) => x.map((recruteur: Recruteur) => this.imageService.createImage(recruteur)))
            )
            .subscribe(
                (responce:any[]) => {
                    for (let rec of responce){
                        for (let ofr of rec.offres){
                            if (Number(ofr)){
                                this.offreService.findOffreById(ofr).subscribe(
                                    (responce: any)=>{
                                        responce.type = 'Prive'
                                        this.OffresRechercher.set(responce,rec);
                                        this.offresTitres.push(responce.titre);
                                    },(error: HttpErrorResponse)=>{
                                        alert(error.message);
                                    }
                                );
                            }
                            else {
                                ofr.type = 'Prive'
                                this.OffresRechercher.set(ofr,rec);
                                this.offresTitres.push(ofr.titre);
                            }
                        }
                    }
                    this.offrePublicService.getOffresLikedin()
                        .subscribe(
                            (responce:any[]) => {
                                for (let ofr of responce){
                                    ofr.type = 'Linkedin'
                                    this.OffresRechercher.set(ofr,'linkedin');
                                    this.offresTitres.push(ofr.title);
                                }

                            },
                            (error: HttpErrorResponse) => {

                            });
                    this.offrePublicService.getOffresOptioncarrier()
                        .subscribe(
                            (responce:any[]) => {
                                for (let ofr of responce){
                                    ofr.type = 'Optioncarrier'
                                    this.OffresRechercher.set(ofr,'Optioncarrier');
                                    this.offresTitres.push(ofr.title);
                                }

                            },
                            (error: HttpErrorResponse) => {

                            });
                    this.offrePublicService.getOffresKeejob()
                        .subscribe(
                            (responce:any[]) => {
                                for (let ofr of responce){
                                    ofr.type = 'Keejob'
                                    this.OffresRechercher.set(ofr,'Keejob');
                                    this.offresTitres.push(ofr.title);
                                }

                            },
                            (error: HttpErrorResponse) => {

                            });
                    console.log(this.OffresRechercher)

                },
                (error: HttpErrorResponse) => {
                    alert(error.message);
                });
    }
}
