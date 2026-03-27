export interface Vector2 {
  x: number;
  y: number;
}

export interface Charge {
  x: number;
  y: number;
  value: number; // In Coulombs (scaled for game)
  type: 'positive' | 'negative';
}

const K = 9000; // Coulomb's constant scaled for pixels/gameplay

export const PhysicsEngine = {
  getDistance: (p1: Vector2, p2: Vector2): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  },

  getForce: (q1: Charge, q2: Charge): number => {
    const r = PhysicsEngine.getDistance(q1, q2);
    if (r < 10) return 0; // Prevent infinity
    return (K * Math.abs(q1.value * q2.value)) / (r * r);
  },

  getElectricFieldAt: (point: Vector2, charges: Charge[]): Vector2 => {
    let ex = 0;
    let ey = 0;

    charges.forEach(q => {
      const r = PhysicsEngine.getDistance(point, q);
      if (r < 5) return; // Inside the charge

      const fieldMag = (K * q.value) / (r * r);
      const angle = Math.atan2(point.y - q.y, point.x - q.x);
      
      ex += fieldMag * Math.cos(angle);
      ey += fieldMag * Math.sin(angle);
    });

    return { x: ex, y: ey };
  },

  getFieldDirection: (point: Vector2, charges: Charge[]): number => {
    const field = PhysicsEngine.getElectricFieldAt(point, charges);
    return Math.atan2(field.y, field.x);
  },

  // Trace a field line starting from a point
  traceFieldLine: (startPoint: Vector2, charges: Charge[], direction: 1 | -1 = 1, maxLength: number = 1000): Vector2[] => {
    const points: Vector2[] = [startPoint];
    let current = { ...startPoint };
    const stepSize = 5;

    for (let i = 0; i < maxLength / stepSize; i++) {
      const field = PhysicsEngine.getElectricFieldAt(current, charges);
      const mag = Math.sqrt(field.x * field.x + field.y * field.y);
      
      if (mag < 0.01) break;

      current.x += (field.x / mag) * stepSize * direction;
      current.y += (field.y / mag) * stepSize * direction;

      // Check if we hit a charge
      let hit = false;
      for (const q of charges) {
        if (PhysicsEngine.getDistance(current, q) < 10) {
          hit = true;
          break;
        }
      }

      points.push({ ...current });
      if (hit) break;
      
      // Bounds check
      if (current.x < -100 || current.x > 2000 || current.y < -100 || current.y > 2000) break;
    }

    return points;
  }
};
