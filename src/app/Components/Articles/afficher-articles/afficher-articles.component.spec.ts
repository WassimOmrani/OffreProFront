import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherArticlesComponent } from './afficher-articles.component';

describe('AfficherArticlesComponent', () => {
  let component: AfficherArticlesComponent;
  let fixture: ComponentFixture<AfficherArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficherArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
