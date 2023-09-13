import {Component, OnInit} from '@angular/core';
import {OffrePublicService} from "../../../Services/offre-public.service";
import {HttpErrorResponse} from "@angular/common/http";
import {OffresPublic} from "../../../Entity/OffresPublic";
import {NgForm} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";
import {Recruteur} from "../../../Entity/Recruteur";


@Component({
    selector: 'app-afficher-offres-linkedin',
    templateUrl: './afficher-offres-linkedin.component.html',
    styleUrls: ['./afficher-offres-linkedin.component.css']
})
export class AfficherOffresLinkedinComponent implements OnInit {

    formatter = (result: string) => result.toUpperCase();

    searchbyTitre: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((term) =>
                term === '' ? [] : this.offretitres.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
            ),
        );
    centered = false;
    unbounded = false;
    checked = false;
    disabled = false;
    public OffresPublic: OffresPublic[] = [];

    constructor(private offrePublicService: OffrePublicService) {
    }


    p: number = 1;

    public erreure: string = "";

    ngOnInit(): void {
        this.getOffresPublic();
    }

    public getOffresPublic(): void {
        this.offrePublicService.getOffresLikedin()
            .subscribe(
                (responce: OffresPublic[]) => {
                    this.OffresPublic = responce;
                    for (let t of responce) {
                        this.offretitres.push(t.title);
                    }
                },
                (error: HttpErrorResponse) => {
                    this.erreure = "Erreure lors de chargement"
                });
    }

    public visiter(url: string) {
        window.open(url);
    }

    public Offres: OffresPublic[] = [];
    public titre = "";

    public offretitres: string[] = [];

    public chercherPrive(offres: OffresPublic[]) {

        this.OffresPublic = [];
        for (let ofr of offres) {
            if (ofr.title.toUpperCase() == this.titre.toUpperCase())
                this.OffresPublic.push(ofr);
        }

    }
}
