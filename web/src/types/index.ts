interface LatLng {
  lat: number;
  lng: number;
}

export interface User {
  id: number;
  name: string;
}

export interface CreateUserRequest {
  name: string;
}

export interface CreateUserResponse {
  id: string;
  name: string;
}

export interface CreateNutrientRequest {
  x: number;
  y: number;
  planted_by: number;
  // nutrient_type: string;
  is_drained: boolean;
}

export interface CreateNutrientResponse {
  message: string;
  nutrient: Nutrient;
  active_drive: {
    nutrient_success: number,
    nutrient_fail: number,
  }
}

// Nutrients 관련 타입
export interface Nutrient {
  planted_x: number;
  planted_y: number;
  planted_by: number;
  planted_time: string;
  is_drained: boolean;
  id: number;
  nutrient_type: string;
}

// Tree 관련 타입
export interface Tree {
  exp: number;
  owner_id: number,
  tree_type: string,
  id: number
}

export interface CreateTreeRequest {
  owner_id: number;
}

// Driving 관련 타입
export interface PostEndDrivingRequest {
  user_id: number;
  x: number;
  y: number;
}

export interface DrivingSession {
  nutrient_fail: number;
  progress: "in_progress" | "finished";
  driver_id: number;
  nutrient_success: number;
  id: number;
}

export interface EndDrivingResponse {
  message: string;
  drive: DrivingSession;
  parking_space: string;
  tree_exp_update: number;
  tree_id: number;
}

export interface Prediction {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  class: number; // 1: Helmet 0: No Helmet
}

// Helmet Detection 관련 타입
export interface HelmetDetectionResponse {
  predictions: Prediction[];
  output_dir: string;
}

export interface PostParkingSpaceRequest {
  center_x: number;
  center_y: number;
  width: number;
  height: number;
}

// Parking Spaces 관련 타입
export interface ParkingSpace {
  id: string;
  center_x: number;
  center_y: number;
  width: number;
  height: number;
}

export type { LatLng };
