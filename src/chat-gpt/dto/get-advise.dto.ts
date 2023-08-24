import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class GetAdviseDto {
  @ApiProperty({
    type: [String],
    example: ['당뇨', '천식', '고혈압'],
    required: true,
  })
  @ArrayNotEmpty()
  @IsArray()
  diseases: string[];

  @ApiProperty({
    type: [String],
    example: [
      [
        '카페인',
        '아스파탐',
        '카페인',
        '알로에',
        '밀가루',
        '가공유지(팜분별유(부분경화유:말레이시아산)',
      ],
      [
        '이약1캡슐(900mg) 중',
        '아세트아미노펜(KP) 180.00mg',
        '덱스트로메토르판브롬화수소산염수화물 (KP) 8.00mg',
        '슈도에페드린염산염(USP) 1500mg',
        '트리프롤리딘염산염수화물(USP) 0.66mg',
        'd-메틸에페드린염산염(KP) 1250mg',
      ],
    ],
    required: true,
  })
  @ArrayNotEmpty()
  @IsArray()
  ingredients: string[];
}
