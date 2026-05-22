import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit, AfterViewInit {
  @ViewChild('codeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  user: any = null;
  isDark = true;

  private codeBlocks = [
    { filename: 'views.py', lines: [
      { text: 'from django.views import View', color: '#7c6af7' },
      { text: 'from .models import Course', color: '#7c6af7' },
      { text: '', color: '' },
      { text: 'class CourseListView(View):', color: '#22d3a5' },
      { text: '  def get(self, request):', color: '#22d3a5' },
      { text: '    courses = Course.objects', color: '#e2e8f0' },
      { text: '      .filter(is_published=True)', color: '#e2e8f0' },
      { text: '      .order_by("-created_at")', color: '#86efac' },
      { text: '    return JsonResponse({', color: '#e2e8f0' },
      { text: '      "courses": list(courses),', color: '#86efac' },
      { text: '      "total": courses.count()', color: '#86efac' },
      { text: '    })', color: '#e2e8f0' },
    ]},
    { filename: 'models.py', lines: [
      { text: 'from django.db import models', color: '#7c6af7' },
      { text: '', color: '' },
      { text: 'class Course(models.Model):', color: '#22d3a5' },
      { text: '  title = models.CharField(max_length=200)', color: '#e2e8f0' },
      { text: '  description = models.TextField()', color: '#e2e8f0' },
      { text: '  is_published = models.BooleanField()', color: '#e2e8f0' },
      { text: '  created_at = models.DateTimeField()', color: '#e2e8f0' },
      { text: '', color: '' },
      { text: '  def __str__(self):', color: '#22d3a5' },
      { text: '    return self.title', color: '#86efac' },
    ]},
    { filename: 'serializers.py', lines: [
      { text: 'from rest_framework import serializers', color: '#7c6af7' },
      { text: 'from .models import Course', color: '#7c6af7' },
      { text: '', color: '' },
      { text: 'class CourseSerializer(serializers.ModelSerializer):', color: '#22d3a5' },
      { text: '  class Meta:', color: '#f59e0b' },
      { text: '    model = Course', color: '#e2e8f0' },
      { text: '    fields = [', color: '#e2e8f0' },
      { text: '      "id", "title",', color: '#86efac' },
      { text: '      "description", "is_published"', color: '#86efac' },
      { text: '    ]', color: '#e2e8f0' },
    ]},
  ];

  currentFilename = 'views.py';

  private currentBlock = 0;
  private currentLine = 0;
  private currentChar = 0;
  private displayLines: { text: string; color: string; done: boolean }[] = [];
  private animationId: any;

  constructor(private auth: AuthService, private theme: ThemeService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.theme.isDark$.subscribe(dark => this.isDark = dark);
  }

  ngAfterViewInit() {
    setTimeout(() => this.typeCode(), 0);
  }

  toggleTheme() {
    this.theme.toggle();
  }

  typeCode() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const lineHeight = 26;
    const startX = 24;
    const startY = 36;

    const type = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.displayLines.forEach((line, i) => {
        if (!line.text) return;
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.fillStyle = line.color || '#e2e8f0';
        ctx.globalAlpha = line.done ? 0.25 : 1;
        ctx.fillText(line.text, startX, startY + i * lineHeight);
      });

      ctx.globalAlpha = 1;

      const cursorLine = this.displayLines[this.currentLine];
      const cursorTextLen = cursorLine?.text?.length || 0;
      const cursorX = startX + cursorTextLen * 7.8;
      const cursorY = startY + this.currentLine * lineHeight;
      ctx.fillStyle = '#7c6af7';
      ctx.globalAlpha = Math.sin(Date.now() / 250) > 0 ? 0.8 : 0;
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
          this.animationId = setTimeout(type, 28 + Math.random() * 38);
        } else {
          this.currentLine++;
          this.currentChar = 0;
          this.animationId = setTimeout(type, targetLine.text === '' ? 60 : 160);
        }
      } else {
        this.animationId = setTimeout(() => {
          this.displayLines.forEach(l => l.done = true);
          this.animationId = setTimeout(() => {
            this.currentBlock = (this.currentBlock + 1) % this.codeBlocks.length;
            this.currentFilename = this.codeBlocks[this.currentBlock].filename;
            this.currentLine = 0;
            this.currentChar = 0;
            this.displayLines = [];
            type();
          }, 1200);
        }, 2500);
      }
    };

    type();
  }

  logout() {
    this.auth.logout();
  }
}
