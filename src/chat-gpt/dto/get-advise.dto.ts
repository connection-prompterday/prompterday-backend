import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class GetAdviseDto {
  @ApiProperty({
    type: [String], // Define the type of array elements
    example: ['당뇨', '천식', '고혈압'],
  })
  @ArrayNotEmpty()
  @IsArray()
  diseases: string[];

  @ApiProperty({
    type: [String], // Define the type of array elements
    example: [
      '카페인',
      '아스파탐',
      '카페인',
      '알로에',
      '밀가루',
      '가공유지(팜분별유(부분경화유:말레이시아산)',
    ],
  })
  @ArrayNotEmpty()
  @IsArray()
  ingredients: string[];
}
