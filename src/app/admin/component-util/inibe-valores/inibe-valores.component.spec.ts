import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InibeValoresComponent } from './inibe-valores.component';

describe('InibeValoresComponent', () => {
  let component: InibeValoresComponent;
  let fixture: ComponentFixture<InibeValoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InibeValoresComponent]
    });
    fixture = TestBed.createComponent(InibeValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
