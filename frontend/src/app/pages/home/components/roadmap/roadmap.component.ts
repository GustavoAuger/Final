import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Point {
  x: number;
  y: number;
  angle: number; // Ángulo de la tangente de la pista
}

interface SprintDetail {
  week: number;
  title: string;
  description: string;
}

interface CarPosition {
  x: number;
  y: number;
  angle: number;
  scale: number;
}
interface SprintDetail {
  week: number;
  title: string;
  description: string;
  link?: string;  // Agrega link opcional
}

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RoadmapComponent implements OnInit, OnDestroy {
  @Input() currentWeek: number = 1; 
  @Input() totalWeeks: number = 8;
  @Input() sprintDetails: SprintDetail[] = [];
  

  weeks: number[] = [];
  selectedSprint: SprintDetail | null = null;
  trackPoints: Point[] = [];
  innerTrackPoints: Point[] = [];
  outerTrackPoints: Point[] = [];
  
  public carPosition: CarPosition = { x: 0, y: 0, angle: 0, scale: 1 };
  
  private pathQueue: number[] = []; // Cola de índices de sprint a recorrer
  private currentSegmentStart: number = 0;
  private currentSegmentEnd: number = 0;
  public animationProgress: number = 0;
  private readonly ANIMATION_DURATION = 800; // Duración por segmento en ms
  private animationStartTime: number = 0;
  
  // Ángulos de compensación (el coche parece rotar sobre sí mismo)
  private readonly ANGLE_ODD = -60; // Ángulo para sprints impares (1, 3, 5...)
  private readonly ANGLE_EVEN = 40; // Ángulo para sprints pares (2, 4, 6...)

  private currentOffsetAngle: number = 0;
  private targetOffsetAngle: number = 0;
  
  private readonly TRACK_WIDTH = 5;
  private readonly STEPS = 300;
  private readonly AMPLITUDE = 15;
  private readonly WAVES = 4;
  private animationFrameId: number | null = null;
  private isAnimating: boolean = false;

  ngOnInit() {
    this.totalWeeks = this.sprintDetails.length || this.totalWeeks;
    this.weeks = Array(this.totalWeeks).fill(0).map((_, i) => i + 1);
    this.initializeTrack();
    this.updateSelectedSprint();
    
    const initialPoints = this.getSprintPoints();
    if (initialPoints.length > 0) {
      // Inicializar el offset de rotación para el punto de inicio (Semana 1 es impar)
      const initialOffset = this.getOffsetAngle(0); 
      
      this.carPosition.x = initialPoints[0].x;
      this.carPosition.y = initialPoints[0].y;
      this.carPosition.angle = initialPoints[0].angle + initialOffset + 90; // Pista + Offset + Corrección de diseño (90)
      
      this.currentOffsetAngle = initialOffset;
      this.targetOffsetAngle = initialOffset;
      
      this.currentSegmentStart = 0;
      this.currentSegmentEnd = 0;
    }

    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startAnimation(): void {
    const animate = (timestamp: number) => {
      if (this.isAnimating) {
        this.updateAnimationProgress(timestamp);
      }
      this.updateCarPosition();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private generatePath(from: number, to: number): number[] {
    const path: number[] = [];
    const direction = from < to ? 1 : -1;
    
    let current = from;
    while (current !== to) {
      path.push(current);
      current += direction;
    }
    path.push(to); 
    
    return path;
  }

  private updateAnimationProgress(timestamp: number): void {
    if (this.animationStartTime === 0) {
      this.animationStartTime = timestamp;
    }

    const elapsed = timestamp - this.animationStartTime;
    const rawProgress = Math.min(elapsed / this.ANIMATION_DURATION, 1);
    
    this.animationProgress = this.easeInOutCubic(rawProgress);
    
    if (rawProgress >= 1) {
      this.animationProgress = 1;
      this.animationStartTime = 0;
      
      if (this.pathQueue.length > 0) {
        this.currentSegmentStart = this.currentSegmentEnd;
        this.currentSegmentEnd = this.pathQueue.shift()!;
        this.animationProgress = 0;
      } else {
        this.isAnimating = false;
        this.animationProgress = 1;
        // Al terminar, el offset actual se actualiza al final
        this.currentOffsetAngle = this.targetOffsetAngle; 
      }
    }
  }

 private normalizeAngleDiff(angle: number): number {
  // Asegura que el ángulo esté en el rango (-180, 180]
  while (angle > 180) angle -= 360;
  while (angle <= -180) angle += 360; 
  return angle;
}
  
  
  private getOffsetAngle(weekIndex: number): number {
    // Usamos el índice del sprint (0-basado) + 1 para obtener el número de semana
    const weekNumber = weekIndex + 1;
    
    // Si el número de semana es PAR (2, 4, 6...) -> 20 grados
    if (weekNumber % 2 === 0) {
      return this.ANGLE_EVEN;
    } 
    // Si el número de semana es IMPAR (1, 3, 5...) -> 140 grados
    else {
      return this.ANGLE_ODD;
    }
  }
  

  private updateCarPosition(): void {
  const points = this.getSprintPoints();
  
  // Obtener los ángulos de offset objetivo para el inicio y el fin del segmento
  const startOffset = this.getOffsetAngle(this.currentSegmentStart);
  const endOffset = this.getOffsetAngle(this.currentSegmentEnd);
  
  if (!this.isAnimating && this.pathQueue.length === 0) {
    const currentPoint = points[this.currentSegmentEnd];
    if (currentPoint) {
 
      let finalPistaAngle = currentPoint.angle;
      if (this.currentSegmentStart > this.currentSegmentEnd) {
         finalPistaAngle = this.normalizeAngleDiff(finalPistaAngle + 180);
      }
      
      this.carPosition.x = currentPoint.x;
      this.carPosition.y = currentPoint.y;
      this.carPosition.angle = finalPistaAngle + endOffset + 90; // Pista + Offset + 90
      this.carPosition.scale = 1;
    }
    return;
  }

  const point1 = points[this.currentSegmentStart];
  const point2 = points[this.currentSegmentEnd];
  
  if (!point1 || !point2) return;

  const t = this.animationProgress;

  // 1. Interpolación suave de posición (XY)
  const targetX = point1.x + (point2.x - point1.x) * t;
  const targetY = point1.y + (point2.y - point1.y) * t;

  // 2. Lógica para manejar el ángulo de la pista (TANGENTE)
  let angleA = point1.angle;
  let angleB = point2.angle;
  
  // **Ajuste de Dirección de Movimiento:** Si vamos hacia atrás, invertimos el ángulo de la pista (180 grados).
  // La función normalizeAngleDiff asegura que no haya giros de 360 grados.
  if (this.currentSegmentStart > this.currentSegmentEnd) {
    angleA = this.normalizeAngleDiff(angleA - 110); // Invertir el punto de inicio
    angleB = this.normalizeAngleDiff(angleB + 180); // Invertir el punto de destino
  }

  // Ahora, calculamos la diferencia de ángulo (cuánto tiene que girar la pista)
  let angleDiffPista = this.normalizeAngleDiff(angleB - angleA);
  const interpolatedPistaAngle = angleA + angleDiffPista * t;
  
  // 3. Interpolación del ángulo de offset (la rotación extra)
  let angleDiffOffset = this.normalizeAngleDiff(endOffset - startOffset);
  const interpolatedOffsetAngle = startOffset + angleDiffOffset * t;
  
  // 4. Ángulo final (Pista + Offset + Corrección de diseño del coche)
  const finalAngle = interpolatedPistaAngle + interpolatedOffsetAngle + 90;

  // 5. Escala dinámica
  const curveIntensity = Math.abs(angleDiffPista) / 180; 
  const maxScale = 1.2;
  const scaleEffect = Math.sin(t * Math.PI); 
  const targetScale = 1 + scaleEffect * (maxScale - 1) * curveIntensity * 0.5;

  // Actualizar posición
  this.carPosition.x = targetX;
  this.carPosition.y = targetY;
  this.carPosition.angle = finalAngle;
  this.carPosition.scale = targetScale;
}
  selectSprint(week: number): void {
    if (week === this.currentSegmentEnd + 1 || this.isAnimating) {
      return;
    }
    
    const points = this.getSprintPoints();
    const currentWeekIndex = this.currentSegmentEnd;
    const targetWeekIndex = week - 1;
    
    const currentPoint = points[currentWeekIndex];
    const targetPoint = points[targetWeekIndex];

    if (!currentPoint || !targetPoint) return;
    
    // Generar la ruta de puntos intermedios (índices)
    const path = this.generatePath(currentWeekIndex, targetWeekIndex);
    
    if (path.length < 2) return;
    
    // Configurar la interpolación de Offset (Rotación Extra)
    // Los offsets se calculan al vuelo en base a la semana par/impar
    this.currentOffsetAngle = this.getOffsetAngle(currentWeekIndex); 
    this.targetOffsetAngle = this.getOffsetAngle(targetWeekIndex);   
    
    // Configurar la animación del path
    this.currentSegmentStart = path[0];
    this.currentSegmentEnd = path[1];
    this.pathQueue = path.slice(2); 
    
    this.animationProgress = 0;
    this.animationStartTime = 0;
    this.isAnimating = true;
    
    this.currentWeek = week;
    this.updateSelectedSprint();
  }

  private updateSelectedSprint(): void {
    this.selectedSprint = this.sprintDetails?.find(s => s.week === this.currentWeek) || {
      week: this.currentWeek,
      title: `Sprint ${this.currentWeek}`,
      description: `Descripción del sprint ${this.currentWeek}`
    };
  }
  
  // La inicialización y cálculo de límites de pista no necesitan cambios
  private initializeTrack(): void {
    for (let i = 0; i <= this.STEPS; i++) {
      const t = i / this.STEPS;
      const x = 5 + t * 90; 
      const y = 50 + this.AMPLITUDE * Math.sin(t * this.WAVES * 2 * Math.PI);
      
      this.trackPoints.push({x, y, angle: 0}); 
    }

    for (let i = 0; i < this.trackPoints.length; i++) {
      const current = this.trackPoints[i];
      const next = this.trackPoints[Math.min(i + 1, this.trackPoints.length - 1)];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      current.angle = Math.atan2(dy, dx) * (180 / Math.PI);
    }

    this.calculateTrackBoundaries();
  }

  private calculateTrackBoundaries(): void {
    this.innerTrackPoints = [];
    this.outerTrackPoints = [];

    for (let i = 0; i < this.trackPoints.length; i++) {
      const current = this.trackPoints[i];
      const perpAngle = (current.angle + 90) * (Math.PI / 180);
      
      const innerX = current.x + Math.cos(perpAngle) * (this.TRACK_WIDTH / 2);
      const innerY = current.y + Math.sin(perpAngle) * (this.TRACK_WIDTH / 2);
      const outerX = current.x - Math.cos(perpAngle) * (this.TRACK_WIDTH / 2);
      const outerY = current.y - Math.sin(perpAngle) * (this.TRACK_WIDTH / 2);
      
      this.innerTrackPoints.push({ x: innerX, y: innerY, angle: current.angle });
      this.outerTrackPoints.push({ x: outerX, y: outerY, angle: current.angle });
    }
  }

  getPath(): string {
    if (this.outerTrackPoints.length === 0 || this.innerTrackPoints.length === 0) {
      return '';
    }

    let path = `M ${this.outerTrackPoints[0].x} ${this.outerTrackPoints[0].y}`;
    
    for (let i = 1; i < this.outerTrackPoints.length; i++) {
      path += ` L ${this.outerTrackPoints[i].x} ${this.outerTrackPoints[i].y}`;
    }
    
    path += ` L ${this.innerTrackPoints[this.innerTrackPoints.length - 1].x} ${this.innerTrackPoints[this.innerTrackPoints.length - 1].y}`;
    
    for (let i = this.innerTrackPoints.length - 2; i >= 0; i--) {
      path += ` L ${this.innerTrackPoints[i].x} ${this.innerTrackPoints[i].y}`;
    }
    
    return path + ' Z';
  }

  getSprintPoints(): Point[] {
    const points: Point[] = [];
    
    for (let wave = 0; wave < this.WAVES; wave++) {
      const t_peak = (Math.PI / 2 + wave * 2 * Math.PI) / (this.WAVES * 2 * Math.PI);
      const index_peak = Math.floor(t_peak * this.STEPS);
      if (index_peak >= 0 && index_peak < this.trackPoints.length) {
        points.push(this.trackPoints[index_peak]);
      }
      
      const t_valley = (3 * Math.PI / 2 + wave * 2 * Math.PI) / (this.WAVES * 2 * Math.PI);
      const index_valley = Math.floor(t_valley * this.STEPS);
      if (index_valley >= 0 && index_valley < this.trackPoints.length) {
        points.push(this.trackPoints[index_valley]);
      }
    }
    
    const requiredPoints = this.totalWeeks;
    let i = 0;
    while (points.length < requiredPoints) {
      const t = i / (this.totalWeeks - 1);
      const index = Math.floor(t * this.STEPS);
      
      const pointToAdd = this.trackPoints[Math.min(index, this.trackPoints.length - 1)];
      if (pointToAdd && !points.find(p => p.x === pointToAdd.x && p.y === pointToAdd.y)) {
         points.push(pointToAdd);
      }
      i += 1;
      if (i > this.STEPS) break;
    }
    
    points.sort((a, b) => a.x - b.x);
    
    return points.slice(0, requiredPoints);
  }

  
  getProgressPercentage(week: number): number {
    return Math.min(week * 14, 100);
  }

  getProgressWidth(week: number): string {
    return Math.min(week * 14, 100) + '%';
  }
}