import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ExtractTarget } from '../enum/enum';
import { ApiProperty } from '@nestjs/swagger';

export class ExtractIngredientsDto {
  @ApiProperty({
    type: String,
    example: `[원료약품및그분량] 이약1캡슐(900mg) 중아세트아미노펜(KP) 180.00mg 덱스트로메토르판브롬화수소산염수화물 (KP) 8.00mg슈도에페드린염산염(USP) 1500mg 트리프롤리딘염산염수화물(USP) 0.66mgd-메틸에페드린염산염(KP) 1250mg[싱싱] 부적 내시 용석의투명한 내용물을 함유한 황색의 두양인력전형 연설임플[용법.용량] 만 15세 이상 및 성인: 1일 3회. `,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    example: 'CHEMIST 또는 NUTRITIONIST',
  })
  @IsNotEmpty()
  @IsEnum(ExtractTarget, { message: '유효하지 않은 target입니다.' })
  extractTarget: ExtractTarget;
}
