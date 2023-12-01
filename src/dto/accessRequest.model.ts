export class AccessRequest {

  orderId: string;

  registration?: string;

  customer?: string;

  loadingTsMin: Date;

  loadingTsMax?: Date;

  deliveryTsMin?: Date;

  deliveryTsMax: Date;

  startLocation?: any;

  startLocationAddress?: any;

  endLocation?: any;

  endLocationAddress?: any;

  deltaBefore?: number;

  deltaAfter?: number;

  active?: boolean;
}
