import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../services/user/user.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthRequest } from 'src/app/models/interface/auth/AuthRequest';
import { signupUserReq } from 'src/app/models/interface/user/SignupUserReq';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, AfterViewInit {
  @ViewChild('emailInput') public emailInputRef!: ElementRef;
  @ViewChild('passwordInput') public passworInputRef!: ElementRef;


  loginCard: boolean = true;
  private destroy$ = new Subject<void>();
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {

  }
  ngAfterViewInit(): void {
    //view child
    // this.emailInputRef.nativeElement.value = 'seu emai aqui';
    // console.log(this.emailInputRef.nativeElement.value)
    // console.log(this.passworInputRef.nativeElement)
  }

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (Response) => {
            if (Response) {
              this.cookieService.set('USER_INFO', Response?.token);
              this.loginForm.reset();
              this.router.navigate(['/dashboard']);
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${Response?.name}`,
                life: 2000,
              })
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'erro',
              detail: `Erro ao fazer login`,
              life: 2000,
            });
            console.log(err);
          },
        });
    }
  }
  onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signupUser(this.signUpForm.value as signupUserReq)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response)
              this.signUpForm.reset();
            this.loginCard = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Usuario criado com sucesso`,
              life: 2000,
            })
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'erro',
              detail: `Erro  ao criar o usuário`,
              life: 2000,
            });
            console.log(err);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
