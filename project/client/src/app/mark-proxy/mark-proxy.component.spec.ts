import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkProxyComponent } from './mark-proxy.component';

describe('MarkProxyComponent', () => {
  let component: MarkProxyComponent;
  let fixture: ComponentFixture<MarkProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
