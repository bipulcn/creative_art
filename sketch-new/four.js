const canvasSketch = require('canvas-sketch');

// --- Settings ---
const settings = {
  dimensions: [ 600, 600 ],
  animate: true
};

// --- 1. The Box Class ---
class Box {
  constructor(x, y, size) {
    // Position (top-left corner)
    this.x = x;
    this.y = y;
    this.size = size; // Width and height are the same

    // Velocity (random direction and speed)
    this.velocityX = (Math.random() - 0.5) * 4; // Slightly slower
    this.velocityY = (Math.random() - 0.5) * 4;

    // Mass is proportional to area (size * size)
    this.mass = this.size * this.size; 
    
    // Random color
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`; // Slightly different HSL values
  }

  // Draw the box
  draw(context) {
    context.fillStyle = this.color;
    // Draw from top-left corner
    context.fillRect(this.x, this.y, this.size, this.size); 
  }

  // Update position and check for wall bounces
  update(width, height) {
    // Check horizontal (x) bounds for WALLS
    // If box hits right wall OR left wall
    if (this.x + this.size > width || this.x < 0) {
      this.velocityX *= -1; // Reverse horizontal direction
      // Prevent sticking to wall
      if (this.x + this.size > width) this.x = width - this.size;
      if (this.x < 0) this.x = 0;
    }

    // Check vertical (y) bounds for WALLS
    // If box hits bottom wall OR top wall
    if (this.y + this.size > height || this.y < 0) {
      this.velocityY *= -1; // Reverse vertical direction
       // Prevent sticking to wall
      if (this.y + this.size > height) this.y = height - this.size;
      if (this.y < 0) this.y = 0;
    }

    // Move the box
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

// --- 2. The Sketch Function ---
const sketch = ({ width, height }) => {
  
  // --- Setup (runs once) ---
  const boxes = []; // Array to hold all box objects
  const numBoxes = 30; // Fewer boxes might perform better

  for (let i = 0; i < numBoxes; i++) {
    const size = Math.random() * 30 + 10; // Size between 10 and 40
    // Spawn box inside the canvas, not on the edge
    const x = Math.random() * (width - size); 
    const y = Math.random() * (height - size);
    
    // Simple check to avoid immediate overlap at start (basic)
    let overlapping = false;
    for(let j=0; j < boxes.length; j++) {
        if (
            x < boxes[j].x + boxes[j].size &&
            x + size > boxes[j].x &&
            y < boxes[j].y + boxes[j].size &&
            y + size > boxes[j].y
        ) {
            overlapping = true;
            break; // Found overlap, no need to check further
        }
    }

    // Only add if not overlapping (or retry placement - skipped for simplicity)
    if (!overlapping) {
       boxes.push(new Box(x, y, size));
    } else {
        // Optional: Could try generating x, y again here
        // console.warn("Skipped overlapping box at start");
    }

    // Keep adding until we have numBoxes (simple way, might be slightly fewer)
    if (boxes.length >= numBoxes) break; 
  }

  // --- Render (runs repeatedly) ---
  return ({ context, width, height }) => {
    context.fillStyle = 'black'; // Black background
    context.fillRect(0, 0, width, height);

    // --- 1. Update positions and do wall bounces ---
    boxes.forEach(box => {
      box.update(width, height); 
    });

    // --- 2. Check for and resolve BOX-TO-BOX collisions (AABB) ---
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const box1 = boxes[i];
        const box2 = boxes[j];
        
        // AABB Collision Check
        if (
          box1.x < box2.x + box2.size &&   // box1 left edge vs box2 right edge
          box1.x + box1.size > box2.x &&   // box1 right edge vs box2 left edge
          box1.y < box2.y + box2.size &&   // box1 top edge vs box2 bottom edge
          box1.y + box1.size > box2.y      // box1 bottom edge vs box2 top edge
        ) {
          // Collision detected! Simple response: swap velocities (crude but easy)
          // A more accurate response would determine axis of collision and only swap relevant velocity
          
          // Basic velocity swap:
          const tempVx = box1.velocityX;
          const tempVy = box1.velocityY;
          box1.velocityX = box2.velocityX;
          box1.velocityY = box2.velocityY;
          box2.velocityX = tempVx;
          box2.velocityY = tempVy;

          // *** Simple position correction to prevent sticking ***
          // Find overlap on each axis
          const overlapX = (box1.size / 2 + box2.size / 2) - Math.abs((box1.x + box1.size / 2) - (box2.x + box2.size / 2));
          const overlapY = (box1.size / 2 + box2.size / 2) - Math.abs((box1.y + box1.size / 2) - (box2.y + box2.size / 2));

          // Push apart along the axis with LESS overlap (likely axis of entry)
          if (overlapX < overlapY) {
            const sign = Math.sign((box1.x + box1.size / 2) - (box2.x + box2.size / 2));
            box1.x += overlapX / 2 * sign;
            box2.x -= overlapX / 2 * sign;
            // Optionally reverse only X velocity here if desired
            // box1.velocityX *= -1; 
            // box2.velocityX *= -1;
          } else {
            const sign = Math.sign((box1.y + box1.size / 2) - (box2.y + box2.size / 2));
            box1.y += overlapY / 2 * sign;
            box2.y -= overlapY / 2 * sign;
            // Optionally reverse only Y velocity here if desired
            // box1.velocityY *= -1;
            // box2.velocityY *= -1;
          }
          
        }
      }
    }

    // --- 3. Draw all boxes in their final positions ---
    boxes.forEach(box => {
      box.draw(context);
    });
  };
};

canvasSketch(sketch, settings);