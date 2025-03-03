import { Point } from "~/types/ai";

const BOARD_RADIUS = 170; // Radius of the dartboard in pixels
const BULLSEYE_RADIUS = 12.7; // Radius of the bullseye in mm
const INNER_BULL_RADIUS = 31.8; // Radius of the inner bull in mm
const OUTER_BULL_RADIUS = 99; // Radius of the outer bull in mm
const SEGMENT_ANGLE = 18; // Each segment of the dartboard is 18 degrees

export function isInsideBullseye(point: Point): boolean {
    const distance = calculateDistanceFromCenter(point);
    return distance <= BULLSEYE_RADIUS;
}

export function isInsideInnerBull(point: Point): boolean {
    const distance = calculateDistanceFromCenter(point);
    return distance <= INNER_BULL_RADIUS;
}

export function isInsideOuterBull(point: Point): boolean {
    const distance = calculateDistanceFromCenter(point);
    return distance <= OUTER_BULL_RADIUS;
}

export function calculateDistanceFromCenter(point: Point): number {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}

export function getSegmentScore(angle: number): number {
    const normalizedAngle = angle % 360;
    const segmentIndex = Math.floor(normalizedAngle / SEGMENT_ANGLE);
    return segmentIndex + 1; // Scores are 1-20 for segments
}

export function getScoreForPoint(point: Point): number {
    const distance = calculateDistanceFromCenter(point);
    if (isInsideBullseye(point)) {
        return 50; // Bullseye score
    } else if (isInsideInnerBull(point)) {
        return 25; // Inner bull score
    } else if (distance > BOARD_RADIUS) {
        return 0; // Outside the board
    } else {
        const angle = Math.atan2(point.y, point.x) * (180 / Math.PI) + 180; // Convert to degrees
        return getSegmentScore(angle); // Get score based on segment
    }
}