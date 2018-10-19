import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestProxyComponent } from './request-proxy.component';

describe('RequestProxyComponent', () => {
  let component: RequestProxyComponent;
  let fixture: ComponentFixture<RequestProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
