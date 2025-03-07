import { IsNumber, Min, Max } from 'class-validator';

export class LocationDto {
  @IsNumber()
  @Min(-90, { message: 'range of lat is invalid' })
  @Max(90, { message: 'range of lat is invalid' })
  lat: number;

  @IsNumber()
  @Min(-180, { message: 'range of lng is invalid' })
  @Max(180, { message: 'range of lng is invalid' })
  lng: number;
}
