import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProxyComponent } from './view-proxy.component';

describe('ViewProxyComponent', () => {
  let component: ViewProxyComponent;
  let fixture: ComponentFixture<ViewProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
