import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostBinding } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('codeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @HostBinding('class.light') get isLight() { return !this.isDark; }

  email = '';
  password = '';
  error = '';
  isDark = true;

  private codeBlocks = [
    { lines: [
      { text: 'from django.db import models', color: '#7c6af7' },
      { text: '', color: '' },
      { text: 'class Course(models.Model):', color: '#22d3a5' },
      { text: '    title = models.CharField(max_length=200)', color: '#e2e8f0' },
      { text: '    description = models.TextField()', color: '#e2e8f0' },
      { text: '    created_at = models.DateTimeField(auto_now_add=True)', color: '#e2e8f0' },
      { text: '', color: '' },
      { text: '    def __str__(self):', color: '#22d3a5' },
      { text: '        return self.title', color: '#86efac' },
    ]},
    { lines: [
      { text: 'from rest_framework import serializers', color: '#7c6af7' },
      { text: 'from .models import Course', color: '#7c6af7' },
      { text: '', color: '' },
      { text: 'class CourseSerializer(serializers.ModelSerializer):', color: '#22d3a5' },
      { text: '    class Meta:', color: '#f59e0b' },
      { text: '        model = Course', color: '#e2e8f0' },
      { text: '        fields = ["id", "title", "description"]', color: '#86efac' },
    ]},
    { lines: [
      { text: 'urlpatterns = [', color: '#e2e8f0' },
      { text: '    path("admin/", admin.site.urls),', color: '#94a3b8' },
      { text: '    path("api/", include("courses.urls")),', color: '#94a3b8' },
      { text: '    path("api/auth/", include("users.urls")),', color: '#94a3b8' },
      { text: ']', color: '#e2e8f0' },
      { text: '', color: '' },
      { text: 'REST_FRAMEWORK = {', color: '#e2e8f0' },
      { text: '    "DEFAULT_AUTHENTICATION_CLASSES": [', color: '#94a3b8' },
      { text: '        "rest_framework_simplejwt.authentication.JWTAuthentication"', color: '#86efac' },
      { text: '    ]', color: '#94a3b8' },
      { text: '}', color: '#e2e8f0' },
    ]},
  ];

  private currentBlock = 0;
  private currentLine = 0;
  private currentChar = 0;
  private displayLines: { text: string; color: string; done: boolean }[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private theme: ThemeService,
  ) {}

  ngOnInit() {
    this.theme.isDark$.subscribe(dark => this.isDark = dark);
  }

  ngAfterViewInit() {
    this.typeCode();
  }

  toggleTheme() {
    this.theme.toggle();
  }

  typeCode() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const fontSize = 14;
    const lineHeight = 28;
    const startX = 60;
    const startY = 100;

    const type = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.displayLines.forEach((line, i) => {
        if (!line.text) return;
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.fillStyle = this.isDark ? (line.color || '#e2e8f0') : (line.color || '#1e293b');
        ctx.globalAlpha = line.done ? 0.15 : (this.isDark ? 0.6 : 0.25);
        ctx.fillText(line.text, startX, startY + i * lineHeight);
      });

      ctx.globalAlpha = 1;

      const cursorTextLen = this.displayLines[this.currentLine]?.text?.length || 0;
      const cursorX = startX + cursorTextLen * 8.4;
      const cursorY = startY + this.currentLine * lineHeight;
      ctx.fillStyle = '#7c6af7';
      ctx.globalAlpha = Math.sin(Date.now() / 250) > 0 ? 0.6 : 0;
      ctx.fillRect(cursorX, cursorY - fontSize, 2, fontSize + 4);
      ctx.globalAlpha = 1;

      const block = this.codeBlocks[this.currentBlock];

      if (this.currentLine < block.lines.length) {
        const targetLine = block.lines[this.currentLine];

        if (!this.displayLines[this.currentLine]) {
          this.displayLines[this.currentLine] = { text: '', color: targetLine.color, done: false };
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
        this.auth.setUser({ email: this.email });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Невірний email або пароль';
      }
    });
  }
}
