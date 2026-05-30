import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostBinding } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('codeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @HostBinding('class.light') get isLight() {
    return !this.isDark;
  }

  email = '';
  password = '';
  error = '';
  isDark = true;

  private codeBlocks = [
    {
      lines: [
        {text: 'from django.db import models', color: '#7c6af7'},
        {text: '', color: ''},
        {text: 'class Course(models.Model):', color: '#22d3a5'},
        {text: '    title = models.CharField(max_length=200)', color: '#e2e8f0'},
        {text: '    description = models.TextField()', color: '#e2e8f0'},
        {text: '    created_at = models.DateTimeField(auto_now_add=True)', color: '#e2e8f0'},
        {text: '', color: ''},
        {text: '    def __str__(self):', color: '#22d3a5'},
        {text: '        return self.title', color: '#86efac'},
      ]
    },
    {
      lines: [
        {text: 'from rest_framework import serializers', color: '#7c6af7'},
        {text: 'from .models import Course', color: '#7c6af7'},
        {text: '', color: ''},
        {text: 'class CourseSerializer(serializers.ModelSerializer):', color: '#22d3a5'},
        {text: '    class Meta:', color: '#f59e0b'},
        {text: '        model = Course', color: '#e2e8f0'},
        {text: '        fields = ["id", "title", "description"]', color: '#86efac'},
      ]
    },
    {
      lines: [
        {text: 'urlpatterns = [', color: '#e2e8f0'},
        {text: '    path("admin/", admin.site.urls),', color: '#94a3b8'},
        {text: '    path("api/", include("courses.urls")),', color: '#94a3b8'},
        {text: '    path("api/auth/", include("users.urls")),', color: '#94a3b8'},
        {text: ']', color: '#e2e8f0'},
        {text: '', color: ''},
        {text: 'REST_FRAMEWORK = {', color: '#e2e8f0'},
        {text: '    "DEFAULT_AUTHENTICATION_CLASSES": [', color: '#94a3b8'},
        {text: '        "rest_framework_simplejwt.authentication.JWTAuthentication"', color: '#86efac'},
        {text: '    ]', color: '#94a3b8'},
        {text: '}', color: '#e2e8f0'},
      ]
    },
  ];

  private currentBlock = 0;
  private currentLine = 0;
  private currentChar = 0;
  private displayLines: { text: string; color: string; done: boolean }[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private theme: ThemeService,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.theme.isDark$.subscribe(dark => this.isDark = dark);
  }

  ngAfterViewInit() {
    this.typeCode();
    this.initGoogle();
  }

  private initGoogle() {
    const waitForGoogle = () => {
      if (typeof (window as any).google !== 'undefined') {
        this.auth.initGoogleLogin((credential) => {
          this.auth.loginWithGoogle(credential).subscribe({
            next: (res:{access: string; refresh: string }) => {
              this.auth.setTokens(res.access, res.refresh);
              this.api.getMe().subscribe(user => {
                this.auth.setUser(user);
                this.router.navigate(['/dashboard']);
              });
            },
            error: () => {
              this.error = 'Помилка входу через Google';
            }
          });
        });
      } else {
        setTimeout(waitForGoogle, 100);
      }
    };

    waitForGoogle();
  }

  onGoogleLogin() {
    (window as any).google.accounts.id.prompt();
  }

  toggleTheme() {
    this.theme.toggle();
  }

  private getColor(color: string): string {
    if (!color) return this.isDark ? '#e2e8f0' : '#1e293b';
    if (!this.isDark) {
      const lightMap: Record<string, string> = {
        '#7c6af7': '#5b4dd4',
        '#22d3a5': '#0d7a5f',
        '#e2e8f0': '#1e293b',
        '#94a3b8': '#475569',
        '#f59e0b': '#b45309',
        '#86efac': '#166534',
        '#f87171': '#b91c1c',
      };
      return lightMap[color] || '#1e293b';
    }
    return color;
  }

  private getCursorColor(): string {
    return this.isDark ? '#7c6af7' : '#5b4dd4';
  }

  typeCode() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const lineHeight = 28;
    const startX = 60;
    const startY = 100;

    const type = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.displayLines.forEach((line, i) => {
        if (!line.text) return;
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.fillStyle = this.getColor(line.color);
        ctx.globalAlpha = line.done ? (this.isDark ? 0.35 : 0.45) : 1;
        ctx.fillText(line.text, startX, startY + i * lineHeight);
      });

      ctx.globalAlpha = 1;

      const cursorTextLen = this.displayLines[this.currentLine]?.text?.length || 0;
      const cursorX = startX + cursorTextLen * 8.4;
      const cursorY = startY + this.currentLine * lineHeight;
      ctx.fillStyle = this.getCursorColor();
      ctx.globalAlpha = Math.sin(Date.now() / 250) > 0 ? 0.6 : 0;
      ctx.fillRect(cursorX, cursorY - fontSize, 2, fontSize + 4);
      ctx.globalAlpha = 1;

      const block = this.codeBlocks[this.currentBlock];

      if (this.currentLine < block.lines.length) {
        const targetLine = block.lines[this.currentLine];

        if (!this.displayLines[this.currentLine]) {
          this.displayLines[this.currentLine] = {text: '', color: targetLine.color, done: false};
        }

        if (this.currentChar < targetLine.text.length) {
          this.displayLines[this.currentLine].text = targetLine.text.slice(0, this.currentChar + 1);
          this.currentChar++;
          setTimeout(type, 30 + Math.random() * 40);
        } else {
          this.currentLine++;
          this.currentChar = 0;
          setTimeout(type, targetLine.text === '' ? 80 : 180);
        }
      } else {
        setTimeout(() => {
          this.displayLines.forEach(l => l.done = true);
          setTimeout(() => {
            this.currentBlock = (this.currentBlock + 1) % this.codeBlocks.length;
            this.currentLine = 0;
            this.currentChar = 0;
            this.displayLines = [];
            type();
          }, 1500);
        }, 2500);
      }
    };

    type();
  }

  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.setTokens(res.access, res.refresh);
        this.auth.setUser({email: this.email});
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Невірний email або пароль';
      }
    });
  }
}
