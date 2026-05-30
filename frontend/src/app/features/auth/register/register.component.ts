import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostBinding } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('codeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @HostBinding('class.light') get isLight() { return !this.isDark; }

  email = '';
  username = '';
  password = '';
  password2 = '';
  error = '';
  isDark = true;

  private lightMap: Record<string, string> = {
    '#7c6af7': '#5b4dd4',
    '#22d3a5': '#0d7a5f',
    '#e2e8f0': '#1e293b',
    '#94a3b8': '#475569',
    '#f59e0b': '#b45309',
    '#86efac': '#166534',
    '#f87171': '#b91c1c',
  };

  private codeBlocks = [
    { lines: [
      { text: 'from django.contrib.auth.models import AbstractUser', color: '#7c6af7' },
      { text: '', color: '' },
      { text: 'class CustomUser(AbstractUser):', color: '#22d3a5' },
      { text: '    email = models.EmailField(unique=True)', color: '#e2e8f0' },
      { text: '    username = models.CharField(max_length=50)', color: '#e2e8f0' },
      { text: '    created_at = models.DateTimeField(auto_now_add=True)', color: '#e2e8f0' },
      { text: '', color: '' },
      { text: '    USERNAME_FIELD = "email"', color: '#f59e0b' },
      { text: '    REQUIRED_FIELDS = ["username"]', color: '#86efac' },
    ]},
    { lines: [
      { text: 'class RegisterSerializer(serializers.ModelSerializer):', color: '#22d3a5' },
      { text: '    password = serializers.CharField(write_only=True)', color: '#e2e8f0' },
      { text: '    password2 = serializers.CharField(write_only=True)', color: '#e2e8f0' },
      { text: '', color: '' },
      { text: '    def validate(self, data):', color: '#f59e0b' },
      { text: '        if data["password"] != data["password2"]:', color: '#94a3b8' },
      { text: '            raise serializers.ValidationError("Passwords mismatch")', color: '#f87171' },
      { text: '        return data', color: '#86efac' },
    ]},
    { lines: [
      { text: 'class RegisterView(generics.CreateAPIView):', color: '#22d3a5' },
      { text: '    queryset = CustomUser.objects.all()', color: '#e2e8f0' },
      { text: '    serializer_class = RegisterSerializer', color: '#e2e8f0' },
      { text: '    permission_classes = [AllowAny]', color: '#f59e0b' },
      { text: '', color: '' },
      { text: '    def create(self, request, *args, **kwargs):', color: '#22d3a5' },
      { text: '        serializer = self.get_serializer(data=request.data)', color: '#94a3b8' },
      { text: '        serializer.is_valid(raise_exception=True)', color: '#94a3b8' },
      { text: '        user = serializer.save()', color: '#86efac' },
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

  private getColor(color: string): string {
    if (!color) return this.isDark ? '#e2e8f0' : '#1e293b';
    return this.isDark ? color : (this.lightMap[color] || '#1e293b');
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
    this.auth.register(this.email, this.username, this.password, this.password2).subscribe({
      next: (res: any) => {
        this.auth.setTokens(res.access, res.refresh);
        this.auth.setUser(res.user);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Помилка реєстрації. Перевір дані.';
      }
    });
  }
}
